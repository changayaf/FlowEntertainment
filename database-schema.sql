-- =========================================
-- ESQUEMA DE BASE DE DATOS - FLOW ENTERTAINMENT
-- =========================================
-- Plataforma integral para gestión de eventos musicales
-- Soporta: Administradores, Agentes de Venta y Clientes
-- Fecha: 19 de septiembre de 2025
-- =========================================

-- Extensiones de PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- 1. GESTIÓN DE USUARIOS Y AUTENTICACIÓN
-- =========================================

-- Enum para roles de usuario
CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'agent', 'client');

-- Enum para estado de usuario
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- Tabla principal de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    status user_status NOT NULL DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    preferred_language VARCHAR(5) DEFAULT 'es',
    timezone VARCHAR(50) DEFAULT 'Europe/Madrid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Índices
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabla de perfiles de agentes (información adicional para agentes de venta)
CREATE TABLE agent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_code VARCHAR(20) UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Porcentaje de comisión
    total_sales DECIMAL(12,2) DEFAULT 0.00,
    total_tickets_sold INTEGER DEFAULT 0,
    ranking_position INTEGER,
    bio TEXT,
    specialties TEXT[], -- Especialidades del agente
    territory VARCHAR(100), -- Territorio de venta asignado
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT agent_profiles_commission_check CHECK (commission_rate >= 0 AND commission_rate <= 100)
);

-- Tabla de sesiones para JWT y gestión de sesiones
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de tokens de verificación (email, recuperación de contraseña, etc.)
CREATE TABLE verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    token_type VARCHAR(50) NOT NULL, -- 'email_verification', 'password_reset', 'phone_verification'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 2. GESTIÓN DE EVENTOS Y LOCALES
-- =========================================

-- Enum para estado de eventos
CREATE TYPE event_status AS ENUM ('draft', 'published', 'active', 'sold_out', 'cancelled', 'completed');

-- Enum para tipo de evento
CREATE TYPE event_type AS ENUM ('dj_set', 'concert', 'festival', 'private_party', 'corporate_event');

-- Tabla principal de eventos
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type event_type NOT NULL DEFAULT 'dj_set',
    status event_status NOT NULL DEFAULT 'draft',
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    doors_open_time TIMESTAMP WITH TIME ZONE,
    age_restriction INTEGER DEFAULT 18,
    dress_code VARCHAR(100),
    music_genre VARCHAR(100),
    featured_dj VARCHAR(255),
    lineup JSONB, -- Array de DJs y artistas
    ticket_sale_start TIMESTAMP WITH TIME ZONE,
    ticket_sale_end TIMESTAMP WITH TIME ZONE,
    max_capacity INTEGER NOT NULL,
    min_age INTEGER DEFAULT 18,
    cover_image_url VARCHAR(500),
    gallery_urls TEXT[],
    video_url VARCHAR(500),
    social_media JSONB, -- Enlaces a redes sociales
    terms_and_conditions TEXT,
    cancellation_policy TEXT,
    contact_info JSONB,
    metadata JSONB, -- Información adicional flexible
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT events_datetime_check CHECK (end_datetime > start_datetime),
    CONSTRAINT events_ticket_sale_check CHECK (ticket_sale_end > ticket_sale_start)
);

-- Tabla de venues/locales
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INTEGER NOT NULL,
    description TEXT,
    amenities TEXT[],
    accessibility_features TEXT[],
    parking_info TEXT,
    public_transport_info TEXT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    website_url VARCHAR(500),
    image_urls TEXT[],
    floor_plan_url VARCHAR(500),
    venue_type VARCHAR(50), -- 'club', 'bar', 'outdoor', 'warehouse', etc.
    sound_system_info TEXT,
    lighting_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Relación entre eventos y venues
CREATE TABLE event_venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id),
    setup_time TIMESTAMP WITH TIME ZONE,
    teardown_time TIMESTAMP WITH TIME ZONE,
    rental_cost DECIMAL(10,2),
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id) -- Un evento puede tener solo un venue principal
);

-- Enum para tipos de elementos del venue
CREATE TYPE venue_element_type AS ENUM ('table_round', 'table_square', 'vip_area', 'bar', 'dj_booth', 'dance_floor', 'stage', 'entrance', 'exit', 'bathroom', 'coat_check');

-- Enum para estado de elementos/asientos
CREATE TYPE seat_status AS ENUM ('available', 'reserved', 'sold', 'blocked');

-- Tabla de layouts de venue (diseñador de locales)
CREATE TABLE venue_layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    canvas_width INTEGER NOT NULL DEFAULT 800,
    canvas_height INTEGER NOT NULL DEFAULT 600,
    background_image_url VARCHAR(500),
    grid_size INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de elementos del venue (mesas, barras, cabinas DJ, etc.)
CREATE TABLE venue_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layout_id UUID NOT NULL REFERENCES venue_layouts(id) ON DELETE CASCADE,
    element_type venue_element_type NOT NULL,
    name VARCHAR(100) NOT NULL,
    x_position DECIMAL(8,2) NOT NULL,
    y_position DECIMAL(8,2) NOT NULL,
    width DECIMAL(8,2) NOT NULL,
    height DECIMAL(8,2) NOT NULL,
    rotation DECIMAL(5,2) DEFAULT 0, -- Rotación en grados
    capacity INTEGER DEFAULT 1,
    base_price DECIMAL(10,2) DEFAULT 0,
    color VARCHAR(7) DEFAULT '#8B5CF6', -- Color hex
    is_selectable BOOLEAN DEFAULT TRUE,
    is_vip BOOLEAN DEFAULT FALSE,
    properties JSONB, -- Propiedades específicas del elemento
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asientos/espacios individuales
CREATE TABLE seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    element_id UUID NOT NULL REFERENCES venue_elements(id) ON DELETE CASCADE,
    seat_number VARCHAR(20) NOT NULL,
    position_x DECIMAL(8,2),
    position_y DECIMAL(8,2),
    price DECIMAL(10,2) NOT NULL,
    status seat_status NOT NULL DEFAULT 'available',
    is_accessible BOOLEAN DEFAULT FALSE,
    special_requirements TEXT,
    reserved_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(element_id, seat_number)
);

-- Tabla de zonas de precios
CREATE TABLE pricing_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    early_bird_price DECIMAL(10,2),
    early_bird_until TIMESTAMP WITH TIME ZONE,
    vip_price DECIMAL(10,2),
    group_discount_percentage DECIMAL(5,2) DEFAULT 0,
    min_group_size INTEGER DEFAULT 1,
    max_tickets_per_zone INTEGER,
    color VARCHAR(7) DEFAULT '#8B5CF6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Relación entre elementos del venue y zonas de precios
CREATE TABLE element_pricing_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    element_id UUID NOT NULL REFERENCES venue_elements(id) ON DELETE CASCADE,
    pricing_zone_id UUID NOT NULL REFERENCES pricing_zones(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(element_id, pricing_zone_id)
);

-- =========================================
-- 3. GESTIÓN DE VENTAS Y PAGOS
-- =========================================

-- Enum para estado de ventas
CREATE TYPE sale_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded', 'expired');

-- Enum para tipo de pago
CREATE TYPE payment_type AS ENUM ('credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash', 'crypto');

-- Enum para estado de pago
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');

-- Tabla principal de ventas
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID REFERENCES users(id), -- NULL si es venta directa
    sale_number VARCHAR(50) UNIQUE NOT NULL, -- Número de venta visible para el cliente
    status sale_status NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(12,2) NOT NULL,
    taxes DECIMAL(12,2) DEFAULT 0,
    service_fee DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    agent_commission_rate DECIMAL(5,2) DEFAULT 0,
    agent_commission_amount DECIMAL(12,2) DEFAULT 0,
    discount_code VARCHAR(50),
    discount_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    customer_info JSONB, -- Info del cliente en el momento de la compra
    referral_source VARCHAR(100), -- 'web', 'agent', 'social_media', etc.
    device_info JSONB,
    ip_address INET,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT sales_amounts_check CHECK (total_amount >= 0 AND subtotal >= 0)
);

-- Tabla de líneas de venta (tickets individuales)
CREATE TABLE sale_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    seat_id UUID REFERENCES seats(id), -- NULL para productos sin asiento
    item_type VARCHAR(50) NOT NULL, -- 'ticket', 'drink', 'merchandise', 'vip_package'
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    metadata JSONB, -- Información adicional del item
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT sale_line_items_quantity_check CHECK (quantity > 0),
    CONSTRAINT sale_line_items_price_check CHECK (unit_price >= 0 AND total_price >= 0)
);

-- Tabla de tickets generados
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    line_item_id UUID NOT NULL REFERENCES sale_line_items(id) ON DELETE CASCADE,
    seat_id UUID REFERENCES seats(id),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    qr_code_hash VARCHAR(255) UNIQUE NOT NULL, -- Hash del QR para validación
    ticket_type VARCHAR(50) NOT NULL, -- 'general', 'vip', 'drink', 'merchandise'
    attendee_name VARCHAR(255),
    attendee_email VARCHAR(255),
    attendee_phone VARCHAR(20),
    special_requirements TEXT,
    is_transferable BOOLEAN DEFAULT TRUE,
    is_refundable BOOLEAN DEFAULT TRUE,
    validated_at TIMESTAMP WITH TIME ZONE, -- Cuando se usó el ticket
    validated_by UUID REFERENCES users(id), -- Quien validó el ticket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pagos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    payment_intent_id VARCHAR(255), -- ID del intent de pago en Stripe/PayPal
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    payment_type payment_type NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    payment_method_info JSONB, -- Info de la tarjeta/método (enmascarada)
    failure_reason TEXT,
    refund_amount DECIMAL(12,2) DEFAULT 0,
    refunded_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT payments_amount_check CHECK (amount >= 0)
);

-- Tabla de productos adicionales (bebidas, merchandising, VIP packages)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id), -- NULL para productos globales
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- 'drinks', 'food', 'merchandise', 'vip_package'
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2), -- Costo para calcular margen
    stock_quantity INTEGER,
    max_per_customer INTEGER DEFAULT 10,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    requires_age_verification BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT products_price_check CHECK (price >= 0)
);

-- Tabla de códigos de descuento
CREATE TABLE discount_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id), -- NULL para códigos globales
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    applicable_products TEXT[], -- IDs de productos aplicables
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT discount_codes_value_check CHECK (discount_value >= 0)
);

-- Tabla de comisiones de agentes
CREATE TABLE agent_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES users(id),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT agent_commissions_amount_check CHECK (commission_amount >= 0)
);

-- =========================================
-- 4. NOTIFICACIONES Y COMUNICACIÓN
-- =========================================

-- Enum para tipos de notificación
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'push', 'whatsapp', 'in_app');

-- Enum para estado de notificación
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'cancelled');

-- Tabla de notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id), -- NULL para notificaciones broadcast
    type notification_type NOT NULL,
    status notification_status NOT NULL DEFAULT 'pending',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    template_id VARCHAR(100),
    template_data JSONB,
    channel_info JSONB, -- Info específica del canal (email, phone, etc.)
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    reference_type VARCHAR(50), -- 'sale', 'event', 'ticket', etc.
    reference_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de plantillas de notificación
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type notification_type NOT NULL,
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables JSONB, -- Variables disponibles en la plantilla
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 5. AUDITORÍA Y TRACKING
-- =========================================

-- Enum para tipos de acción en auditoría
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'purchase', 'refund', 'view', 'export');

-- Tabla de auditoría para tracking de acciones
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action audit_action NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    additional_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de eventos de analytics (para tracking de comportamiento)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id), -- NULL para usuarios anónimos
    session_id VARCHAR(255),
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB,
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de métricas de agentes (para gamificación y rankings)
CREATE TABLE agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES users(id),
    metric_date DATE NOT NULL,
    tickets_sold INTEGER DEFAULT 0,
    revenue_generated DECIMAL(12,2) DEFAULT 0,
    commission_earned DECIMAL(12,2) DEFAULT 0,
    events_worked INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    customer_satisfaction_score DECIMAL(3,2),
    ranking_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(agent_id, metric_date)
);

-- =========================================
-- 6. CONFIGURACIÓN Y METADATOS
-- =========================================

-- Tabla de configuración del sistema
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Si la config es pública para el frontend
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de archivos/medios
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(255),
    uploaded_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 7. ÍNDICES PARA OPTIMIZACIÓN
-- =========================================

-- Índices para usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Índices para agentes
CREATE INDEX idx_agent_profiles_user_id ON agent_profiles(user_id);
CREATE INDEX idx_agent_profiles_agent_code ON agent_profiles(agent_code);
CREATE INDEX idx_agent_profiles_ranking ON agent_profiles(ranking_position);

-- Índices para sesiones
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Índices para eventos
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_datetime ON events(start_datetime);
CREATE INDEX idx_events_event_type ON events(event_type);

-- Índices para venues
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_country ON venues(country);
CREATE INDEX idx_venues_capacity ON venues(capacity);

-- Índices para layouts y elementos
CREATE INDEX idx_venue_layouts_event_id ON venue_layouts(event_id);
CREATE INDEX idx_venue_elements_layout_id ON venue_elements(layout_id);
CREATE INDEX idx_venue_elements_type ON venue_elements(element_type);

-- Índices para asientos
CREATE INDEX idx_seats_element_id ON seats(element_id);
CREATE INDEX idx_seats_status ON seats(status);
CREATE INDEX idx_seats_price ON seats(price);

-- Índices para ventas
CREATE INDEX idx_sales_event_id ON sales(event_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_agent_id ON sales(agent_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sales_sale_number ON sales(sale_number);

-- Índices para tickets
CREATE INDEX idx_tickets_sale_id ON tickets(sale_id);
CREATE INDEX idx_tickets_seat_id ON tickets(seat_id);
CREATE INDEX idx_tickets_qr_code ON tickets(qr_code);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);

-- Índices para pagos
CREATE INDEX idx_payments_sale_id ON payments(sale_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway_transaction_id ON payments(gateway_transaction_id);

-- Índices para productos
CREATE INDEX idx_products_event_id ON products(event_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_available ON products(is_available);

-- Índices para comisiones
CREATE INDEX idx_agent_commissions_agent_id ON agent_commissions(agent_id);
CREATE INDEX idx_agent_commissions_sale_id ON agent_commissions(sale_id);
CREATE INDEX idx_agent_commissions_status ON agent_commissions(status);

-- Índices para notificaciones
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);

-- Índices para auditoría
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Índices para analytics
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);

-- Índices para métricas de agentes
CREATE INDEX idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_date ON agent_metrics(metric_date);

-- =========================================
-- 8. FUNCIONES Y TRIGGERS
-- =========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at en tablas principales
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_profiles_updated_at BEFORE UPDATE ON agent_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venue_layouts_updated_at BEFORE UPDATE ON venue_layouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venue_elements_updated_at BEFORE UPDATE ON venue_elements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seats_updated_at BEFORE UPDATE ON seats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_commissions_updated_at BEFORE UPDATE ON agent_commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de venta único
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TEXT AS $$
DECLARE
    sale_number TEXT;
    year_suffix TEXT;
BEGIN
    year_suffix := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    sale_number := 'FE' || year_suffix || '-' || LPAD(nextval('sale_number_seq')::TEXT, 6, '0');
    RETURN sale_number;
END;
$$ LANGUAGE plpgsql;

-- Secuencia para números de venta
CREATE SEQUENCE sale_number_seq START 1;

-- Función para generar número de ticket único
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    ticket_number TEXT;
BEGIN
    ticket_number := 'TKT' || LPAD(nextval('ticket_number_seq')::TEXT, 8, '0');
    RETURN ticket_number;
END;
$$ LANGUAGE plpgsql;

-- Secuencia para números de ticket
CREATE SEQUENCE ticket_number_seq START 1;

-- Trigger para asignar número de venta automáticamente
CREATE OR REPLACE FUNCTION assign_sale_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sale_number IS NULL OR NEW.sale_number = '' THEN
        NEW.sale_number := generate_sale_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_sale_number_trigger 
    BEFORE INSERT ON sales 
    FOR EACH ROW 
    EXECUTE FUNCTION assign_sale_number();

-- Trigger para asignar número de ticket automáticamente
CREATE OR REPLACE FUNCTION assign_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_ticket_number_trigger 
    BEFORE INSERT ON tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION assign_ticket_number();

-- =========================================
-- 9. VISTAS ÚTILES PARA REPORTING
-- =========================================

-- Vista de ventas con información detallada
CREATE VIEW sales_detailed AS
SELECT 
    s.id,
    s.sale_number,
    s.status,
    s.total_amount,
    s.currency,
    s.created_at,
    e.title as event_title,
    e.start_datetime as event_date,
    v.name as venue_name,
    u_customer.email as customer_email,
    u_customer.first_name || ' ' || u_customer.last_name as customer_name,
    u_agent.first_name || ' ' || u_agent.last_name as agent_name,
    COUNT(t.id) as ticket_count,
    s.agent_commission_amount
FROM sales s
JOIN events e ON s.event_id = e.id
JOIN event_venues ev ON e.id = ev.event_id
JOIN venues v ON ev.venue_id = v.id
JOIN users u_customer ON s.customer_id = u_customer.id
LEFT JOIN users u_agent ON s.agent_id = u_agent.id
LEFT JOIN tickets t ON s.id = t.sale_id
GROUP BY s.id, e.title, e.start_datetime, v.name, u_customer.email, 
         u_customer.first_name, u_customer.last_name, u_agent.first_name, u_agent.last_name;

-- Vista de ranking de agentes
CREATE VIEW agent_ranking AS
SELECT 
    u.id,
    u.first_name || ' ' || u.last_name as agent_name,
    ap.agent_code,
    ap.commission_rate,
    ap.total_sales,
    ap.total_tickets_sold,
    ap.ranking_position,
    COUNT(s.id) as total_sales_count,
    COALESCE(SUM(s.total_amount), 0) as total_revenue,
    COALESCE(SUM(s.agent_commission_amount), 0) as total_commission_earned
FROM users u
JOIN agent_profiles ap ON u.id = ap.user_id
LEFT JOIN sales s ON u.id = s.agent_id AND s.status = 'confirmed'
WHERE u.role = 'agent' AND ap.is_active = true
GROUP BY u.id, u.first_name, u.last_name, ap.agent_code, ap.commission_rate, 
         ap.total_sales, ap.total_tickets_sold, ap.ranking_position
ORDER BY total_revenue DESC;

-- Vista de ocupación de eventos
CREATE VIEW event_occupancy AS
SELECT 
    e.id,
    e.title,
    e.start_datetime,
    e.max_capacity,
    COUNT(DISTINCT s_seat.id) as seats_sold,
    ROUND((COUNT(DISTINCT s_seat.id)::DECIMAL / e.max_capacity) * 100, 2) as occupancy_percentage,
    COALESCE(SUM(CASE WHEN s.status = 'confirmed' THEN s.total_amount ELSE 0 END), 0) as revenue
FROM events e
LEFT JOIN sales s ON e.id = s.event_id
LEFT JOIN sale_line_items sli ON s.id = sli.sale_id AND sli.item_type = 'ticket'
LEFT JOIN seats s_seat ON sli.seat_id = s_seat.id
GROUP BY e.id, e.title, e.start_datetime, e.max_capacity;

-- =========================================
-- 10. DATOS DE EJEMPLO PARA DESARROLLO
-- =========================================

-- Insertar configuraciones básicas del sistema
INSERT INTO system_config (config_key, config_value, description, is_public) VALUES
('app_name', '"Flow Entertainment"', 'Nombre de la aplicación', true),
('default_currency', '"EUR"', 'Moneda por defecto', true),
('commission_rate_default', '10.0', 'Tasa de comisión por defecto para agentes', false),
('ticket_sale_fee', '2.50', 'Tarifa fija por venta de ticket', false),
('max_tickets_per_purchase', '10', 'Máximo de tickets por compra', true),
('qr_code_expiry_hours', '24', 'Horas de validez del código QR', false),
('notification_retry_attempts', '3', 'Intentos de reenvío de notificaciones', false);

-- Insertar plantillas de notificación básicas
INSERT INTO notification_templates (name, type, subject, body_template, variables) VALUES
('welcome_email', 'email', 'Bienvenido a Flow Entertainment', 
 'Hola {{customer_name}}, bienvenido a Flow Entertainment. Tu cuenta ha sido creada exitosamente.',
 '["customer_name"]'),
('ticket_confirmation', 'email', 'Confirmación de entrada - {{event_title}}',
 'Hola {{customer_name}}, tu entrada para {{event_title}} ha sido confirmada. Número de venta: {{sale_number}}',
 '["customer_name", "event_title", "sale_number", "qr_code"]'),
('agent_commission', 'email', 'Nueva comisión generada',
 'Hola {{agent_name}}, has generado una nueva comisión de {{commission_amount}} por la venta {{sale_number}}.',
 '["agent_name", "commission_amount", "sale_number"]');

-- =========================================
-- FIN DEL ESQUEMA
-- =========================================

-- Comentarios finales:
-- Este esquema soporta:
-- 1. Gestión completa de usuarios con roles diferenciados
-- 2. Sistema de eventos con diseñador de locales flexible
-- 3. Proceso completo de ventas con múltiples productos
-- 4. Sistema de comisiones para agentes
-- 5. Notificaciones multicanal
-- 6. Auditoría completa de acciones
-- 7. Analytics y métricas para gamificación
-- 8. Configuración flexible del sistema
-- 9. Vistas optimizadas para reporting
-- 10. Triggers y funciones para automatización