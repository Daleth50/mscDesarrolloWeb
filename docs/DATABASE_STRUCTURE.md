# Estructura de la Base de Datos

## Descripción General
La base de datos está diseñada para un sistema POS (Punto de Venta) e inventario. Utiliza **SQLAlchemy** con **Alembic** para migraciones. Las IDs se generan con UUID.

---

## 📊 Tablas

### 1. **users**
Gestiona los usuarios del sistema.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único del usuario |
| `first_name` | String(100) | NOT NULL | Primer nombre |
| `last_name` | String(100) | NOT NULL | Apellido |
| `email` | String(255) | UNIQUE, NOT NULL | Correo electrónico |
| `username` | String(100) | UNIQUE, NOT NULL | Nombre de usuario |
| `password` | String(255) | NOT NULL | Contraseña (hash) |
| `role` | String(50) | DEFAULT 'user' | Rol del usuario |
| `is_active` | Boolean | DEFAULT True | Estado activo/inactivo |
| `created_at` | DateTime | DEFAULT NOW | Fecha de creación |
| `updated_at` | DateTime | DEFAULT NOW | Última actualización |

---

### 2. **contacts**
Información de contactos (clientes, proveedores).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `name` | String(255) | - | Nombre del contacto |
| `email` | String(255) | - | Correo electrónico |
| `phone` | String(50) | - | Número telefónico |
| `address` | Text | - | Dirección |
| `latitude` | Numeric(10,8) | - | Latitud geográfica (opcional) |
| `longitude` | Numeric(11,8) | - | Longitud geográfica (opcional) |
| `kind` | String(20) | NOT NULL, DEFAULT 'customer' | Tipo: customer, supplier, etc |
| `created_at` | DateTime | DEFAULT NOW | Fecha de creación |
| `updated_at` | DateTime | DEFAULT NOW | Última actualización |

---

### 3. **products**
Catálogo de productos.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `name` | String(255) | NOT NULL | Nombre del producto |
| `sku` | String(100) | - | Código SKU |
| `price` | Numeric(18,4) | - | Precio de venta |
| `cost` | Numeric(18,4) | - | Costo del producto |
| `tax_rate` | Numeric(5,2) | - | Tasa de impuesto (%) |
| `attribute_combinations` | Text | - | JSON con combinaciones de atributos |
| `created_at` | DateTime | DEFAULT NOW | Fecha de creación |
| `updated_at` | DateTime | DEFAULT NOW | Última actualización |

---

### 4. **taxonomies**
Categorías y clasificaciones jerárquicas de productos.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `name` | String(255) | - | Nombre de la taxonomía |
| `value` | Text | - | Valor/descripción |
| `slug` | String(255) | - | Slug para URLs |
| `kind` | String(50) | - | Tipo de taxonomía (categoría, marca, etc) |
| `ordering` | Integer | - | Orden de visualización |
| `icon` | String(255) | - | Icono (ruta/referencia) |
| `color` | String(50) | - | Color asociado |
| `image` | String(255) | - | Imagen (ruta/referencia) |
| `parent_id` | String(36) | FK (taxonomies.id) | Padre para jerarquía |

---

### 5. **product_taxonomies**
Relación M-N entre productos y taxonomías.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `product_id` | String(36) | FK (products.id) | Referencia a producto |
| `taxonomy_id` | String(36) | FK (taxonomies.id) | Referencia a taxonomía |

---

### 6. **product_components**
Composición de productos (productos compuestos por otros).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `parent_product_id` | String(36) | FK (products.id) | Producto padre |
| `component_product_id` | String(36) | FK (products.id) | Producto componente |
| `quantity` | Numeric(18,4) | - | Cantidad del componente |

---

### 7. **warehouses**
Almacenes disponibles.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `name` | String(255) | - | Nombre del almacén |
| `location` | Text | - | Ubicación/dirección |
| `created_at` | DateTime | DEFAULT NOW | Fecha de creación |
| `updated_at` | DateTime | DEFAULT NOW | Última actualización |

---

### 8. **inventories**
Stock de productos por almacén.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `warehouse_id` | String(36) | FK (warehouses.id) | Referencia al almacén |
| `product_id` | String(36) | FK (products.id) | Referencia al producto |
| `quantity` | Numeric(18,4) | - | Cantidad disponible |
| `updated_at` | DateTime | DEFAULT NOW | Última actualización |

---

### 9. **orders**
Órdenes de venta/compra.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `contact_id` | String(36) | FK (contacts.id) | Cliente/Proveedor |
| `total` | Numeric(18,4) | - | Total con impuestos |
| `subtotal` | Numeric(18,4) | - | Subtotal |
| `tax` | Numeric(18,4) | - | Monto de impuesto |
| `discount` | Numeric(18,4) | - | Descuento aplicado |
| `status` | String(50) | - | Estado (pending, completed, cancelled) |
| `payment_status` | String(50) | - | Estado de pago (paid, unpaid, partial) |
| `payment_method` | String(50) | - | Método de pago |
| `type` | String(50) | - | Tipo (sale, purchase) |
| `extra_fields` | Text | - | JSON con campos adicionales |
| `created_at` | DateTime | DEFAULT NOW | Fecha de creación |
| `updated_at` | DateTime | DEFAULT NOW | Última actualización |

---

### 10. **order_items**
Items dentro de una orden.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `order_id` | String(36) | FK (orders.id) | Referencia a la orden |
| `product_id` | String(36) | FK (products.id) | Producto |
| `quantity` | Integer | - | Cantidad |
| `price` | Numeric(18,4) | - | Precio unitario |
| `total` | Numeric(18,4) | - | Total (cantidad × precio) |

---

### 11. **bill_accounts**
Cuentas de facturación/contables.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `name` | String(255) | - | Nombre de la cuenta |
| `type` | String(50) | - | Tipo de cuenta |
| `balance` | Numeric(18,4) | - | Balance actual |
| `created_at` | DateTime | DEFAULT NOW | Fecha de creación |
| `updated_at` | DateTime | DEFAULT NOW | Última actualización |

---

### 12. **order_bill_accounts**
Relación entre órdenes y cuentas de facturación.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Identificador único |
| `order_id` | String(36) | FK (orders.id) | Referencia a la orden |
| `bill_account_id` | String(36) | FK (bill_accounts.id) | Referencia a cuenta |
| `amount` | Numeric(18,4) | - | Monto |
| `movement_type` | String(20) | - | Tipo de movimiento (debit, credit) |
| `created_at` | DateTime | DEFAULT NOW | Fecha de creación |

---

## 🔗 Relaciones (Entity Relationship Diagram)

```
users (1) ──────── (M) orders [contact_id via contacts]
contacts (1) ──────── (M) orders
products (1) ──────── (M) order_items
products (1) ──────── (M) inventories
products (1) ──────── (M) product_taxonomies
products (1) ──────── (M) product_components [parent_product_id]
products (1) ──────── (M) product_components [component_product_id]
taxonomies (1) ──────── (M) product_taxonomies
taxonomies (1) ──────── (M) taxonomies [parent_id - jerarquía]
warehouses (1) ──────── (M) inventories
orders (1) ──────── (M) order_items
orders (1) ──────── (M) order_bill_accounts
bill_accounts (1) ──────── (M) order_bill_accounts
```

---

## 🔑 Índices Recomendados

Para optimizar consultas comunes, se recomienda crear índices en:

```sql
-- Búsquedas por email
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Búsquedas por producto
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_product_taxonomies_product_id ON product_taxonomies(product_id);
CREATE INDEX idx_product_taxonomies_taxonomy_id ON product_taxonomies(taxonomy_id);

-- Búsquedas por inventario
CREATE INDEX idx_inventories_warehouse_id ON inventories(warehouse_id);
CREATE INDEX idx_inventories_product_id ON inventories(product_id);

-- Búsquedas por orden
CREATE INDEX idx_orders_contact_id ON orders(contact_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Búsquedas por cuenta
CREATE INDEX idx_order_bill_accounts_order_id ON order_bill_accounts(order_id);
CREATE INDEX idx_order_bill_accounts_bill_account_id ON order_bill_accounts(bill_account_id);
```

---

## 📝 Notas Técnicas

- **ORM**: SQLAlchemy con Flask-SQLAlchemy
- **Migraciones**: Alembic
- **Tipo de IDs**: UUID (String de 36 caracteres)
- **Timestamps**: Todas las tablas con `created_at` y `updated_at` (excepto order_items)
- **Tipos decimales**: Numeric(18,4) para dinero, Numeric(5,2) para porcentajes
- **Base de datos soportada**: MySQL/MariaDB (con server_default/server_onupdate)

