# Complete Installation Guide

This document provides detailed instructions for installing and configuring the project on macOS, Linux, and Windows.

---

## Quick Automatic Installation (5 minutes)

### macOS / Linux
```bash
cd /path/to/project
chmod +x setup.sh
./setup.sh
```

### Windows (PowerShell)
```powershell
# Open PowerShell as Administrator
cd C:\path\to\project
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

**The automatic script:**
- Verifies Python 3 and Node.js
- Creates the virtual environment
- Installs all dependencies
- Configures `.env` files
- Creates and prepares the database
- Applies migrations automatically

---

## Manual Step-by-Step Installation

### Step 1: Install Prerequisites

#### macOS
```bash
# Use Homebrew (if you don't have it, install from https://brew.sh)
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
1. **Python**: Download from [python.org](https://www.python.org/downloads/)
   - IMPORTANT: Check "Add Python to PATH" during installation
   - Restart after installing

2. **Node.js**: Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version (18 or higher)
   - npm installs automatically with Node.js

3. **MySQL**: Download from [mysql.com](https://www.mysql.com/downloads/)
   - Choose MySQL Community Server
   - During installation, note the username/password

### Step 2: Clone/Download the Project

```bash
# If using Git:
git clone <REPOSITORY_URL>
cd mscDesarrolloWeb

# Or download and extract the ZIP
```

### Step 3: Create Python Virtual Environment

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

**You should see `(.venv)` at the beginning of your terminal**

### Step 4: Install Backend Dependencies

```bash
# Make sure the virtual environment is activated (.venv)
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 6: Configure Environment Variables

#### Backend (`backend/.env`)

Copy from `backend/.env.example` or create the file:

```env
FLASK_ENV=development
FLASK_PORT=5000
SECRET_KEY=dev-secret-change-me

# Database (adjust according to your MySQL)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=swipall_pos

FRONTEND_URL=http://127.0.0.1:5173
AUTH_TOKEN_MAX_AGE=28800
PASSWORD_RESET_TOKEN_MAX_AGE=3600
```

#### Frontend (`frontend/.env.local`)

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

### Step 7: Configure MySQL Database

#### 1. Start MySQL

**macOS:**
```bash
brew services start mysql
# or manual: /usr/local/opt/mysql/bin/mysqld_safe
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Windows:**
MySQL typically starts automatically if you installed it as a service.

#### 2. Connect to MySQL

```bash
mysql -u root -p
# Enter the password you configured
```

#### 3. Apply Database Script

Instead of creating the database manually, simply run:

```bash
mysql -u root -p < database/DATABASE.sql
```

This command will apply:
- Creation of `swipall_pos` database
- Creation of all 12 tables
- Recommended indexes
- Integrity constraints
- Geolocation fields in contacts (latitude, longitude)

#### 4. Apply Migrations

```bash
cd backend
source ../.venv/bin/activate  # (or .\.venv\Scripts\Activate.ps1 on Windows)
FLASK_APP=run.py python -m flask db upgrade
cd ..
```

You should see something like:
```
INFO  [alembic.runtime.migration] Running upgrade  -> 20260227_add_kind_to_contacts, done
INFO  [alembic.runtime.migration] Running upgrade 20260227_add_kind_to_contacts -> 20260506_add_geolocation_to_contacts, done
```

---

## Run the Project

### Option A: Unified Script (Easier)

```bash
# From the project root
source .venv/bin/activate  # (or .\.venv\Scripts\Activate.ps1 on Windows)
python backend/app/scripts/dev.py
```

Open your browser:
- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:5000

### Option B: Separate Terminals (More Control)

**Terminal 1 - Backend:**
```bash
cd backend
source ../.venv/bin/activate
python run.py
```

Should display:
```
* Running on http://127.0.0.1:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Should display:
```
VITE v5.0.0  ready in 1234 ms
Local:   http://127.0.0.1:5173/
```

---

## Production Build

```bash
# Compile React
cd frontend
npm run build
cd ..

# Flask will serve the compiled files
cd backend
source ../.venv/bin/activate
python run.py
```

Open http://127.0.0.1:5000

---

## Post-Installation Verification

Run this checklist to verify that everything is correctly installed:

```bash
# 1. Verify Python
python --version
pip list | grep Flask  # Should show Flask

# 2. Verify Node.js
node --version
npm --version

# 3. Verify directories
ls -la backend/app/models/
ls -la frontend/src/

# 4. Connect to MySQL
mysql -u root -p -e "SELECT VERSION();"

# 5. Check migration status
cd backend
FLASK_APP=run.py python -m flask db current
cd ..
```

---

## Common Problems and Solutions

### "Python: command not found"
- **Cause**: Python is not in PATH or not installed
- **Solution**:
  - Verify: `which python3` (macOS/Linux) or `Get-Command python` (Windows)
  - Reinstall Python from [python.org](https://python.org) with "Add to PATH"
  - Restart your terminal

### "No module named flask"
- **Cause**: You did not activate the virtual environment
- **Solution**: 
  ```bash
  source .venv/bin/activate  # macOS/Linux
  .\.venv\Scripts\Activate.ps1  # Windows
  ```

### "Access denied for user 'root'@'localhost'"
- **Cause**: Incorrect MySQL credentials in `.env`
- **Solution**:
  1. Verify username/password in `backend/.env`
  2. Try connecting manually: `mysql -u root -p`
  3. Update credentials in `.env`

### "Port 5000 already in use"
- **Cause**: Another process uses port 5000
- **Solution**:
  - Find what uses the port: `lsof -i :5000` (macOS/Linux)
  - Kill the process: `kill -9 <PID>`
  - Or change FLASK_PORT in `backend/.env` to 5001

### "npm ERR! code ERESOLVE"
- **Cause**: npm dependency conflict
- **Solution**:
  ```bash
  cd frontend
  npm install --legacy-peer-deps
  ```

### Permission denied on macOS/Linux
```bash
chmod +x setup.sh
chmod 755 backend/migrations/versions/*.py
```

---

## Additional Documentation

- [DATABASE_STRUCTURE.md](docs/DATABASE_STRUCTURE.md) - Complete database schema
- [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) - Database migration procedures
- [README.md](README.md) - General project information

---

## Next Step

Once everything is installed, check the [API documentation](README.md#api-summary) or start developing!

For specific questions, open an issue in the repository.