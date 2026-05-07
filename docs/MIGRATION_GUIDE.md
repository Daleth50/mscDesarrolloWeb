# Database Migration Guide: Geolocation in Contacts

## Changes Made

Two optional fields have been added to the contacts table to store geographic information:

### 1. Backend Model (backend/app/models/pos.py)
- Added latitude field (Numeric(10,8), nullable)
- Added longitude field (Numeric(11,8), nullable)
- Updated to_dict() method to convert decimal values to float

### 2. Alembic Migration
- File: backend/migrations/versions/20260506_add_geolocation_to_contacts.py
- Previous version: 20260227_add_kind_to_contacts
- Allows automatic rollback (downgrade)

### 3. Documentation
- Updated: DATABASE_STRUCTURE.md with the new fields

---

## How to Apply the Migration

### Prerequisites
Make sure you are in the backend directory and have the virtual environment activated:

```bash
cd backend
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows
```

### Install dependencies (if not already done)
```bash
pip install -r requirements.txt
```

### Apply the migration
```bash
python -m flask db upgrade
```

### Verify the migration
```bash
# See current migration version
python -m flask db current

# See migration history
python -m flask db history
```

---

## How to Revert the Migration

If you need to revert to the previous version:

```bash
python -m flask db downgrade
```

---

## Technical Details of Fields

### Latitude
- Type: Numeric(10,8)
- Range: -90 to +90
- Precision: 8 decimals (±1.1mm precision)
- Default value: NULL (optional)

### Longitude
- Type: Numeric(11,8)
- Range: -180 to +180
- Precision: 8 decimals (±1.1mm precision)
- Default value: NULL (optional)

---

## Usage Example

### Create a contact with geolocation:

```python
from app.models.pos import Contact

contact = Contact(
    name="Downtown Store",
    email="store@example.com",
    phone="555-1234",
    address="Main Street 123",
    latitude=40.7128,
    longitude=-74.0060,
    kind="customer"
)

db.session.add(contact)
db.session.commit()
```

### Serialize to JSON:

```python
contact_data = contact.to_dict()
print(contact_data)
# Output:
# {
#   'id': 'abc-123',
#   'name': 'Downtown Store',
#   'email': 'store@example.com',
#   'phone': '555-1234',
#   'address': 'Main Street 123',
#   'latitude': 40.7128,
#   'longitude': -74.0060,
#   'kind': 'customer'
# }
```

---

## Post-Migration Validation

After applying the migration, verify that the table was updated correctly:

```sql
-- In your database console
DESCRIBE contacts;

-- You should see the new columns:
-- latitude     | DECIMAL(10,8)  | YES
-- longitude    | DECIMAL(11,8)  | YES
```

---

## Important Notes

- The fields are optional (nullable), so existing contacts will not be affected
- The migration is reversible via flask db downgrade
- Values are automatically converted to float in the to_dict() method
- Use these fields to integrate geolocation services, maps, routing, etc.

