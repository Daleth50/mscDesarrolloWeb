#!/bin/bash

###############################################################################
#                  SETUP SCRIPT FOR macOS/Linux                              #
#          Instala dependencias y configura el proyecto completo             #
#                  Backend (Flask) + Frontend (React)                        #
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Start
print_header "INICIANDO INSTALACIÓN DEL PROYECTO"

# Check if running from project root
if [ ! -f "README.md" ]; then
    print_error "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

# Check Python installation
print_info "Verificando Python..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado"
    print_info "Instala Python desde https://www.python.org/downloads/"
    exit 1
fi
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
print_success "Python $PYTHON_VERSION encontrado"

# Check Node.js installation
print_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    print_info "Instala Node.js desde https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION encontrado"

# Check npm installation
print_info "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION encontrado"

# Step 1: Create Python virtual environment
print_header "PASO 1: CONFIGURANDO ENTORNO VIRTUAL PYTHON"

if [ -d ".venv" ]; then
    print_warning "Entorno virtual ya existe"
else
    print_info "Creando entorno virtual..."
    python3 -m venv .venv
    print_success "Entorno virtual creado"
fi

# Activate virtual environment
print_info "Activando entorno virtual..."
source .venv/bin/activate
print_success "Entorno virtual activado"

# Upgrade pip
print_info "Actualizando pip..."
pip install --upgrade pip
print_success "pip actualizado"

# Step 2: Install backend dependencies
print_header "PASO 2: INSTALANDO DEPENDENCIAS DE BACKEND"

if [ -f "backend/requirements.txt" ]; then
    print_info "Instalando paquetes Python..."
    pip install -r backend/requirements.txt
    print_success "Dependencias de backend instaladas"
else
    print_error "backend/requirements.txt no encontrado"
    exit 1
fi

# Step 3: Install frontend dependencies
print_header "PASO 3: INSTALANDO DEPENDENCIAS DE FRONTEND"

if [ -d "frontend" ]; then
    print_info "Instalando paquetes npm..."
    cd frontend
    npm install
    cd ..
    print_success "Dependencias de frontend instaladas"
else
    print_error "Directorio frontend no encontrado"
    exit 1
fi

# Step 4: Create environment files
print_header "PASO 4: CONFIGURANDO ARCHIVOS DE ENTORNO"

# Backend .env
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        print_info "Creando backend/.env desde .env.example..."
        cp backend/.env.example backend/.env
        print_success "backend/.env creado (revisa las variables de entorno)"
        print_warning "⚠ IMPORTANTE: Actualiza las credenciales de MySQL en backend/.env"
    else
        print_warning "backend/.env.example no encontrado, crea backend/.env manualmente"
    fi
else
    print_info "backend/.env ya existe"
fi

# Frontend .env.local
if [ ! -f "frontend/.env.local" ]; then
    print_info "Creando frontend/.env.local..."
    cat > frontend/.env.local << 'EOF'
# API URL - Debe coincidir con FLASK_PORT en backend
VITE_API_URL=http://127.0.0.1:5000/api
EOF
    print_success "frontend/.env.local creado"
else
    print_info "frontend/.env.local ya existe"
fi

# Step 5: Database setup instructions
print_header "PASO 5: CONFIGURACIÓN DE BASE DE DATOS"

print_info "Asegúrate de que MySQL esté ejecutándose"
read -p "¿MySQL está en ejecución? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    print_info "Creando base de datos desde database/DATABASE.sql..."
    
    # Try to execute SQL file directly
    if mysql -u root -p < database/DATABASE.sql 2>/dev/null; then
        print_success "Base de datos creada exitosamente desde database/DATABASE.sql"
        
        # Apply migrations
        print_info "Aplicando migraciones..."
        cd backend
        FLASK_APP=run.py python -m flask db upgrade
        cd ..
        print_success "Migraciones aplicadas"
    else
        print_warning "No se pudo aplicar el script SQL automáticamente."
        print_info "Ejecuta manualmente el siguiente comando:"
        echo -e "${YELLOW}mysql -u root -p < database/DATABASE.sql${NC}"
        
        read -p "¿Ya ejecutaste el script manualmente? (s/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            print_info "Aplicando migraciones..."
            cd backend
            FLASK_APP=run.py python -m flask db upgrade
            cd ..
            print_success "Migraciones aplicadas"
        else
            print_warning "Por favor, ejecuta el script SQL manualmente y aplica las migraciones"
        fi
    fi
else
    print_warning "Inicia MySQL e intenta de nuevo"
    exit 1
fi

# Step 6: Summary
print_header "✅ INSTALACIÓN COMPLETADA"

echo -e "${GREEN}El proyecto ha sido configurado exitosamente!${NC}\n"

echo -e "${BLUE}PRÓXIMOS PASOS:${NC}"
echo "1. Verifica backend/.env con tus credenciales de MySQL"
echo "2. Verifica frontend/.env.local (API_URL debe coincidir con FLASK_PORT)"
echo ""
echo -e "${BLUE}PARA INICIAR EL PROYECTO:${NC}"
echo ""
echo "Opción A - Script unificado (backend + frontend juntos):"
echo -e "  ${YELLOW}source .venv/bin/activate${NC}"
echo -e "  ${YELLOW}python backend/app/scripts/dev.py${NC}"
echo ""
echo "Opción B - Terminales separadas:"
echo ""
echo "Terminal 1 (Backend):"
echo -e "  ${YELLOW}source .venv/bin/activate${NC}"
echo -e "  ${YELLOW}cd backend${NC}"
echo -e "  ${YELLOW}python run.py${NC}"
echo ""
echo "Terminal 2 (Frontend):"
echo -e "  ${YELLOW}cd frontend${NC}"
echo -e "  ${YELLOW}npm run dev${NC}"
echo ""
echo -e "${BLUE}URLs DE ACCESO:${NC}"
echo "  Frontend: http://127.0.0.1:5173"
echo "  Backend:  http://127.0.0.1:5000"
echo ""

print_success "¡Listo para comenzar!"
