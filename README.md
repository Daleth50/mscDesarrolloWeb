# AppWeb POS

Aplicación web de punto de venta con arquitectura SPA + API REST.

- Backend: Flask + SQLAlchemy + MySQL
- Frontend: React + Vite + Material UI
- Auth: token Bearer en encabezado `Authorization`

---

## 📚 Documentación Disponible

| Documento | Descripción |
|-----------|-------------|
| **[SETUP.md](SETUP.md)** | ⚡ Guía completa de instalación (comenzar aquí) |
| **[DOCS.md](DOCS.md)** | 📖 Índice de documentación y búsqueda rápida |
| **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** | 🗄️ Estructura completa de la base de datos |
| **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** | 🔄 Guía de migraciones |

---

## Tabla de contenido

- [Requisitos](#requisitos)
- [Instalación rápida](#instalación-rápida)
  - [Instalación automática](#-instalación-automática-recomendado)
  - [Instalación manual](#-instalación-manual-paso-a-paso)
- [Configuración de variables de entorno](#configuración-de-variables-de-entorno)
- [Base de datos y migraciones](#base-de-datos-y-migraciones)
- [Ejecución en desarrollo](#ejecución-en-desarrollo)
- [Build y ejecución tipo producción](#build-y-ejecución-tipo-producción)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Resumen de API](#resumen-de-api)
- [Comandos útiles](#comandos-útiles)
- [Solución de problemas](#solución-de-problemas)

## Requisitos

- **Python** 3.10 o superior → [Descargar](https://www.python.org/downloads/)
- **Node.js** 18 o superior → [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **MySQL** 8.0 o superior → [Descargar](https://www.mysql.com/downloads/)

**Nota:** Los scripts de instalación verifican automáticamente estas dependencias.

## Instalación rápida

### ⚡ Instalación automática (recomendado)

La forma más sencilla es usar los scripts de instalación automática que configuran todo el proyecto:

#### 📱 macOS / Linux
```bash
chmod +x setup.sh
./setup.sh
```

#### 🪟 Windows (PowerShell)
```powershell
# Abre PowerShell como Administrador y ejecuta:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**¿Qué hace el script?**
✓ Verifica Python 3 y Node.js
✓ Crea entorno virtual Python
✓ Instala dependencias de backend (Flask, SQLAlchemy, etc)
✓ Instala dependencias de frontend (React, Vite, etc)
✓ Crea archivos `.env` necesarios
✓ Configura la base de datos
✓ Aplica migraciones automáticamente

---

### 📖 Instalación manual (paso a paso)

Si prefieres hacerlo manualmente:

```bash
# 1) Entorno virtual Python
python3 -m venv .venv
source .venv/bin/activate

# 2) Dependencias backend
pip install -r backend/requirements.txt

# 3) Dependencias frontend
cd frontend
npm install
cd ..
```

## Configuración de variables de entorno

### 1) Backend: `backend/.env`

```env
FLASK_ENV=development
FLASK_PORT=5000
SECRET_KEY=dev-secret-change-me

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=swipall_pos

FRONTEND_URL=http://127.0.0.1:5173
AUTH_TOKEN_MAX_AGE=28800
PASSWORD_RESET_TOKEN_MAX_AGE=3600
```

### 2) Frontend: `frontend/.env.local`

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

Nota:
- Si cambias `FLASK_PORT`, actualiza también `VITE_API_URL`.
- Si no defines `VITE_API_URL`, el frontend usa por defecto `http://localhost:4203/api`.

## Base de datos y migraciones

Crear base de datos en MySQL:

```sql
CREATE DATABASE swipall_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Aplicar migraciones:

```bash
cd backend
source ../.venv/bin/activate
FLASK_APP=run.py flask db upgrade
cd ..
```

## Ejecución en desarrollo

### Opción A: script único (backend + frontend)

```bash
source .venv/bin/activate
python backend/app/scripts/dev.py
```

Servicios esperados:
- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:5000`

### Opción B: terminales separadas

Terminal 1 (backend):

```bash
cd backend
source ../.venv/bin/activate
python run.py
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

## Build y ejecución tipo producción

Generar build de React en `backend/app/static/dist`:

```bash
cd frontend
npm run build
cd ..
```

Levantar Flask sirviendo SPA compilada:

```bash
cd backend
source ../.venv/bin/activate
python run.py
```

Abrir `http://127.0.0.1:5000`.

## Estructura del proyecto

```text
appWeb/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Lógica por módulo (product, order, contact, report, etc.)
│   │   ├── models/           # Modelos SQLAlchemy
│   │   ├── routes/           # Endpoints Flask (`/health`, `/api/*`)
│   │   ├── scripts/dev.py    # Arranque conjunto en desarrollo
│   │   └── static/dist/      # Build frontend para producción
│   ├── migrations/           # Alembic
│   ├── requirements.txt
│   └── run.py                # Entry point principal
└── frontend/
	├── src/
	│   ├── pages/
	│   ├── controllers/
	│   ├── services/api.js
	│   └── components/
	├── package.json
	└── vite.config.js
```

## Resumen de API

Base URL: `/api`

- Auth: `/auth/login`, `/auth/me`, `/auth/password/forgot`, `/auth/password/reset`
- Productos y categorías: `/products`, `/products/:id/movements`, `/categories`
- Contactos y proveedores: `/contacts`, `/suppliers`
- Órdenes: `/orders`, `/orders/sales`, `/orders/purchases`
- POS y compras: `/pos/*`, `/purchases/*`
- Reportes: `/reports/overview`
- Usuarios: `/users`
- Cuentas por cobrar: `/bill-accounts`, `/bill-accounts/:id/movements`

Health check:
- `GET /health`

Autenticación:
- Excepto endpoints de login/recuperación, la API requiere `Authorization: Bearer <token>`.

## Comandos útiles

```bash
# Backend
cd backend
source ../.venv/bin/activate
python run.py

# Frontend
cd frontend
npm run dev
npm run build
npm run preview
```

## Solución de problemas

### Problemas con el script de instalación

#### El script setup.sh no ejecuta en macOS
```bash
# Dale permisos de ejecución:
chmod +x setup.sh
./setup.sh
```

#### El script setup.ps1 no ejecuta en Windows
```powershell
# En PowerShell como Administrador:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

#### Python/Node.js no se reconocen
- **Reinicia tu terminal** después de instalar Python o Node.js
- Verifica que estén en el PATH: `python --version` y `node --version`
- En Windows, asegúrate de haber seleccionado "Add Python to PATH" durante la instalación

#### Error al crear el entorno virtual
```bash
# En macOS/Linux:
python3 -m venv .venv
source .venv/bin/activate

# En Windows:
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Backend no levanta

- Verifica conexión y credenciales MySQL en `backend/.env`.
- Confirma que la base de datos existe y que aplicaste migraciones.
- Intenta ejecutar manualmente: `python -m flask db upgrade`

### Frontend no conecta con API

- Revisa `frontend/.env.local` y el valor de `VITE_API_URL`.
- Verifica que el puerto de Flask coincida con la URL configurada.
- Usa `http://127.0.0.1:5000/api` (no localhost)

### Error 401 en endpoints

- Confirma que estás enviando `Authorization: Bearer <token>`.
- Revisa expiración de token (`AUTH_TOKEN_MAX_AGE`).

### El script falla en la migración de BD

1. Verifica que MySQL esté corriendo
2. Revisa usuario/contraseña en `backend/.env`
3. Crea la BD manualmente:
   ```sql
   CREATE DATABASE swipall_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Aplica migraciones manualmente:
   ```bash
   cd backend
   source ../.venv/bin/activate
   python -m flask db upgrade
   ```
