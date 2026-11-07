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