###############################################################################
#                    START SCRIPT FOR Windows (PowerShell)                   #
#              Inicia Backend (Flask) + Mobile (Ionic) en paralelo           #
###############################################################################

$ErrorActionPreference = "Stop"

function Write-Header {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║  $args " -ForegroundColor Blue
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
}

function Write-Success  { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Warning-Custom { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Info     { Write-Host "ℹ $args" -ForegroundColor Cyan }

# Verificar que estamos en la raíz del proyecto
if (-not (Test-Path "README.md")) {
    Write-Error-Custom "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
}

# Verificar entorno virtual
if (-not (Test-Path ".venv")) {
    Write-Error-Custom "Entorno virtual no encontrado. Ejecuta primero: .\setup.ps1"
    exit 1
}

# Verificar directorios
if (-not (Test-Path "backend")) {
    Write-Error-Custom "Directorio backend no encontrado"
    exit 1
}

if (-not (Test-Path "mobile")) {
    Write-Error-Custom "Directorio mobile no encontrado"
    exit 1
}

if (-not (Test-Path "frontend")) {
    Write-Error-Custom "Directorio frontend no encontrado"
    exit 1
}

Write-Header "INICIANDO BACKEND + MOBILE + FRONTEND"

# Iniciar Backend en nueva ventana de PowerShell
Write-Info "Iniciando Backend (Flask)..."
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "& '.\.venv\Scripts\Activate.ps1'; Set-Location backend; python run.py" `
    -PassThru
Write-Success "Backend iniciado (PID: $($backendJob.Id))"

# Pequeña pausa para que el backend levante primero
Start-Sleep -Seconds 2

# Iniciar Mobile en nueva ventana de PowerShell
Write-Info "Iniciando Mobile (Ionic)..."
$mobileJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Set-Location mobile; npm run dev" `
    -PassThru
Write-Success "Mobile iniciado (PID: $($mobileJob.Id))"

# Iniciar Frontend en nueva ventana de PowerShell
Write-Info "Iniciando Frontend (Web)..."
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Set-Location frontend; npm run dev" `
    -PassThru
Write-Success "Frontend iniciado (PID: $($frontendJob.Id))"

Write-Header "SERVICIOS EN EJECUCIÓN"
Write-Host "  Backend:  http://127.0.0.1:5000" -ForegroundColor Green
Write-Host "  Mobile:   http://127.0.0.1:8100" -ForegroundColor Green
Write-Host "  Frontend: http://127.0.0.1:5173" -ForegroundColor Green
Write-Host ""
Write-Host "  Cierra las ventanas de PowerShell para detener los servicios." -ForegroundColor Yellow
Write-Host ""

# Mantener el script activo hasta que el usuario presione una tecla
Write-Host "Presiona cualquier tecla para detener ambos servicios..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Warning-Custom "Deteniendo servicios..."
Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $mobileJob.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
Write-Success "Servicios detenidos."
