# 📚 Documentación del Proyecto

> Guía rápida a toda la documentación disponible

## 🚀 Inicio Rápido

Para instalar y ejecutar el proyecto por primera vez:

1. **[SETUP.md](SETUP.md)** - Guía completa de instalación
   - Instalación automática con scripts
   - Instalación manual paso a paso
   - Solución de problemas
   - Verificación post-instalación

2. **Scripts de Instalación:**
   - **[setup.sh](setup.sh)** - Para macOS/Linux
   - **[setup.ps1](setup.ps1)** - Para Windows PowerShell

## 📖 Documentación del Proyecto

### Visión General
- **[README.md](README.md)** - Información general del proyecto
  - Descripción de la arquitectura
  - Requisitos previos
  - URLs de acceso
  - Resumen de API

### Base de Datos
- **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** - Estructura completa de la BD
  - Descripción de todas las tablas (12 tablas)
  - Columnas, tipos y restricciones
  - Relaciones entre tablas
  - Índices recomendados
  - Notas técnicas

### Migraciones
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Guía de migraciones
  - Migración reciente: Geolocalización en contactos
  - Cómo aplicar migraciones
  - Cómo revertir migraciones
  - Ejemplo de uso

---

## 🔍 Búsqueda Rápida

### "¿Cómo instalo el proyecto?"
→ Consulta [SETUP.md](SETUP.md) sección "Instalación Rápida Automática"

### "¿Cómo inicio el proyecto en desarrollo?"
→ Consulta [README.md](README.md) sección "Ejecución en desarrollo"

### "¿Cuáles son todas las tablas de la BD?"
→ Consulta [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)

### "¿Cómo agrego campos a la BD?"
→ Consulta [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) sección "Guía de Migración"

### "Me da error al ejecutar el script"
→ Consulta [SETUP.md](SETUP.md) sección "🆘 Problemas Comunes"

### "¿Cómo construyo para producción?"
→ Consulta [README.md](README.md) sección "Build y ejecución tipo producción"

### "¿Cuál es la estructura del proyecto?"
→ Consulta [README.md](README.md) sección "Estructura del proyecto"

### "¿Qué endpoints tiene la API?"
→ Consulta [README.md](README.md) sección "Resumen de API"

---

## 📋 Tabla de Contenidos Cruzada

### Backend (Flask)
- Ver modelos: `backend/app/models/`
- Configuración: `backend/app/config.py`
- Base de datos: `backend/app/database.py`
- Rutas/Endpoints: `backend/app/routes/`
- Migraciones: `backend/migrations/versions/`

### Frontend (React)
- Componentes: `frontend/src/components/`
- Páginas: `frontend/src/pages/`
- Servicios API: `frontend/src/services/api.js`
- Configuración: `frontend/vite.config.js`

### Documentación
- Instalación: [SETUP.md](SETUP.md)
- Base de Datos: [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)
- Migraciones: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- General: [README.md](README.md)

---

## 🎯 Flujos Comunes

### 1️⃣ Primera vez usando el proyecto
```
SETUP.md (Instalación) 
  → README.md (Ejecución)
  → DATABASE_STRUCTURE.md (Entiender datos)
```

### 2️⃣ Agregar un nuevo campo a un modelo
```
Editar backend/app/models/pos.py
  → Crear migración: flask db migrate
  → Aplicar: flask db upgrade
  → Ver MIGRATION_GUIDE.md
```

### 3️⃣ Solucionar un problema
```
SETUP.md (Problemas Comunes)
  → README.md (Solución de problemas)
  → Buscar en archivos del proyecto
```

### 4️⃣ Entender la estructura de datos
```
DATABASE_STRUCTURE.md (Lee todas las tablas)
  → README.md (Resumen de API)
  → backend/app/models/ (Ve el código)
```

---

## 🔧 Comandos Útiles Rápidos

```bash
# Backend
cd backend
source ../.venv/bin/activate
python run.py

# Frontend
cd frontend
npm run dev

# Ambos juntos
python backend/app/scripts/dev.py

# Base de datos
flask db current          # Ver versión actual
flask db migrate          # Crear migración
flask db upgrade          # Aplicar migraciones
flask db downgrade        # Revertir última migración
```

---

## 📞 Soporte

Si tienes dudas sobre:
- **Instalación** → Consulta [SETUP.md](SETUP.md)
- **Estructura del Proyecto** → Consulta [README.md](README.md)
- **Base de Datos** → Consulta [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)
- **Migraciones BD** → Consulta [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

**Última actualización**: Mayo 2026

