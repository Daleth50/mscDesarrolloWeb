#!/bin/bash

###############################################################################
#                    START SCRIPT FOR macOS/Linux                            #
#              Inicia Backend (Flask) + Mobile (Ionic) en paralelo           #
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error()   { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info()    { echo -e "${BLUE}ℹ $1${NC}"; }

# Verificar que estamos en la raíz del proyecto
if [ ! -f "README.md" ]; then
    print_error "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

# Verificar entorno virtual
if [ ! -d ".venv" ]; then
    print_error "Entorno virtual no encontrado. Ejecuta primero: ./setup.sh"
    exit 1
fi

# Verificar que existen los directorios
if [ ! -d "backend" ]; then
    print_error "Directorio backend no encontrado"
    exit 1
fi

if [ ! -d "mobile" ]; then
    print_error "Directorio mobile no encontrado"
    exit 1
fi

if [ ! -d "frontend" ]; then
    print_error "Directorio frontend no encontrado"
    exit 1
fi

print_header "INICIANDO BACKEND + MOBILE + FRONTEND"

# Cleanup al salir: matar procesos hijos
cleanup() {
    echo -e "\n${YELLOW}Deteniendo servicios...${NC}"
    kill $BACKEND_PID $MOBILE_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Servicios detenidos.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM

# Iniciar Backend
print_info "Iniciando Backend (Flask)..."
source .venv/bin/activate
cd backend
python run.py &
BACKEND_PID=$!
cd ..
print_success "Backend iniciado (PID: $BACKEND_PID)"

# Pequeña pausa para que el backend levante primero
sleep 2

# Iniciar Mobile
print_info "Iniciando Mobile (Ionic)..."
cd mobile
npm run dev &
MOBILE_PID=$!
cd ..
print_success "Mobile iniciado (PID: $MOBILE_PID)"

# Iniciar Frontend
print_info "Iniciando Frontend (Web)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
print_success "Frontend iniciado (PID: $FRONTEND_PID)"

print_header "SERVICIOS EN EJECUCIÓN"
echo -e "${GREEN}  Backend:  http://127.0.0.1:5000${NC}"
echo -e "${GREEN}  Mobile:   http://127.0.0.1:8100${NC}"
echo -e "${GREEN}  Frontend: http://127.0.0.1:5173${NC}"
echo ""
echo -e "${YELLOW}  Presiona Ctrl+C para detener ambos servicios${NC}"
echo ""

# Esperar a que ambos procesos terminen
wait $BACKEND_PID $MOBILE_PID $FRONTEND_PID
