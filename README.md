# Flask Application with MySQL

A simple Flask application template with SQLAlchemy ORM and MySQL database integration.

## Prerequisites

- Python 3.9+
- MySQL 8.0+
- pip

## Installation

1. Clone or navigate to the project directory:
```bash
cd appWeb
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Update `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

## Database Setup

Make sure your MySQL server is running and create the database:

```sql
CREATE DATABASE app_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Running the Application

```bash
python run.py
```

The application will be available at `http://localhost:5000`

## Project Structure

```
appWeb/
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration settings
│   ├── database.py          # SQLAlchemy initialization
│   ├── models/
│   │   ├── __init__.py
│   │   └── base.py          # Database models
│   └── routes/
│       ├── __init__.py
│       └── main.py          # Route blueprints
├── migrations/              # Database migrations (for Alembic)
├── tests/                   # Unit tests
├── .env.example             # Environment variables template
├── requirements.txt         # Project dependencies
├── run.py                   # Application entry point
└── README.md               # This file
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Load balancer health check

## Best Practices Implemented

- Application factory pattern for flexible app creation
- Blueprint-based route organization
- Environment-based configuration
- SQLAlchemy ORM with modern syntax (SQLAlchemy 2.0+)
- Logging setup
- Security headers configuration
- Modular code structure
