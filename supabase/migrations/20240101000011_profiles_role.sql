-- Add role to profiles
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
