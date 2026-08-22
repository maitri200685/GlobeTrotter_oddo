-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tool_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_state ENABLE ROW LEVEL SECURITY;

-- 1. Profiles & Preferences
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- 2. Reference Data (Cities, Activities, Hotels, Transport)
CREATE POLICY "Reference data is publicly viewable" ON cities FOR SELECT USING (true);
CREATE POLICY "Reference data is publicly viewable" ON activities FOR SELECT USING (true);
CREATE POLICY "Reference data is publicly viewable" ON hotels FOR SELECT USING (true);
CREATE POLICY "Reference data is publicly viewable" ON transport_options FOR SELECT USING (true);
-- No insert/update/delete policies; handled by service role/admin.

-- 3. Trips
CREATE POLICY "Trips are viewable by owner, members, or if public" ON trips FOR SELECT
USING (
    auth.uid() = owner_id OR 
    visibility = 'public' OR 
    EXISTS (SELECT 1 FROM trip_members WHERE trip_id = id AND user_id = auth.uid())
);
CREATE POLICY "Trips can be created by authenticated users" ON trips FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Trips can be updated by owner or editors" ON trips FOR UPDATE
USING (
    auth.uid() = owner_id OR 
    EXISTS (SELECT 1 FROM trip_members WHERE trip_id = id AND user_id = auth.uid() AND role IN ('editor', 'owner'))
);
CREATE POLICY "Trips can be deleted by owner" ON trips FOR DELETE USING (auth.uid() = owner_id);

-- 4. Trip Members
CREATE POLICY "Trip members viewable by trip participants or if public" ON trip_members FOR SELECT
USING (
    EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND (
        trips.owner_id = auth.uid() OR 
        trips.visibility = 'public' OR 
        EXISTS (SELECT 1 FROM trip_members tm WHERE tm.trip_id = trips.id AND tm.user_id = auth.uid())
    ))
);
CREATE POLICY "Only owners can manage trip members" ON trip_members FOR ALL
USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.owner_id = auth.uid()));

-- 5. Trip Stops, Itinerary Days, Expenses (Dependent on Trip Access)
-- Reusable function for trip access check
CREATE OR REPLACE FUNCTION user_can_read_trip(check_trip_id UUID) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM trips WHERE id = check_trip_id AND (
            owner_id = auth.uid() OR 
            visibility = 'public' OR 
            EXISTS (SELECT 1 FROM trip_members WHERE trip_id = check_trip_id AND user_id = auth.uid())
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_can_edit_trip(check_trip_id UUID) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM trips WHERE id = check_trip_id AND (
            owner_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM trip_members WHERE trip_id = check_trip_id AND user_id = auth.uid() AND role IN ('editor', 'owner'))
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trip Stops
CREATE POLICY "Trip stops viewable if trip viewable" ON trip_stops FOR SELECT USING (user_can_read_trip(trip_id));
CREATE POLICY "Trip stops editable if trip editable" ON trip_stops FOR INSERT WITH CHECK (user_can_edit_trip(trip_id));
CREATE POLICY "Trip stops updateable if trip editable" ON trip_stops FOR UPDATE USING (user_can_edit_trip(trip_id));
CREATE POLICY "Trip stops deletable if trip editable" ON trip_stops FOR DELETE USING (user_can_edit_trip(trip_id));

-- Itinerary Days
CREATE POLICY "Itinerary days viewable if trip viewable" ON itinerary_days FOR SELECT USING (user_can_read_trip(trip_id));
CREATE POLICY "Itinerary days editable if trip editable" ON itinerary_days FOR INSERT WITH CHECK (user_can_edit_trip(trip_id));
CREATE POLICY "Itinerary days updateable if trip editable" ON itinerary_days FOR UPDATE USING (user_can_edit_trip(trip_id));
CREATE POLICY "Itinerary days deletable if trip editable" ON itinerary_days FOR DELETE USING (user_can_edit_trip(trip_id));

-- Expenses
CREATE POLICY "Expenses viewable if trip viewable" ON expenses FOR SELECT USING (user_can_read_trip(trip_id));
CREATE POLICY "Expenses editable if trip editable" ON expenses FOR INSERT WITH CHECK (user_can_edit_trip(trip_id));
CREATE POLICY "Expenses updateable if trip editable" ON expenses FOR UPDATE USING (user_can_edit_trip(trip_id));
CREATE POLICY "Expenses deletable if trip editable" ON expenses FOR DELETE USING (user_can_edit_trip(trip_id));

-- 6. Itinerary Items (Dependent on Itinerary Days)
CREATE POLICY "Itinerary items viewable if day viewable" ON itinerary_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM itinerary_days WHERE id = itinerary_day_id AND user_can_read_trip(trip_id)));
CREATE POLICY "Itinerary items editable if day editable" ON itinerary_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM itinerary_days WHERE id = itinerary_day_id AND user_can_edit_trip(trip_id)));
CREATE POLICY "Itinerary items updateable if day editable" ON itinerary_items FOR UPDATE 
USING (EXISTS (SELECT 1 FROM itinerary_days WHERE id = itinerary_day_id AND user_can_edit_trip(trip_id)));
CREATE POLICY "Itinerary items deletable if day editable" ON itinerary_items FOR DELETE 
USING (EXISTS (SELECT 1 FROM itinerary_days WHERE id = itinerary_day_id AND user_can_edit_trip(trip_id)));

-- 7. AI Agent Tables
CREATE POLICY "Agent sessions are private" ON agent_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Agent messages are private" ON agent_messages FOR ALL 
USING (EXISTS (SELECT 1 FROM agent_sessions WHERE id = session_id AND user_id = auth.uid()));

CREATE POLICY "Agent tool calls are private" ON agent_tool_calls FOR ALL 
USING (EXISTS (SELECT 1 FROM agent_sessions WHERE id = session_id AND user_id = auth.uid()));

CREATE POLICY "Agent state is private" ON agent_state FOR ALL 
USING (EXISTS (SELECT 1 FROM agent_sessions WHERE id = session_id AND user_id = auth.uid()));
