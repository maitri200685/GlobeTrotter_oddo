-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Enums

-- Trip Visibility
CREATE TYPE trip_visibility AS ENUM ('private', 'friends', 'public');

-- Trip Status
CREATE TYPE trip_status AS ENUM ('draft', 'planning', 'active', 'completed', 'archived');

-- Member Roles
CREATE TYPE member_role AS ENUM ('viewer', 'editor', 'owner');

-- Activity Categories
CREATE TYPE activity_category AS ENUM (
    'sightseeing', 
    'food', 
    'adventure', 
    'culture', 
    'nightlife', 
    'shopping', 
    'nature', 
    'other'
);

-- Expense Categories
CREATE TYPE expense_category AS ENUM (
    'transport', 
    'accommodation', 
    'activities', 
    'food', 
    'other'
);
