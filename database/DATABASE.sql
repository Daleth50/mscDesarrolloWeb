-- ======================================
-- CREACIÓN DE BASE DE DATOS
-- ======================================
CREATE DATABASE IF NOT EXISTS swipall_pos;
USE swipall_pos;

-- ======================================
-- TABLA: contacts
-- ======================================
CREATE TABLE contacts (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  kind VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================
-- TABLA: taxonomies
-- ======================================
CREATE TABLE taxonomies (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  `value` TEXT,
  slug VARCHAR(255),
  kind VARCHAR(50),
  ordering INT,
  icon VARCHAR(255),
  color VARCHAR(50),
  image VARCHAR(255),
  parent_id CHAR(36),
  CONSTRAINT fk_taxonomies_parent FOREIGN KEY (parent_id) REFERENCES taxonomies(id)
);

-- ======================================
-- TABLA: products
-- ======================================
CREATE TABLE products (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  sku VARCHAR(100),
  price DECIMAL(18,4),
  cost DECIMAL(18,4),
  category VARCHAR(100),
  tax_rate DECIMAL(5,2),
  attribute_combinations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================
-- TABLA: product_taxonomies
-- ======================================
CREATE TABLE product_taxonomies (
  id CHAR(36) PRIMARY KEY,
  product_id CHAR(36),
  taxonomy_id CHAR(36),
  CONSTRAINT fk_prod_tax_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_prod_tax_taxonomy FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id)
);

-- ======================================
-- TABLA: warehouses
-- ======================================
CREATE TABLE warehouses (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================
-- TABLA: inventories
-- ======================================
CREATE TABLE inventories (
  id CHAR(36) PRIMARY KEY,
  warehouse_id CHAR(36),
  product_id CHAR(36),
  quantity DECIMAL(18,4),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventories_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  CONSTRAINT fk_inventories_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ======================================
-- TABLA: orders
-- ======================================
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  contact_id CHAR(36),
  total DECIMAL(18,4),
  subtotal DECIMAL(18,4),
  tax DECIMAL(18,4),
  discount DECIMAL(18,4),
  status VARCHAR(50),
  payment_status VARCHAR(50),
  payment_method VARCHAR(50),
  type VARCHAR(50),
  extra_fields TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_contact FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

-- ======================================
-- TABLA: order_items
-- ======================================
CREATE TABLE order_items (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36),
  product_id CHAR(36),
  quantity INT,
  price DECIMAL(18,4),
  total DECIMAL(18,4),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ======================================
-- TABLA: bill_accounts
-- ======================================
CREATE TABLE bill_accounts (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  balance DECIMAL(18,4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================
-- TABLA: order_bill_accounts
-- ======================================
CREATE TABLE order_bill_accounts (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36),
  bill_account_id CHAR(36),
  amount DECIMAL(18,4),
  movement_type VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_ba_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_ba_bill FOREIGN KEY (bill_account_id) REFERENCES bill_accounts(id)
);

-- ======================================
-- TABLA: product_components
-- ======================================
CREATE TABLE product_components (
  id CHAR(36) PRIMARY KEY,
  parent_product_id CHAR(36),
  component_product_id CHAR(36),
  quantity DECIMAL(18,4),
  CONSTRAINT fk_pc_parent FOREIGN KEY (parent_product_id) REFERENCES products(id),
  CONSTRAINT fk_pc_component FOREIGN KEY (component_product_id) REFERENCES products(id)
);

-- ======================================
-- TABLA: users
-- ======================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'seller')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================
-- TABLA: expenses
-- ======================================
CREATE TABLE expenses (
  id CHAR(36) PRIMARY KEY,
  amount DECIMAL(18,4) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'success',
  note TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    username,
    password,
    role,
    is_active
) VALUES (
    UUID(),
    'Root',
    'Admin',
    'root@localhost',
    'root',
    'PASSWORD_HASH',
    'admin',
    TRUE
);