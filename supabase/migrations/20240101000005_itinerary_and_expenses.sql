CREATE TABLE itinerary_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_date DATE NOT NULL,
    daily_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_trip_day UNIQUE (trip_id, day_date)
);

-- Create Itinerary Items Table
CREATE TABLE itinerary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- e.g., 'hotel', 'activity', 'transport', 'custom'
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    hotel_id UUID REFERENCES hotels(id) ON DELETE SET NULL,
    transport_option_id UUID REFERENCES transport_options(id) ON DELETE SET NULL,
    start_time TIME,
    end_time TIME,
    sequence_order INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    booked_cost NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_times CHECK (end_time > start_time),
    CONSTRAINT at_most_one_reference CHECK (
        (activity_id IS NOT NULL)::int +
        (hotel_id IS NOT NULL)::int +
        (transport_option_id IS NOT NULL)::int <= 1
    )
);

-- Create Expenses Table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category expense_category NOT NULL DEFAULT 'other',
    amount NUMERIC(12,2) NOT NULL,
    expense_date DATE,
    description TEXT,
    is_estimated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_expense CHECK (amount >= 0)
);
