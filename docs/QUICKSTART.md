# Quick Start

5 minutes to get the project installed and running

## Prerequisites

Make sure you have installed:
- Python 3.10+ (Download)
- Node.js 18+ (Download)
- MySQL 8.0+ (Download)

## Installation (Choose your Operating System)

### macOS / Linux

```bash
# 1. Make the script executable
chmod +x setup.sh

# 2. Run the script
./setup.sh

# 3. The script will guide you through:
#    - Verification of Python, Node.js, npm
#    - Installation of dependencies
#    - Database creation from database/DATABASE.sql
#    - Application of migrations
```

### Windows (PowerShell)

```powershell
# 1. Open PowerShell as Administrator

# 2. Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Run the script
.\setup.ps1

# 4. The script will guide you through:
#    - Verification of Python, Node.js, npm
#    - Installation of dependencies
#    - Database creation from database/DATABASE.sql
#    - Application of migrations
```

Alternatively (Manual):

If you prefer to create the database manually without running the script:

```bash
mysql -u root -p < database/DATABASE.sql
```

## Run the Project

Once the script finishes successfully:

### Option A: Both services together (easier)

```bash
source .venv/bin/activate  # Activate virtual environment
python backend/app/scripts/dev.py
```

Then open:
- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:5000

### Option B: Separate terminals (more control)

Terminal 1 - Backend:
```bash
cd backend
source ../.venv/bin/activate
python run.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Verification

If everything is correct, you should see:

Backend:
```
* Running on http://127.0.0.1:5000
```

Frontend:
```
VITE v5.0.0  ready in 1234 ms
Local:   http://127.0.0.1:5173/
```

## Something went wrong?

### Quick solutions:

"Python: command not found"
- Verify Python is installed: `python --version`
- Restart your terminal after installing Python

"Port already in use"
- Close other processes on ports 5000/5173
- Or change `FLASK_PORT` in `backend/.env`

"MySQL connection error"
- Verify MySQL is running
- Check credentials in `backend/.env`

### More help:

- Read SETUP.md for detailed solutions
- Read DOCS.md to navigate all documentation

## Next Steps

1. Project installed
2. Database configured
3. Frontend + Backend running
4. Read API documentation in README.md
5. Start developing!

---

Need help? Check the Complete Guide (SETUP.md) or Documentation Index (DOCS.md)
