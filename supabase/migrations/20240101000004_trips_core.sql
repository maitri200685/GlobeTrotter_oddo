-- Create Trips Table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    start_date DATE,
    end_date DATE,
    total_budget NUMERIC(12,2) DEFAULT 0.00,
    status trip_status DEFAULT 'draft',
    visibility trip_visibility DEFAULT 'private',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_budget CHECK (total_budget >= 0)
);

-- Create Trip Members Table
CREATE TABLE trip_members (
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role member_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (trip_id, user_id)
);

-- Create Trip Stops Table
CREATE TABLE trip_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    arrival_date DATE,
    departure_date DATE,
    sequence_order INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_stop_dates CHECK (departure_date >= arrival_date)
);

-- Trigger for trips updated_at
CREATE TRIGGER set_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
