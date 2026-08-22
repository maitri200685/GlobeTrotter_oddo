-- Indexes for Foreign Keys and Common Lookups

-- Profiles and Preferences
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Reference Data
CREATE INDEX idx_activities_city_id ON activities(city_id);
CREATE INDEX idx_hotels_city_id ON hotels(city_id);
CREATE INDEX idx_transport_options_origin ON transport_options(origin_city_id);
CREATE INDEX idx_transport_options_destination ON transport_options(destination_city_id);

-- Trips Core
CREATE INDEX idx_trips_owner_id ON trips(owner_id);
CREATE INDEX idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON trip_members(user_id);
CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_trip_stops_city_id ON trip_stops(city_id);

-- Itinerary and Expenses
CREATE INDEX idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX idx_itinerary_items_day_id ON itinerary_items(itinerary_day_id);
CREATE INDEX idx_itinerary_items_activity_id ON itinerary_items(activity_id);
CREATE INDEX idx_itinerary_items_hotel_id ON itinerary_items(hotel_id);
CREATE INDEX idx_itinerary_items_transport_option_id ON itinerary_items(transport_option_id);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);

-- AI Agent
CREATE INDEX idx_agent_sessions_user_id ON agent_sessions(user_id);
CREATE INDEX idx_agent_sessions_trip_id ON agent_sessions(trip_id);
CREATE INDEX idx_agent_messages_session_id ON agent_messages(session_id);
CREATE INDEX idx_agent_tool_calls_session_id ON agent_tool_calls(session_id);
CREATE INDEX idx_agent_state_session_id ON agent_state(session_id);
