###############################################################################
#                  SETUP SCRIPT FOR Windows (PowerShell)                     #
#          Instala dependencias y configura el proyecto completo             #
#                  Backend (Flask) + Frontend (React)                        #
###############################################################################

# Require admin privileges
#Requires -RunAsAdministrator

# Configuration
$ErrorActionPreference = "Stop"

# Colors
function Write-Header {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║ $args " -ForegroundColor Blue
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
}

function Write-Success {
    Write-Host "✓ $args" -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host "✗ $args" -ForegroundColor Red
}

function Write-Warning-Custom {
    Write-Host "⚠ $args" -ForegroundColor Yellow
}

function Write-Info {
    Write-Host "ℹ $args" -ForegroundColor Cyan
}

# Start
Write-Header "INICIANDO INSTALACIÓN DEL PROYECTO"

# Check if running from project root
if (-not (Test-Path "README.md")) {
    Write-Error-Custom "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
}

# Function to check if command exists
function Test-CommandExists {
    param($command)
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check Python installation
Write-Info "Verificando Python..."
if (-not (Test-CommandExists python)) {
    Write-Error-Custom "Python no está instalado o no está en PATH"
    Write-Info "Instala Python desde https://www.python.org/downloads/"
    Write-Info "⚠ IMPORTANTE: Selecciona 'Add Python to PATH' durante la instalación"
    exit 1
}

$pythonVersion = (python --version 2>&1)
Write-Success "Python $pythonVersion encontrado"

# Check Node.js installation
Write-Info "Verificando Node.js..."
if (-not (Test-CommandExists node)) {
    Write-Error-Custom "Node.js no está instalado"
    Write-Info "Instala Node.js desde https://nodejs.org/"
    exit 1
}

$nodeVersion = (node --version)
Write-Success "Node.js $nodeVersion encontrado"

# Check npm installation
Write-Info "Verificando npm..."
if (-not (Test-CommandExists npm)) {
    Write-Error-Custom "npm no está instalado"
    exit 1
}

$npmVersion = (npm --version)
Write-Success "npm $npmVersion encontrado"

# Step 1: Create Python virtual environment
Write-Header "PASO 1: CONFIGURANDO ENTORNO VIRTUAL PYTHON"

if (Test-Path ".venv") {
    Write-Warning-Custom "Entorno virtual ya existe"
}
else {
    Write-Info "Creando entorno virtual..."
    python -m venv .venv
    Write-Success "Entorno virtual creado"
}

# Activate virtual environment
Write-Info "Activando entorno virtual..."
& ".\.venv\Scripts\Activate.ps1"
Write-Success "Entorno virtual activado"

# Upgrade pip
Write-Info "Actualizando pip..."
python -m pip install --upgrade pip
Write-Success "pip actualizado"

# Step 2: Install backend dependencies
Write-Header "PASO 2: INSTALANDO DEPENDENCIAS DE BACKEND"

if (Test-Path "backend/requirements.txt") {
    Write-Info "Instalando paquetes Python..."
    pip install -r backend/requirements.txt
    Write-Success "Dependencias de backend instaladas"
}
else {
    Write-Error-Custom "backend/requirements.txt no encontrado"
    exit 1
}

# Step 3: Install frontend dependencies
Write-Header "PASO 3: INSTALANDO DEPENDENCIAS DE FRONTEND"

if (Test-Path "frontend") {
    Write-Info "Instalando paquetes npm..."
    Push-Location frontend
    npm install
    Pop-Location
    Write-Success "Dependencias de frontend instaladas"
}
else {
    Write-Error-Custom "Directorio frontend no encontrado"
    exit 1
}

# Step 4: Create environment files
Write-Header "PASO 4: CONFIGURANDO ARCHIVOS DE ENTORNO"

# Backend .env
if (-not (Test-Path "backend\.env")) {
    if (Test-Path "backend\.env.example") {
        Write-Info "Creando backend\.env desde .env.example..."
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Success "backend\.env creado (revisa las variables de entorno)"
        Write-Warning-Custom "⚠ IMPORTANTE: Actualiza las credenciales de MySQL en backend\.env"
    }
    else {
        Write-Warning-Custom "backend\.env.example no encontrado, crea backend\.env manualmente"
    }
}
else {
    Write-Info "backend\.env ya existe"
}

# Frontend .env.local
if (-not (Test-Path "frontend\.env.local")) {
    Write-Info "Creando frontend\.env.local..."
    @"
# API URL - Debe coincidir con FLASK_PORT en backend
VITE_API_URL=http://127.0.0.1:5000/api
"@ | Out-File "frontend\.env.local" -Encoding UTF8
    Write-Success "frontend\.env.local creado"
}
else {
    Write-Info "frontend\.env.local ya existe"
}

# Step 5: Database setup instructions
Write-Header "PASO 5: CONFIGURACIÓN DE BASE DE DATOS"

Write-Info "Asegúrate de que MySQL esté ejecutándose"
$response = Read-Host "¿MySQL está en ejecución? (s/n)"

if ($response -eq "s" -or $response -eq "S") {
    Write-Info "Creando base de datos desde database\DATABASE.sql..."
    
    try {
        # Execute SQL file
        $sqlFile = "database\DATABASE.sql"
        if (Test-Path $sqlFile) {
            $sqlContent = Get-Content $sqlFile -Raw
            Write-Info "Aplicando script SQL..."
            
            # Try to apply the SQL script
            $output = mysql -u root -p < $sqlFile 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Base de datos creada exitosamente desde database\DATABASE.sql"
            }
            else {
                Write-Warning-Custom "No se pudo aplicar el script SQL automáticamente."
                Write-Info "Ejecuta manualmente el siguiente comando:"
                Write-Host "mysql -u root -p < database\DATABASE.sql" -ForegroundColor Yellow
                
                $dbResponse = Read-Host "¿Ya ejecutaste el script manualmente? (s/n)"
                
                if ($dbResponse -eq "s" -or $dbResponse -eq "S") {
                    Write-Info "Continuando con migraciones..."
                }
                else {
                    Write-Warning-Custom "Por favor, ejecuta el script SQL manualmente"
                }
            }
        }
        else {
            Write-Error-Custom "No se encontró database\DATABASE.sql"
            exit 1
        }
        
        Write-Info "Aplicando migraciones..."
        Push-Location backend
        $env:FLASK_APP = "run.py"
        python -m flask db upgrade
        Pop-Location
        Write-Success "Migraciones aplicadas"
    }
    catch {
        Write-Warning-Custom "Error durante la creación de la base de datos"
        Write-Warning-Custom "Ejecuta manualmente: mysql -u root -p < database\DATABASE.sql"
    }
}
else {
    Write-Warning-Custom "Inicia MySQL e intenta de nuevo"
    exit 1
}

# Step 6: Summary
Write-Header "✅ INSTALACIÓN COMPLETADA"

Write-Host "El proyecto ha sido configurado exitosamente!" -ForegroundColor Green
Write-Host ""

Write-Host "PRÓXIMOS PASOS:" -ForegroundColor Blue
Write-Host "1. Verifica backend\.env con tus credenciales de MySQL"
Write-Host "2. Verifica frontend\.env.local (API_URL debe coincidir con FLASK_PORT)"
Write-Host ""

Write-Host "PARA INICIAR EL PROYECTO:" -ForegroundColor Blue
Write-Host ""

Write-Host "Opción A - Script unificado (backend + frontend juntos):" -ForegroundColor Blue
Write-Host ".\.venv\Scripts\Activate.ps1" -ForegroundColor Yellow
Write-Host "python backend\app\scripts\dev.py" -ForegroundColor Yellow
Write-Host ""

Write-Host "Opción B - Terminales separadas:" -ForegroundColor Blue
Write-Host ""

Write-Host "Terminal 1 (Backend):" -ForegroundColor Blue
Write-Host ".\.venv\Scripts\Activate.ps1" -ForegroundColor Yellow
Write-Host "cd backend" -ForegroundColor Yellow
Write-Host "python run.py" -ForegroundColor Yellow
Write-Host ""

Write-Host "Terminal 2 (Frontend):" -ForegroundColor Blue
Write-Host "cd frontend" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor Yellow
Write-Host ""

Write-Host "URLs DE ACCESO:" -ForegroundColor Blue
Write-Host "  Frontend: http://127.0.0.1:5173"
Write-Host "  Backend:  http://127.0.0.1:5000"
Write-Host ""

Write-Success "¡Listo para comenzar!"
