# AppWeb POS

Point of Sale solution with REST API plus two frontends:

- Web frontend: React + Vite + Material UI
- Mobile frontend: Ionic + Capacitor + React

- Backend: Flask + SQLAlchemy + MySQL
- Auth: Bearer token in `Authorization` header

---

## Available Documentation

All documentation is located in the **`docs/`** folder.

| Document | Description |
|-----------|-------------|
| **[SETUP.md](docs/SETUP.md)** | Complete installation guide (start here) |
| **[DOCS.md](docs/DOCS.md)** | Documentation index and quick reference |
| **[DATABASE_STRUCTURE.md](docs/DATABASE_STRUCTURE.md)** | Complete database schema |
| **[MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md)** | Database migration procedures |

---

## Table of Contents

- [Requirements](#requirements)
- [Quick Installation](#quick-installation)
  - [Automatic Installation](#automatic-installation-recommended)
  - [Manual Installation](#manual-installation-step-by-step)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Database and Migrations](#database-and-migrations)
- [Development Execution](#development-execution)
  - [Start Scripts (Backend + Mobile)](#start-scripts-backend--mobile)
- [Production Build and Execution](#production-build-and-execution)
- [Project Structure](#project-structure)
- [API Summary](#api-summary)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

## Requirements

- **Python** 3.10 or higher [Download](https://www.python.org/downloads/)
- **Node.js** 18 or higher [Download](https://nodejs.org/)
- **npm** (included with Node.js)
- **MySQL** 8.0 or higher [Download](https://www.mysql.com/downloads/)

**Note:** The installation scripts automatically verify these dependencies.

## Quick Installation

### Automatic Installation (recommended)

The easiest way is to use the automatic installation scripts that configure the entire project:

#### macOS / Linux
```bash
chmod +x setup.sh
./setup.sh
```

#### Windows (PowerShell)
```powershell
# Open PowerShell as Administrator and run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**What does the script do?**
- Verifies Python 3 and Node.js
- Creates Python virtual environment
- Installs backend dependencies (Flask, SQLAlchemy, etc)
- Installs web frontend dependencies (React, Vite, etc)
- Installs mobile frontend dependencies (Ionic, Capacitor, etc)
- Creates necessary `.env` files
- Configures the database
- Applies migrations automatically

---

### Manual Installation (step by step)

If you prefer to do it manually:

```bash
# 1) Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 2) Backend dependencies
pip install -r backend/requirements.txt

# 3) Web frontend dependencies
cd frontend
npm install
cd ..

# 4) Mobile frontend dependencies
cd mobile
npm install
cd ..
```

## Environment Variables Configuration

### 1) Backend: `backend/.env`

```env
FLASK_ENV=development
FLASK_PORT=5000
SECRET_KEY=dev-secret-change-me

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=swipall_pos

FRONTEND_URL=http://127.0.0.1:5173
AUTH_TOKEN_MAX_AGE=28800
PASSWORD_RESET_TOKEN_MAX_AGE=3600
```

### 2) Web frontend: `frontend/.env.local`

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

Notes:
- If you change `FLASK_PORT`, also update `VITE_API_URL`.
- If you don't define `VITE_API_URL`, the web frontend uses `http://localhost:4203/api` by default.

### 3) Mobile frontend: `mobile/.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:4203
```

Notes:
- Use `http://127.0.0.1:4203` for the browser/emulator.
- When testing on a physical device, replace `127.0.0.1` with your machine's local IP (e.g. `http://192.168.1.x:4203`) so the device can reach the backend over the network.

## Database and Migrations

Create the database in MySQL:

```sql
CREATE DATABASE swipall_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then load the initial data with `database/SEED.sql`. That seed creates a demo admin user you can use to log in:

- Username: `admin`
- Email: `admin@swipall.io`
- Password: `admin123`

Apply migrations:

```bash
cd backend
source ../.venv/bin/activate
FLASK_APP=run.py flask db upgrade
cd ..
```

## Development Execution

### Start Scripts (Backend + Mobile)

The fastest way to start both services at once:

#### macOS / Linux
```bash
chmod +x start.sh
./start.sh
```

#### Windows (PowerShell)
```powershell
.\start.ps1
```

Both scripts start the Backend and Mobile app in parallel and stop them together when you exit (Ctrl+C on macOS/Linux, or any key on Windows).

| Service | URL |
|---------|-----|
| Backend | http://127.0.0.1:5000 |
| Mobile  | http://127.0.0.1:8100 |

> **Prerequisites:** Run `setup.sh` / `setup.ps1` first to create the virtual environment and install dependencies.

---

### Option A: Single script (backend + web frontend)

```bash
source .venv/bin/activate
python backend/app/scripts/dev.py
```

Expected services:
- Web frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:5000`
- Mobile frontend: `http://127.0.0.1:8100`

### Option B: Separate terminals

Terminal 1 (backend):

```bash
cd backend
source ../.venv/bin/activate
python run.py
```

Terminal 2 (web frontend):

```bash
cd frontend
npm run dev
```

Terminal 3 (mobile frontend):

```bash
cd mobile
npm run dev
```

## Production Build and Execution

Generate the web frontend build in `backend/app/static/dist`:

```bash
cd frontend
npm run build
cd ..
```

Start Flask serving the compiled web frontend:

```bash
cd backend
source ../.venv/bin/activate
python run.py
```

Open `http://127.0.0.1:5000`.

## Project Structure

```text
appWeb/
├── backend/
│   ├── app/
│   │   ├── controllers/      # Logic by module (product, order, contact, report, etc.)
│   │   ├── models/           # SQLAlchemy models
│   │   ├── routes/           # Flask endpoints (`/health`, `/api/*`)
│   │   ├── scripts/dev.py    # Development unified startup
│   │   └── static/dist/      # Web frontend build for production
│   ├── migrations/           # Alembic
│   ├── requirements.txt
│   └── run.py                # Main entry point
├── frontend/                 # Web frontend (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── controllers/
│   │   ├── services/api.js
│   │   └── components/
│   ├── package.json
│   └── vite.config.js
└── mobile/                   # Mobile frontend (Ionic + Capacitor)
    ├── src/
    ├── package.json
    └── capacitor.config.ts
```

## API Summary

Base URL: `/api`

- Auth: `/auth/login`, `/auth/me`, `/auth/password/forgot`, `/auth/password/reset`
- Products and categories: `/products`, `/products/:id/movements`, `/categories`
- Contacts and suppliers: `/contacts`, `/suppliers`
- Orders: `/orders`, `/orders/sales`, `/orders/purchases`
- POS and purchases: `/pos/*`, `/purchases/*`
- Reports: `/reports/overview`
- Users: `/users`
- Accounts receivable: `/bill-accounts`, `/bill-accounts/:id/movements`
- Expenses: `/expenses`, `/expenses/:id`

Health check:
- `GET /health`

Authentication:
- Except for login/recovery endpoints, the API requires `Authorization: Bearer <token>`.

## Useful Commands

```bash
# Iniciar Backend + Mobile juntos (macOS/Linux)
./start.sh

# Iniciar Backend + Mobile juntos (Windows)
.\start.ps1

# Backend
cd backend
source ../.venv/bin/activate
python run.py

# Web frontend
cd frontend
npm run dev
npm run build
npm run preview

# Mobile frontend
cd mobile
npm run dev
```

## Troubleshooting

### Installation script issues

#### setup.sh / start.sh do not run on macOS
```bash
# Give execution permissions:
chmod +x setup.sh start.sh
./setup.sh   # or ./start.sh
```

#### setup.ps1 / start.ps1 do not run on Windows
```powershell
# In PowerShell as Administrator:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1   # or .\start.ps1
```

#### Python/Node.js not recognized
- **Restart your terminal** after installing Python or Node.js
- Verify they are in PATH: `python --version` and `node --version`
- On Windows, ensure you selected "Add Python to PATH" during installation

#### Error creating virtual environment
```bash
# On macOS/Linux:
python3 -m venv .venv
source .venv/bin/activate

# On Windows:
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Backend not starting

- Verify MySQL connection and credentials in `backend/.env`.
- Confirm the database exists and migrations were applied.
- Try running manually: `python -m flask db upgrade`

### Web frontend not connecting to API

- Check `frontend/.env.local` and the `VITE_API_URL` value.
- Verify that Flask port matches the configured URL.
- Use `http://127.0.0.1:5000/api` (not localhost)

### Mobile frontend not connecting to API

- Check the backend URL configured in the mobile app.
- Verify that the backend is running on `http://127.0.0.1:5000`.
- Confirm the device or emulator can reach the backend host.

### 401 Error on endpoints

- Confirm you are sending `Authorization: Bearer <token>`.
- Check token expiration (`AUTH_TOKEN_MAX_AGE`).

### Database migration script fails

1. Verify MySQL is running
2. Check username/password in `backend/.env`
3. Create the database manually:
   ```sql
   CREATE DATABASE swipall_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Apply migrations manually:
   ```bash
   cd backend
   source ../.venv/bin/activate
   python -m flask db upgrade
   ```
