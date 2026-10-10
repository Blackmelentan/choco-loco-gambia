-- ==============================================================================
-- KAABU TECHNOLOGIES ENTERPRISE DATABASE ARCHITECTURE
-- CLIENT TARGET: CHOCO LOCO PATISSERIE & LOUNGE (PIPELINE, THE GAMBIA)
-- MIGRATION: 001_init_schema.sql
-- DESCRIPTION: Core Relational Schema for Users, Menu, Orders, Sales, & Auditing
-- ==============================================================================

-- 1. USERS & STAFF AUTHENTICATION
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'floor_staff', -- 'admin', 'shift_manager', 'pos_cashier', 'floor_staff'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL,
    employee_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'CL-MGR-01', 'CL-BAR-04'
    position_title VARCHAR(100) NOT NULL,       -- e.g. 'Head Pastry Chef', 'Senior Barista'
    hourly_rate_gmd DECIMAL(10, 2) NOT NULL,    -- Base wage in Gambian Dalasi
    wave_mobile_number VARCHAR(32) NOT NULL,    -- Mobile Money payout account (Wave)
    emergency_contact VARCHAR(150),
    hired_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. MENU CATEGORIES & PRODUCTS
CREATE TABLE IF NOT EXISTS menu_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(64) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price_gmd DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_signature BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    preparation_time_minutes INT NOT NULL DEFAULT 12,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item_customization_groups (
    id VARCHAR(64) PRIMARY KEY,
    menu_item_id VARCHAR(64) NOT NULL,
    group_name VARCHAR(100) NOT NULL, -- e.g. 'Choose Chocolate Glaze', 'Premium Toppings'
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    max_selections INT NOT NULL DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item_customization_options (
    id VARCHAR(64) PRIMARY KEY,
    group_id VARCHAR(64) NOT NULL,
    option_name VARCHAR(100) NOT NULL, -- e.g. 'Warm Belgian Milk Chocolate', 'Lotus Biscoff Crumbs'
    additional_price_gmd DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES item_customization_groups(id) ON DELETE CASCADE
);

-- 3. ORDERS & REAL-TIME ORDER TRACKING
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'CL-2026-1049'
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    order_type VARCHAR(32) NOT NULL DEFAULT 'dine_in', -- 'dine_in', 'takeaway', 'pipeline_delivery'
    table_number VARCHAR(16),
    status VARCHAR(32) NOT NULL DEFAULT 'received', -- 'received', 'preparing', 'plating', 'ready', 'completed', 'cancelled'
    subtotal_gmd DECIMAL(10, 2) NOT NULL,
    discount_gmd DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_gmd DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_gmd DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    payment_method VARCHAR(32) NOT NULL DEFAULT 'cash',    -- 'wave_money', 'cash', 'card', 'local_transfer'
    created_by_user_id VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    menu_item_id VARCHAR(64) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    unit_price_gmd DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    customizations_json TEXT, -- Serialized array of chosen toppings and sauces
    subtotal_gmd DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- 4. FINANCIAL & EXPENSE TRACKING
CREATE TABLE IF NOT EXISTS store_expenses (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'raw_ingredients', 'dairy_cocoa', 'utilities', 'packaging', 'marketing'
    amount_gmd DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL DEFAULT 'cash',
    vendor_name VARCHAR(150),
    receipt_reference VARCHAR(100),
    logged_by_user_id VARCHAR(64) NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (logged_by_user_id) REFERENCES users(id)
);

-- 5. LOUNGE TABLE RESERVATIONS
CREATE TABLE IF NOT EXISTS table_reservations (
    id VARCHAR(64) PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    guest_phone VARCHAR(50) NOT NULL,
    guest_count INT NOT NULL DEFAULT 2,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    table_preference VARCHAR(64) DEFAULT 'vip_lounge', -- 'terrace', 'vip_lounge', 'main_hall'
    status VARCHAR(32) NOT NULL DEFAULT 'confirmed',   -- 'pending', 'confirmed', 'seated', 'cancelled'
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SYSTEM AUDIT & SECURITY LOGS
CREATE TABLE IF NOT EXISTS system_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_menu_items_cat ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON store_expenses(expense_date);
