-- Insert Seed Data for Development
-- Safe fictional/development data ONLY

INSERT INTO cities (id, name, country, country_code, latitude, longitude) VALUES 
('c1000000-0000-0000-0000-000000000001', 'Paris', 'France', 'FR', 48.8566, 2.3522),
('c1000000-0000-0000-0000-000000000002', 'London', 'United Kingdom', 'GB', 51.5074, -0.1278),
('c1000000-0000-0000-0000-000000000003', 'Tokyo', 'Japan', 'JP', 35.6762, 139.6503)
ON CONFLICT (id) DO NOTHING;

INSERT INTO activities (id, city_id, name, category, estimated_cost, duration_minutes) VALUES
('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Eiffel Tower Tour', 'sightseeing', 30.00, 120),
('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Louvre Museum', 'culture', 20.00, 180),
('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'London Eye', 'sightseeing', 35.00, 60)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hotels (id, city_id, name, price_per_night, rating) VALUES
('h1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Hôtel Ritz Paris (DEV)', 1200.00, 4.9),
('h1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'The Savoy (DEV)', 800.00, 4.8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO transport_options (id, origin_city_id, destination_city_id, transport_type, estimated_cost, duration_minutes) VALUES
('t1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'train', 150.00, 140)
ON CONFLICT (id) DO NOTHING;
