--pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial 6 Standard Categories
INSERT INTO categories (name, slug, description)
VALUES 
    ('Electrical', 'electrical', 'Wiring, lighting, circuit breakers, and electrical fixtures'),
    ('Plumbing', 'plumbing', 'Pipe leaks, drainage, taps, water heaters, and sanitary fixtures'),
    ('HVAC', 'hvac', 'Heating, ventilation, air conditioning installation and servicing'),
    ('Carpentry', 'carpentry', 'Furniture repair, doors, windows, and custom woodwork'),
    ('Painting', 'painting', 'Interior and exterior wall painting, priming, and finishing'),
    ('Cleaning', 'cleaning', 'Deep house cleaning, move-in/move-out, and commercial sanitation')
ON CONFLICT (slug) DO NOTHING;

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    sub_city VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artisans Table
CREATE TABLE IF NOT EXISTS artisans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    experience_years INTEGER NOT NULL DEFAULT 0,
    service_area VARCHAR(100) NOT NULL,
    bio TEXT,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 0.0 CHECK (rating BETWEEN 0.0 AND 5.0),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    availability_status VARCHAR(20) NOT NULL DEFAULT 'available',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC Applications Table
CREATE TABLE IF NOT EXISTS kyc_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    national_id_number VARCHAR(100) NOT NULL,
    residential_document_url TEXT NOT NULL,
    id_card_front_url TEXT NOT NULL,
    id_card_back_url TEXT,
    certificate_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    reviewed_by TEXT REFERENCES "user"(id) ON DELETE RESTRICT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    artisan_id UUID REFERENCES artisans(id) ON DELETE SET NULL, -- NULL until admin assigns an artisan
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_booking_status CHECK (
        status IN (
            'REQUESTED', 'ASSIGNED', 'ACCEPTED', 
            'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 
            'COMPLETED', 'SETTLED', 'REVIEWED', 
            'CANCELLED', 'REJECTED', 'DISPUTED'
        )
    )
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE, -- Prevents duplicate reviews
    reviewer_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE NULL,
    reviewed_user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settlements Table
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL, -- 'cash', 'telebirr_transfer', 'cbe_transfer', 'bank_transfer'
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- 'pending', 'reported', 'confirmed', 'disputed', 'resolved'
    confirmed_by TEXT REFERENCES "user"(id) ON DELETE RESTRICT, -- Preserves audit trail
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_settlement_status CHECK (
        status IN (
            'pending', 'reported', 'confirmed', 
            'disputed', 'resolved'
        )
    )
);

-- Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    reason VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'opened', -- 'opened', 'under_review', 'resolved', 'dismissed'
    resolution TEXT,
    resolved_by TEXT REFERENCES "user"(id) ON DELETE RESTRICT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    receiver_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g. 'BOOKING_ASSIGNED', 'KYC_APPROVED'
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES "user"(id) ON DELETE RESTRICT, -- Preserves accountability
    action VARCHAR(100) NOT NULL, -- e.g. 'APPROVE_KYC', 'ASSIGN_BOOKING'
    entity_type VARCHAR(50) NOT NULL, -- 'kyc_applications', 'bookings', 'users'
    entity_id VARCHAR(100) NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);