# SwiPall POS - Web Application

Aplicación web de punto de venta con arquitectura REST API + SPA (Single Page Application). Backend en Flask (Python) y frontend en React con Vite.

## Arquitectura

La aplicación utiliza una arquitectura moderna de separación de responsabilidades:

- **Backend**: Flask API REST pura en puerto 5000
- **Frontend**: React SPA con React Router en puerto 5173 (desarrollo) o servido desde `/` en producción
- **Base de datos**: MySQL con SQLAlchemy ORM

## Prerrequisitos

- Python 3.9+
- Node.js 16+ con npm
- MySQL 8.0+

## Instalación

### 1. Clonar o navegar al directorio del proyecto
```bash
cd appWeb
```

### 2. Configurar el entorno Python

Crear un entorno virtual:
```bash
python3 -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
```

Instalar dependencias de Python:
```bash
pip install -r backend/requirements.txt
```

### 3. Configurar variables de entorno

Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example backend/.env
```

Actualizar `backend/.env` con credenciales de MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=swipall_pos
FLASK_PORT=5000
VITE_API_URL=http://localhost:5000/api
```

### 4. Configurar la base de datos MySQL

Asegúrate que MySQL esté ejecutándose y crea la base de datos:
```sql
CREATE DATABASE swipall_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ejecutar migraciones de Alembic:
```bash
cd backend
flask db upgrade
```

### 5. Instalar dependencias de Node.js

```bash
cd frontend
npm install
```

## Estructura del Proyecto

```
appWeb/
├── backend/                      # Backend Flask
│   ├── app/
│   │   ├── __init__.py          # Application factory y SPA serving
│   │   ├── config.py            # Configuración de la aplicación
│   │   ├── database.py          # Inicialización de SQLAlchemy
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── main.py          # Health check endpoint
│   │   │   └── api.py           # REST API endpoints
│   │   ├── view_model/          # ViewModels (lógica de presentación)
│   │   │   ├── product/
│   │   │   │   ├── main.py      # ProductViewModel
│   │   │   │   └── list.py
│   │   │   ├── contact/
│   │   │   │   ├── main.py      # ContactViewModel
│   │   │   │   └── list.py
│   │   │   └── order/
│   │   │       ├── main.py      # OrderViewModel
│   │   │       └── list.py
│   │   ├── models/
│   │   │   ├── base.py          # Modelos base
│   │   │   ├── pos.py           # Modelos de POS (Contact, Order)
│   │   │   └── inventory/
│   │   │       └── product.py   # Modelo Product
│   │   ├── scripts/
│   │   │   └── dev.py           # Script de inicio para desarrollo
│   │   ├── static/
│   │   │   └── dist/            # Archivos compilados de React (producción)
│   ├── migrations/              # Migraciones de base de datos (Alembic)
│   ├── tests/                   # Tests (unittest)
│   ├── requirements.txt         # Dependencias de Python
│   ├── main.py                  # Punto de entrada (legacy, usa run.py)
│   └── run.py                   # Punto de entrada de Flask
│
├── frontend/                    # Frontend React
│   ├── src/
│   │   ├── App.jsx              # Componente raíz
│   │   ├── main.jsx             # Punto de entrada
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx    # Listado de productos
│   │   │   ├── ProductFormPage.jsx # Crear/editar producto
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ContactsPage.jsx    # Listado de contactos
│   │   │   ├── ContactFormPage.jsx # Crear contacto
│   │   │   ├── OrdersPage.jsx      # Listado de órdenes
│   │   │   └── OrderFormPage.jsx   # Crear orden
│   │   └── services/
│   │       ├── api.js           # Cliente HTTP para API
│   │       ├── productService.js
│   │       ├── contactService.js
│   │       └── orderService.js
│   ├── index.html               # HTML base de Vite
│   ├── package.json             # Dependencias de Node.js
│   └── vite.config.js           # Configuración de Vite
│
├── .env.example                 # Template de variables de entorno
└── README.md                    # Este archivo
```

## API REST Endpoints

### Productos
- `GET /api/products` - Listar todos los productos
- `GET /api/products/<id>` - Obtener detalle de un producto
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/<id>` - Actualizar producto
- `DELETE /api/products/<id>` - Eliminar producto
- `GET /api/categories` - Listar categorías de productos

### Contactos
- `GET /api/contacts` - Listar todos los contactos
- `POST /api/contacts` - Crear nuevo contacto

### Órdenes
- `GET /api/orders` - Listar todas las órdenes
- `POST /api/orders` - Crear nueva orden

### Salud
- `GET /health` - Health check para load balancers

## Iniciar la Aplicación

### Desarrollo (ambos servidores automáticamente)

```bash
cd appWeb
/Users/daleth/code/msc/appWeb/.venv/bin/python backend/app/scripts/dev.py
```

Este comando inicia:
- **Flask API** en `http://localhost:4003`
- **Vite Dev Server** en `http://localhost:5173` con Hot Module Replacement (HMR)

Accede a la aplicación en: `http://localhost:5173`

### Desarrollo (servidores por separado)

**Terminal 1 - Backend (Flask):**
```bash
source .venv/bin/activate
python backend/run.py
```

**Terminal 2 - Frontend (Vite):**
```bash
cd frontend
npm run dev
```

### Producción

Compilar la aplicación React:
```bash
cd frontend
npm run build
```

Ejecutar Flask (que sirve los archivos compilados):
```bash
source .venv/bin/activate
python backend/run.py
```

La aplicación estará disponible en `http://localhost:4003`

## Script de Desarrollo (`backend/app/scripts/dev.py`)

El script `backend/app/scripts/dev.py` automatiza el inicio de ambos servidores en desarrollo:

**Características:**
- Inicia Flask en el puerto configurado por `FLASK_PORT` (por defecto 5000)
- Espera confirmación de que Flask está listo
- Inicia Vite en puerto 5173
- Captura salida en tiempo real con prefijos `[Flask]` y `[Vite]`
- Manejo graceful de shutdown (SIGTERM → SIGKILL)
- Threading para captura de logs en tiempo real

**Uso:**
```bash
python backend/app/scripts/dev.py
```

Presiona `Ctrl+C` para detener ambos servidores.

## Flujo de Comunicación

1. **Navegador** accede a `http://localhost:5173` (Vite dev server)
2. **Vite** sirve la aplicación React compilada
3. **React** hace peticiones a `http://localhost:5000/api/*` (Backend Flask)
4. **Flask API** procesa la lógica y retorna JSON
5. **React** renderiza los datos en el navegador

## Configuración de CORS

Flask está configurado con CORS habilitado para peticiones desde el frontend:
```python
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

En producción, restringe con dominios específicos.

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de MySQL | localhost |
| `DB_PORT` | Puerto de MySQL | 3306 |
| `DB_USER` | Usuario de MySQL | root |
| `DB_PASSWORD` | Contraseña de MySQL | password |
| `DB_NAME` | Nombre de base de datos | swipall_pos |
| `FLASK_ENV` | Entorno (development/production) | development |
| `VITE_API_URL` | URL de la API (frontend) | http://localhost:5000/api |

## Stack Tecnológico

### Backend
- **Flask** 3.1.0 - Web framework
- **Flask-CORS** - Habilitación de CORS
- **Flask-SQLAlchemy** - ORM
- **Flask-Migrate** - Migraciones de BD
- **SQLAlchemy** 2.0.46 - SQL toolkit
- **PyMySQL** / **mysqlclient** - Driver MySQL
- **python-dotenv** - Variables de entorno

### Frontend
- **React** 18.3.1
- **React Router** v6 - Enrutamiento
- **Vite** 5.4.21 - Bundler
- **Tailwind CSS** - Estilos
- **Material-UI** 5.18.0 - Componentes UI

## Best Practices

- ✅ Arquitectura REST API pura (separación de responsabilidades)
- ✅ SPA con React Router (renderizado en cliente)
- ✅ ViewModels para lógica de negocio
- ✅ Servicios HTTP con abstracción (api.js)
- ✅ CORS configurado para desarrollo
- ✅ Migraciones de BD con Alembic
- ✅ Variables de entorno con .env
- ✅ Hot Module Replacement (HMR) en desarrollo
- ✅ Compilación optimizada para producción

## Troubleshooting

### Flask no inicia
- Verifica que MySQL esté corriendo
- Revisa credenciales en `.env`
- Comprueba que la BD existe

### Vite no inicia
- Asegúrate de haber ejecutado `npm install`
- Verifica que el puerto 5173 esté disponible

### Errores CORS
- Flask debe tener `flask_cors` instalado
- Comprueba que `/api/*` está permitido

### La API retorna 404
- Verifica que Flask esté ejecutándose en puerto 5000
- Comprueba la URL en el archivo `.env` o `src/services/api.js`
