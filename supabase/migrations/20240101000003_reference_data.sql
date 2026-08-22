-- Create Cities Reference Table
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code VARCHAR(2),
    region TEXT,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    description TEXT,
    image_url TEXT,
    popularity INTEGER DEFAULT 0,
    cost_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Activities Reference Table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category activity_category NOT NULL DEFAULT 'other',
    estimated_cost NUMERIC(12,2),
    duration_minutes INTEGER,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Hotels Reference Table
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    rating NUMERIC(3,2),
    price_per_night NUMERIC(12,2),
    address TEXT,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    amenities TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Transport Options Reference Table
CREATE TABLE transport_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    destination_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    transport_type TEXT NOT NULL, -- e.g., 'flight', 'train', 'bus'
    duration_minutes INTEGER,
    estimated_cost NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT origin_diff_dest CHECK (origin_city_id != destination_city_id)
);
