BEGIN;
SELECT plan(10);

-- Mock Data Setup
-- Notice: We disable triggers temporarily to avoid auth hook issues if we just insert manually, 
-- or we let the trigger create the profile automatically!
-- Since we have a trigger `on_auth_user_created` that populates profiles, inserting into auth.users is sufficient!

INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES
('u1000000-0000-0000-0000-000000000001', 'userA@test.com', '{"full_name": "User A"}'),
('u1000000-0000-0000-0000-000000000002', 'userB@test.com', '{"full_name": "User B"}');

INSERT INTO trips (id, owner_id, title, visibility) VALUES
('t1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', 'User A Private', 'private'),
('t1000000-0000-0000-0000-000000000002', 'u1000000-0000-0000-0000-000000000001', 'User A Public', 'public'),
('t1000000-0000-0000-0000-000000000003', 'u1000000-0000-0000-0000-000000000002', 'User B Private', 'private');

INSERT INTO trip_members (trip_id, user_id, role) VALUES
('t1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000002', 'editor');

INSERT INTO agent_sessions (id, user_id, trip_id) VALUES
('s1000000-0000-0000-0000-000000000001', 'u1000000-0000-0000-0000-000000000001', 't1000000-0000-0000-0000-000000000001');

-- Authenticate User A
SET LOCAL role = 'authenticated';
SET LOCAL "request.jwt.claim.sub" TO 'u1000000-0000-0000-0000-000000000001';

SELECT results_eq('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000001''', ARRAY['User A Private'], 'User A can access own trip');
SELECT is_empty('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000003''', 'User A cannot access User B private trip');
SELECT is_empty('SELECT id FROM agent_sessions WHERE id != ''s1000000-0000-0000-0000-000000000001''', 'User A cannot access User B agent sessions');

-- Authenticate Anon
SET LOCAL role = 'anon';
SET LOCAL "request.jwt.claim.sub" TO '';

SELECT results_eq('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000002''', ARRAY['User A Public'], 'Public trip can be read publicly');
SELECT is_empty('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000001''', 'Private trip cannot be read publicly');

-- Authenticate User B
SET LOCAL role = 'authenticated';
SET LOCAL "request.jwt.claim.sub" TO 'u1000000-0000-0000-0000-000000000002';

SELECT results_eq('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000001''', ARRAY['User A Private'], 'Editor can perform permitted select (Viewer/Editor access)');

UPDATE trips SET title = 'Editor Updated' WHERE id = 't1000000-0000-0000-0000-000000000001';
SELECT results_eq('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000001''', ARRAY['Editor Updated'], 'Editor can perform permitted updates');

DELETE FROM trips WHERE id = 't1000000-0000-0000-0000-000000000001';
SELECT results_eq('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000001''', ARRAY['Editor Updated'], 'Editor cannot delete the trip');

SELECT is_empty('SELECT id FROM agent_sessions WHERE id = ''s1000000-0000-0000-0000-000000000001''', 'User B cannot access User A agent session');

-- Authenticate User A again to verify delete
SET LOCAL role = 'authenticated';
SET LOCAL "request.jwt.claim.sub" TO 'u1000000-0000-0000-0000-000000000001';
DELETE FROM trips WHERE id = 't1000000-0000-0000-0000-000000000001';
SELECT is_empty('SELECT title FROM trips WHERE id = ''t1000000-0000-0000-0000-000000000001''', 'Owner can delete own trip');

SELECT * FROM finish();
ROLLBACK;
