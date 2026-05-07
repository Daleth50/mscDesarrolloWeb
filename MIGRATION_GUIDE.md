# Guía de Migración: Geolocalización en Contactos

## 📝 Cambios Realizados

Se han agregado dos campos opcionales a la tabla `contacts` para almacenar información geográfica:

### 1. **Modelo Backend** (`backend/app/models/pos.py`)
- ✅ Agregado campo `latitude` (Numeric(10,8), nullable)
- ✅ Agregado campo `longitude` (Numeric(11,8), nullable)
- ✅ Actualizado método `to_dict()` para convertir valores decimales a float

### 2. **Migración Alembic** 
- ✅ Archivo: `backend/migrations/versions/20260506_add_geolocation_to_contacts.py`
- ✅ Versión anterior: `20260227_add_kind_to_contacts`
- ✅ Permite rollback automático (downgrade)

### 3. **Documentación**
- ✅ Actualizado: `DATABASE_STRUCTURE.md` con los nuevos campos

---

## 🚀 Cómo Aplicar la Migración

### Prerequisitos
Asegúrate de estar en el directorio `backend` y tener el ambiente virtual activado:

```bash
cd backend
source venv/bin/activate  # En macOS/Linux
# o
venv\Scripts\activate  # En Windows
```

### Instalar dependencias (si no está hecho)
```bash
pip install -r requirements.txt
```

### Aplicar la migración
```bash
python -m flask db upgrade
```

### Verificar la migración
```bash
# Ver versión actual de migraciones
python -m flask db current

# Ver historial de migraciones
python -m flask db history
```

---

## ⏮️ Cómo Revertir la Migración

Si necesitas revertir a la versión anterior:

```bash
python -m flask db downgrade
```

---

## 📊 Detalles Técnicos de los Campos

### Latitud
- **Tipo**: Numeric(10,8)
- **Rango**: -90 a +90
- **Precisión**: 8 decimales (±1.1mm de precisión)
- **Valor por defecto**: NULL (opcional)

### Longitud
- **Tipo**: Numeric(11,8)
- **Rango**: -180 a +180
- **Precisión**: 8 decimales (±1.1mm de precisión)
- **Valor por defecto**: NULL (opcional)

---

## 🔍 Ejemplo de Uso

### Crear un contacto con geolocalización:

```python
from app.models.pos import Contact

contact = Contact(
    name="Tienda Centro",
    email="tienda@ejemplo.com",
    phone="555-1234",
    address="Calle Principal 123",
    latitude=40.7128,
    longitude=-74.0060,
    kind="customer"
)

db.session.add(contact)
db.session.commit()
```

### Serializar a JSON:

```python
contact_data = contact.to_dict()
print(contact_data)
# Output:
# {
#   'id': 'abc-123',
#   'name': 'Tienda Centro',
#   'email': 'tienda@ejemplo.com',
#   'phone': '555-1234',
#   'address': 'Calle Principal 123',
#   'latitude': 40.7128,
#   'longitude': -74.0060,
#   'kind': 'customer'
# }
```

---

## ✅ Validación Post-Migración

Después de aplicar la migración, verifica que la tabla se actualizó correctamente:

```sql
-- En tu consola de base de datos
DESCRIBE contacts;

-- Deberías ver las nuevas columnas:
-- latitude     | DECIMAL(10,8)  | YES
-- longitude    | DECIMAL(11,8)  | YES
```

---

## 📝 Notas Importantes

- Los campos son **opcionales** (nullable), por lo que contactos existentes no se verán afectados
- La migración es **reversible** mediante `flask db downgrade`
- Los valores se convierten automáticamente a `float` en el método `to_dict()`
- Usa estos campos para integrar servicios de geolocalización, mapas, rutas, etc.

