-- ======================================
-- SEED: DATOS DE PRUEBA
-- Ejecutar después de DATABASE.sql y migraciones
-- ======================================
USE swipall_pos;

-- ======================================
-- USUARIO ADMIN
-- Credenciales: admin / admin123
-- ======================================
INSERT INTO users (id, first_name, last_name, email, username, password, role, is_active) VALUES (
    UUID(),
    'Admin',
    'Sistema',
    'admin@swipall.io',
    'admin',
    'pbkdf2:sha256:1000000$SdiDfvpKcieMH8yT$3a493783a55b3862e8ebd02e4190b4a1fbea2ba642b87b16383ff40fb760b477',
    'admin',
    TRUE
);

-- ======================================
-- CATEGORÍAS (taxonomies)
-- ======================================
INSERT INTO taxonomies (id, name, slug, kind, ordering) VALUES
    (UUID(), 'Bebidas',   'bebidas',   'category', 1),
    (UUID(), 'Comidas',   'comidas',   'category', 2),
    (UUID(), 'Postres',   'postres',   'category', 3),
    (UUID(), 'Snacks',    'snacks',    'category', 4);

-- ======================================
-- PRODUCTOS
-- ======================================
INSERT INTO products (id, name, sku, price, cost, tax_rate) VALUES
    (UUID(), 'Coca-Cola 500ml',  'BEB-001', 2.50,  1.20, 16.00),
    (UUID(), 'Agua Natural',     'BEB-002', 1.00,  0.40, 16.00),
    (UUID(), 'Hamburguesa',      'COM-001', 8.50,  3.50, 16.00),
    (UUID(), 'Pizza Personal',   'COM-002', 7.00,  2.80, 16.00),
    (UUID(), 'Brownie',          'POS-001', 3.50,  1.20, 16.00),
    (UUID(), 'Papas Fritas',     'SNA-001', 4.00,  1.50, 16.00);

-- ======================================
-- CLIENTES (contacts)
-- ======================================
INSERT INTO contacts (id, name, email, phone, kind) VALUES
    (UUID(), 'Juan Pérez',      'juan@example.com',   '555-1001', 'customer'),
    (UUID(), 'María García',    'maria@example.com',  '555-1002', 'customer'),
    (UUID(), 'Carlos López',    'carlos@example.com', '555-1003', 'customer');

-- ======================================
-- CUENTAS DE PAGO (bill_accounts)
-- ======================================
INSERT INTO bill_accounts (id, name, type, balance) VALUES
    (UUID(), 'Caja Principal', 'cash',   0.00),
    (UUID(), 'Tarjeta',        'card',   0.00),
    (UUID(), 'Transferencia',  'transfer', 0.00);

-- ======================================
-- ALMACÉN PRINCIPAL (warehouse)
-- ======================================
INSERT INTO warehouses (id, name, location) VALUES
    (UUID(), 'Almacén Principal', 'Local principal');
