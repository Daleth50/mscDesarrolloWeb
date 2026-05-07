# 🚀 INICIO RÁPIDO

> 5 minutos para tener el proyecto instalado y ejecutándose

## Requisitos Previos

Asegúrate de tener instalados:
- ✓ Python 3.10+ ([Descargar](https://www.python.org/downloads/))
- ✓ Node.js 18+ ([Descargar](https://nodejs.org/))
- ✓ MySQL 8.0+ ([Descargar](https://www.mysql.com/downloads/))

## Instalación (Elige tu Sistema Operativo)

### 📱 macOS / Linux

```bash
# 1. Haz el script ejecutable
chmod +x setup.sh

# 2. Ejecuta el script
./setup.sh

# 3. El script te guiará a través de:
#    - Verificación de Python, Node.js, npm
#    - Instalación de dependencias
#    - Creación de BD desde database/DATABASE.sql
#    - Aplicación de migraciones
```

### 🪟 Windows (PowerShell)

```powershell
# 1. Abre PowerShell como Administrador

# 2. Permite ejecución de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Ejecuta el script
.\setup.ps1

# 4. El script te guiará a través de:
#    - Verificación de Python, Node.js, npm
#    - Instalación de dependencias
#    - Creación de BD desde database/DATABASE.sql
#    - Aplicación de migraciones
```

**Alternativamente (Manual):**

Si prefieres crear la BD manualmente sin ejecutar el script:

```bash
mysql -u root -p < database/DATABASE.sql
```

## Ejecutar el Proyecto

Una vez que el script termina exitosamente:

### Opción A: Ambos servicios juntos (más fácil)

```bash
source .venv/bin/activate  # Activa entorno virtual
python backend/app/scripts/dev.py
```

Luego abre:
- Frontend: http://127.0.0.1:5173
- Backend: http://127.0.0.1:5000

### Opción B: Terminales separadas (más control)

**Terminal 1 - Backend:**
```bash
cd backend
source ../.venv/bin/activate
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔍 Verificación

Si todo está correcto, deberías ver:

**Backend:**
```
* Running on http://127.0.0.1:5000
```

**Frontend:**
```
VITE v5.0.0  ready in 1234 ms
➜  Local:   http://127.0.0.1:5173/
```

## ❌ Algo salió mal?

### Soluciones rápidas:

**"Python: command not found"**
- Verifica que Python está instalado: `python --version`
- Reinicia tu terminal después de instalar Python

**"Port already in use"**
- Cierra otros procesos en 5000/5173
- O cambia `FLASK_PORT` en `backend/.env`

**"MySQL connection error"**
- Verifica que MySQL está ejecutándose
- Revisa credenciales en `backend/.env`

### Más ayuda:

- 📖 Lee [SETUP.md](SETUP.md) para soluciones detalladas
- 📚 Lee [DOCS.md](DOCS.md) para navegar toda la documentación

## 🎯 Siguientes Pasos

1. ✅ Proyecto instalado
2. ✅ Base de datos configurada
3. ✅ Frontend + Backend ejecutándose
4. 👉 Lee la documentación de API en [README.md](README.md#resumen-de-api)
5. 👉 Comienza a desarrollar!

---

**¿Necesitas ayuda?** Consulta la [Guía Completa](SETUP.md) o el [Índice de Documentación](DOCS.md)
