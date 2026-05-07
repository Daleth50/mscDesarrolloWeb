# Project Documentation

Quick guide to all available documentation

## Quick Start

To install and run the project for the first time:

1. **[SETUP.md](SETUP.md)** - Complete installation guide
   - Automatic installation with scripts
   - Manual step-by-step installation
   - Troubleshooting
   - Post-installation verification

2. **Installation Scripts:**
   - **[setup.sh](setup.sh)** - For macOS/Linux
   - **[setup.ps1](setup.ps1)** - For Windows PowerShell

## Project Documentation

### General Overview
- **[README.md](README.md)** - General project information
  - Architecture description
  - Prerequisites
  - Access URLs
  - API Summary

### Database
- **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** - Complete database structure
  - Description of all tables (12 tables)
  - Columns, types and constraints
  - Relationships between tables
  - Recommended indexes
  - Technical notes

### Migrations
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Database migration guide
  - Recent migration: Geolocation in contacts
  - How to apply migrations
  - How to revert migrations
  - Usage example

---

## Quick Search

### "How do I install the project?"
See [SETUP.md](SETUP.md) section "Quick Automatic Installation"

### "How do I start the project in development?"
See [README.md](README.md) section "Development Execution"

### "What are all the database tables?"
See [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)

### "How do I add fields to the database?"
See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) section "Migration Guide"

### "I get an error when running the script"
See [SETUP.md](SETUP.md) section "Common Problems and Solutions"

### "How do I build for production?"
See [README.md](README.md) section "Production Build and Execution"

### "What is the project structure?"
See [README.md](README.md) section "Project Structure"

### "What endpoints does the API have?"
See [README.md](README.md) section "API Summary"

---

## Cross-Reference Table of Contents

### Backend (Flask)
- View models: `backend/app/models/`
- Configuration: `backend/app/config.py`
- Database: `backend/app/database.py`
- Routes/Endpoints: `backend/app/routes/`
- Migrations: `backend/migrations/versions/`

### Frontend (React)
- Components: `frontend/src/components/`
- Pages: `frontend/src/pages/`
- API Services: `frontend/src/services/api.js`
- Configuration: `frontend/vite.config.js`

### Documentation
- Installation: [SETUP.md](SETUP.md)
- Database: [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)
- Migrations: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- General: [README.md](README.md)

---

## Common Workflows

### 1. First time using the project
```
SETUP.md (Installation)
  → README.md (Execution)
  → DATABASE_STRUCTURE.md (Understand data)
```

### 2. Adding a new field to a model
```
Edit backend/app/models/pos.py
  → Create migration: flask db migrate
  → Apply: flask db upgrade
  → See MIGRATION_GUIDE.md
```

### 3. Troubleshooting a problem
```
SETUP.md (Common Problems)
  → README.md (Troubleshooting)
  → Search project files
```

### 4. Understanding the data structure
```
DATABASE_STRUCTURE.md (Read all tables)
  → README.md (API Summary)
  → backend/app/models/ (View code)
```

---

## Quick Useful Commands

```bash
# Backend
cd backend
source ../.venv/bin/activate
python run.py

# Frontend
cd frontend
npm run dev

# Both together
python backend/app/scripts/dev.py

# Database
flask db current          # View current version
flask db migrate          # Create migration
flask db upgrade          # Apply migrations
flask db downgrade        # Revert last migration
```

---

## Support

If you have questions about:
- **Installation** → See [SETUP.md](SETUP.md)
- **Project Structure** → See [README.md](README.md)
- **Database** → See [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)
- **Database Migrations** → See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

**Last updated**: May 2026
