-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-covers', 'trip-covers', true);

-- RLS for Avatars
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatars." ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- RLS for Trip Covers
CREATE POLICY "Trip covers are publicly accessible." ON storage.objects FOR SELECT
USING (bucket_id = 'trip-covers');

-- Helper function to safely check if string is UUID
CREATE OR REPLACE FUNCTION public.is_valid_uuid(str TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN str ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
END;
$$ LANGUAGE plpgsql;

CREATE POLICY "trip_covers_insert" ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'trip-covers' AND 
    auth.role() = 'authenticated' AND 
    public.is_valid_uuid((string_to_array(name, '/'))[1]) AND 
    public.user_can_edit_trip((string_to_array(name, '/'))[1]::uuid)
);

CREATE POLICY "trip_covers_update" ON storage.objects FOR UPDATE
USING (
    bucket_id = 'trip-covers' AND 
    auth.role() = 'authenticated' AND 
    public.is_valid_uuid((string_to_array(name, '/'))[1]) AND 
    public.user_can_edit_trip((string_to_array(name, '/'))[1]::uuid)
);

CREATE POLICY "trip_covers_delete" ON storage.objects FOR DELETE
USING (
    bucket_id = 'trip-covers' AND 
    auth.role() = 'authenticated' AND 
    public.is_valid_uuid((string_to_array(name, '/'))[1]) AND 
    public.user_can_edit_trip((string_to_array(name, '/'))[1]::uuid)
);
