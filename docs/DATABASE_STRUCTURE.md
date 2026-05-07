# Database Structure

## Overview
The database is designed for a POS (Point of Sale) and inventory system. It uses SQLAlchemy with Alembic for migrations. IDs are generated with UUID.

---

## Tables

### 1. users
Manages system users.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique user identifier |
| `first_name` | String(100) | NOT NULL | First name |
| `last_name` | String(100) | NOT NULL | Last name |
| `email` | String(255) | UNIQUE, NOT NULL | Email address |
| `username` | String(100) | UNIQUE, NOT NULL | Username |
| `password` | String(255) | NOT NULL | Password (hash) |
| `role` | String(50) | DEFAULT 'user' | User role |
| `is_active` | Boolean | DEFAULT True | Active/inactive status |
| `created_at` | DateTime | DEFAULT NOW | Creation date |
| `updated_at` | DateTime | DEFAULT NOW | Last update |

---

### 2. contacts
Contact information (customers, suppliers).

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `name` | String(255) | - | Contact name |
| `email` | String(255) | - | Email address |
| `phone` | String(50) | - | Phone number |
| `address` | Text | - | Address |
| `latitude` | Numeric(10,8) | - | Geographic latitude (optional) |
| `longitude` | Numeric(11,8) | - | Geographic longitude (optional) |
| `kind` | String(20) | NOT NULL, DEFAULT 'customer' | Type: customer, supplier, etc |
| `created_at` | DateTime | DEFAULT NOW | Creation date |
| `updated_at` | DateTime | DEFAULT NOW | Last update |

---

### 3. products
Product catalog.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `name` | String(255) | NOT NULL | Product name |
| `sku` | String(100) | - | SKU code |
| `price` | Numeric(18,4) | - | Selling price |
| `cost` | Numeric(18,4) | - | Product cost |
| `tax_rate` | Numeric(5,2) | - | Tax rate (%) |
| `attribute_combinations` | Text | - | JSON with attribute combinations |
| `created_at` | DateTime | DEFAULT NOW | Creation date |
| `updated_at` | DateTime | DEFAULT NOW | Last update |

---

### 4. taxonomies
Categories and hierarchical product classifications.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `name` | String(255) | - | Taxonomy name |
| `value` | Text | - | Value/description |
| `slug` | String(255) | - | Slug for URLs |
| `kind` | String(50) | - | Taxonomy type (category, brand, etc) |
| `ordering` | Integer | - | Display order |
| `icon` | String(255) | - | Icon (path/reference) |
| `color` | String(50) | - | Associated color |
| `image` | String(255) | - | Image (path/reference) |
| `parent_id` | String(36) | FK (taxonomies.id) | Parent for hierarchy |

---

### 5. product_taxonomies
M-N relationship between products and taxonomies.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `product_id` | String(36) | FK (products.id) | Product reference |
| `taxonomy_id` | String(36) | FK (taxonomies.id) | Taxonomy reference |

---

### 6. product_components
Product composition (products composed of others).

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `parent_product_id` | String(36) | FK (products.id) | Parent product |
| `component_product_id` | String(36) | FK (products.id) | Component product |
| `quantity` | Numeric(18,4) | - | Component quantity |

---

### 7. warehouses
Available warehouses.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `name` | String(255) | - | Warehouse name |
| `location` | Text | - | Location/address |
| `created_at` | DateTime | DEFAULT NOW | Creation date |
| `updated_at` | DateTime | DEFAULT NOW | Last update |

---

### 8. inventories
Product stock per warehouse.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `warehouse_id` | String(36) | FK (warehouses.id) | Warehouse reference |
| `product_id` | String(36) | FK (products.id) | Product reference |
| `quantity` | Numeric(18,4) | - | Available quantity |
| `updated_at` | DateTime | DEFAULT NOW | Last update |

---

### 9. orders
Sales/purchase orders.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `contact_id` | String(36) | FK (contacts.id) | Customer/Supplier |
| `total` | Numeric(18,4) | - | Total with taxes |
| `subtotal` | Numeric(18,4) | - | Subtotal |
| `tax` | Numeric(18,4) | - | Tax amount |
| `discount` | Numeric(18,4) | - | Applied discount |
| `status` | String(50) | - | Status (pending, completed, cancelled) |
| `payment_status` | String(50) | - | Payment status (paid, unpaid, partial) |
| `payment_method` | String(50) | - | Payment method |
| `type` | String(50) | - | Type (sale, purchase) |
| `extra_fields` | Text | - | JSON with additional fields |
| `created_at` | DateTime | DEFAULT NOW | Creation date |
| `updated_at` | DateTime | DEFAULT NOW | Last update |

---

### 10. order_items
Items within an order.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `order_id` | String(36) | FK (orders.id) | Order reference |
| `product_id` | String(36) | FK (products.id) | Product |
| `quantity` | Integer | - | Quantity |
| `price` | Numeric(18,4) | - | Unit price |
| `total` | Numeric(18,4) | - | Total (quantity × price) |

---

### 11. bill_accounts
Billing/accounting accounts.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `name` | String(255) | - | Account name |
| `type` | String(50) | - | Account type |
| `balance` | Numeric(18,4) | - | Current balance |
| `created_at` | DateTime | DEFAULT NOW | Creation date |
| `updated_at` | DateTime | DEFAULT NOW | Last update |

---

### 12. order_bill_accounts
Relationship between orders and billing accounts.

| Column | Type | Constraints | Description |
|---------|------|---|---|
| `id` | String(36) | PK, UUID | Unique identifier |
| `order_id` | String(36) | FK (orders.id) | Order reference |
| `bill_account_id` | String(36) | FK (bill_accounts.id) | Account reference |
| `amount` | Numeric(18,4) | - | Amount |
| `movement_type` | String(20) | - | Movement type (debit, credit) |
| `created_at` | DateTime | DEFAULT NOW | Creation date |

---

## Relationships (Entity Relationship Diagram)

```
users (1) ──────── (M) orders [contact_id via contacts]
contacts (1) ──────── (M) orders
products (1) ──────── (M) order_items
products (1) ──────── (M) inventories
products (1) ──────── (M) product_taxonomies
products (1) ──────── (M) product_components [parent_product_id]
products (1) ──────── (M) product_components [component_product_id]
taxonomies (1) ──────── (M) product_taxonomies
taxonomies (1) ──────── (M) taxonomies [parent_id - hierarchy]
warehouses (1) ──────── (M) inventories
orders (1) ──────── (M) order_items
orders (1) ──────── (M) order_bill_accounts
bill_accounts (1) ──────── (M) order_bill_accounts
```

---

## Recommended Indexes

To optimize common queries, it is recommended to create indexes on:

```sql
-- Email searches
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Product searches
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_product_taxonomies_product_id ON product_taxonomies(product_id);
CREATE INDEX idx_product_taxonomies_taxonomy_id ON product_taxonomies(taxonomy_id);

-- Inventory searches
CREATE INDEX idx_inventories_warehouse_id ON inventories(warehouse_id);
CREATE INDEX idx_inventories_product_id ON inventories(product_id);

-- Order searches
CREATE INDEX idx_orders_contact_id ON orders(contact_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Account searches
CREATE INDEX idx_order_bill_accounts_order_id ON order_bill_accounts(order_id);
CREATE INDEX idx_order_bill_accounts_bill_account_id ON order_bill_accounts(bill_account_id);
```

---

## Technical Notes

- ORM: SQLAlchemy with Flask-SQLAlchemy
- Migrations: Alembic
- ID Type: UUID (String of 36 characters)
- Timestamps: All tables with created_at and updated_at (except order_items)
- Decimal Types: Numeric(18,4) for money, Numeric(5,2) for percentages
- Supported Database: MySQL/MariaDB (with server_default/server_onupdate)

