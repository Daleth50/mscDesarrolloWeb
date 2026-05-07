# 📖 Guía Completa de Instalación

Este documento proporciona instrucciones detalladas para instalar y configurar el proyecto en macOS, Linux y Windows.

---

## 🚀 Instalación Rápida Automática (5 minutos)

### macOS / Linux
```bash
cd /ruta/del/proyecto
chmod +x setup.sh
./setup.sh
```

### Windows (PowerShell)
```powershell
# Abre PowerShell como Administrador
cd C:\ruta\del\proyecto
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**El script automático:**
- ✅ Verifica Python 3 y Node.js
- ✅ Crea el entorno virtual
- ✅ Instala todas las dependencias
- ✅ Configura archivos `.env`
- ✅ Crea y prepara la base de datos
- ✅ Aplica migraciones automáticamente

---

## 🔧 Instalación Manual Paso a Paso

### Paso 1: Instalar Requisitos Previos

#### macOS
```bash
# Usar Homebrew (si no lo tienes, instala desde https://brew.sh)
brew install python@3.11
brew install node
brew install mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip nodejs npm mysql-server
```

#### Windows
1. **Python**: Descarga desde [python.org](https://www.python.org/downloads/)
   - ⚠️ **IMPORTANTE**: Marca "Add Python to PATH" durante la instalación
   - Reinicia después de instalar

2. **Node.js**: Descarga desde [nodejs.org](https://nodejs.org/)
   - Elige la versión LTS (18 o superior)
   - npm se instala automáticamente con Node.js

3. **MySQL**: Descarga desde [mysql.com](https://www.mysql.com/downloads/)
   - Elige MySQL Community Server
   - Durante la instalación, anota usuario/contraseña

### Paso 2: Clonar/Descargar el Proyecto

```bash
# Si usas Git:
git clone <URL_DEL_REPOSITORIO>
cd mscDesarrolloWeb

# O descargar y extraer el ZIP
```

### Paso 3: Crear Entorno Virtual Python

```bash
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Windows (CMD)
python -m venv .venv
.venv\Scripts\activate.bat
```

**Deberías ver `(.venv)` al inicio de tu terminal**

### Paso 4: Instalar Dependencias de Backend

```bash
# Asegúrate que el entorno virtual está activado (.venv)
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### Paso 5: Instalar Dependencias de Frontend

```bash
cd frontend
npm install
cd ..
```

### Paso 6: Configurar Variables de Entorno

#### Backend (`backend/.env`)

Copia desde `backend/.env.example` o crea el archivo:

```env
FLASK_ENV=development
FLASK_PORT=5000
SECRET_KEY=dev-secret-change-me

# Base de datos (ajusta según tu MySQL)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=swipall_pos

FRONTEND_URL=http://127.0.0.1:5173
AUTH_TOKEN_MAX_AGE=28800
PASSWORD_RESET_TOKEN_MAX_AGE=3600
```

#### Frontend (`frontend/.env.local`)

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

### Paso 7: Configurar Base de Datos MySQL

#### 1. Iniciar MySQL

**macOS:**
```bash
brew services start mysql
# o manual: /usr/local/opt/mysql/bin/mysqld_safe
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Windows:**
MySQL generalmente inicia automáticamente si la instalaste como servicio.

#### 2. Conectar a MySQL

```bash
mysql -u root -p
# Ingresa la contraseña que configuraste
```

#### 3. Aplicar Script de Base de Datos

En lugar de crear la BD manualmente, simplemente ejecuta:

```bash
mysql -u root -p < database/DATABASE.sql
```

Este comando aplicará:
- Creación de la base de datos `swipall_pos`
- Creación de todas las 12 tablas
- Índices recomendados
- Restricciones de integridad
- Campos de geolocalización en contacts (latitude, longitude)

#### 4. Aplicar Migraciones

```bash
cd backend
source ../.venv/bin/activate  # (o .\.venv\Scripts\Activate.ps1 en Windows)
FLASK_APP=run.py python -m flask db upgrade
cd ..
```

Deberías ver algo como:
```
INFO  [alembic.runtime.migration] Running upgrade  -> 20260227_add_kind_to_contacts, done
INFO  [alembic.runtime.migration] Running upgrade 20260227_add_kind_to_contacts -> 20260506_add_geolocation_to_contacts, done
```

---

## ▶️ Ejecutar el Proyecto

### Opción A: Script Unificado (Más Fácil)

```bash
# Desde la raíz del proyecto
source .venv/bin/activate  # (o .\.venv\Scripts\Activate.ps1 en Windows)
python backend/app/scripts/dev.py
```

Abre el navegador:
- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:5000

### Opción B: Terminales Separadas (Más Control)

**Terminal 1 - Backend:**
```bash
cd backend
source ../.venv/bin/activate
python run.py
```

Debería mostrar:
```
* Running on http://127.0.0.1:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Debería mostrar:
```
VITE v5.0.0  ready in 1234 ms
➜  Local:   http://127.0.0.1:5173/
```

---

## 🏗️ Build para Producción

```bash
# Compilar React
cd frontend
npm run build
cd ..

# Flask servirá los archivos compilados
cd backend
source ../.venv/bin/activate
python run.py
```

Abre http://127.0.0.1:5000

---

## 📋 Verificación Post-Instalación

Ejecuta esta checklist para verificar que todo está correctamente instalado:

```bash
# 1. Verificar Python
python --version
pip list | grep Flask  # Debe mostrar Flask

# 2. Verificar Node.js
node --version
npm --version

# 3. Verificar directorios
ls -la backend/app/models/
ls -la frontend/src/

# 4. Conectar a MySQL
mysql -u root -p -e "SELECT VERSION();"

# 5. Ver estado de migraciones
cd backend
FLASK_APP=run.py python -m flask db current
cd ..
```

---

## 🆘 Problemas Comunes y Soluciones

### "Python: command not found"
- **Causa**: Python no está en el PATH o no está instalado
- **Solución**:
  - Verifica: `which python3` (macOS/Linux) o `Get-Command python` (Windows)
  - Reinstala Python desde [python.org](https://python.org) con "Add to PATH"
  - Reinicia tu terminal

### "No module named flask"
- **Causa**: No activaste el entorno virtual
- **Solución**: 
  ```bash
  source .venv/bin/activate  # macOS/Linux
  .\.venv\Scripts\Activate.ps1  # Windows
  ```

### "Access denied for user 'root'@'localhost'"
- **Causa**: Credenciales MySQL incorrectas en `.env`
- **Solución**:
  1. Verifica usuario/contraseña en `backend/.env`
  2. Prueba conectar manualmente: `mysql -u root -p`
  3. Actualiza las credenciales en `.env`

### "Port 5000 already in use"
- **Causa**: Otro proceso usa el puerto 5000
- **Solución**:
  - Busca qué usa el puerto: `lsof -i :5000` (macOS/Linux)
  - Mata el proceso: `kill -9 <PID>`
  - O cambia FLASK_PORT en `backend/.env` a 5001

### "npm ERR! code ERESOLVE"
- **Causa**: Conflicto de dependencias npm
- **Solución**:
  ```bash
  cd frontend
  npm install --legacy-peer-deps
  ```

### Permisos denegados en macOS/Linux
```bash
chmod +x setup.sh
chmod 755 backend/migrations/versions/*.py
```

---

## 📚 Documentación Adicional

- [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md) - Estructura completa de la BD
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Guía de migraciones
- [README.md](README.md) - Información general del proyecto

---

## ✅ Siguiente Paso

¡Una vez instalado todo, consulta la [documentación de API](README.md#resumen-de-api) o comienza a desarrollar!

Para dudas específicas, abre un issue en el repositorio.

