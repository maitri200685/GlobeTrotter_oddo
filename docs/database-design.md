# Database Domain Design

The system relies on a relational database (Supabase PostgreSQL) as the single source of truth. 

## Entities

### `profiles`
- **Purpose:** Extends Supabase auth user with application-specific profile data.
- **Fields:** `id` (FK to auth.users), `display_name`, `avatar_url`, `created_at`.
- **RLS:** Users can read all, update own.

### `user_preferences`
- **Purpose:** Stores user travel style and default constraints to feed into the AI context.
- **Fields:** `user_id`, `preferred_currency`, `travel_style`, `dietary_restrictions`, `accommodation_preference`.

### `trips`
- **Purpose:** Top-level container for a travel itinerary.
- **Fields:** `id`, `owner_id`, `title`, `start_date`, `end_date`, `total_budget`, `visibility` (private, public, friends).
- **RLS:** Owner can read/write; public read for shared trips.

### `trip_members`
- **Purpose:** Allows sharing and collaborative editing.
- **Fields:** `trip_id`, `user_id`, `role` (viewer, editor).
- **RLS:** Managed by trip owner.

### `cities` (Reference Data)
- **Purpose:** Standardized list of available destinations.
- **Fields:** `id`, `name`, `country`, `latitude`, `longitude`, `description`.
- **RLS:** Read-only for all users, writeable by admin.

### `trip_stops`
- **Purpose:** Links a trip to a city with specific dates.
- **Fields:** `id`, `trip_id`, `city_id`, `arrival_date`, `departure_date`, `order_index`.

### `hotels` / `hotel_options` (Reference/Cache Data)
- **Purpose:** Stores retrieved hotel options to avoid repeated API calls.
- **Fields:** `id`, `city_id`, `name`, `price_per_night`, `rating`, `provider_id`.

### `activities` (Reference Data)
- **Purpose:** Available things to do in a city.
- **Fields:** `id`, `city_id`, `name`, `category`, `estimated_cost`, `estimated_duration`.

### `itinerary_items`
- **Purpose:** Specific scheduled events within a trip stop.
- **Fields:** `id`, `trip_stop_id`, `activity_type` (hotel, transport, activity), `reference_id` (FK to activity/hotel), `start_time`, `end_time`, `booked_cost`.
- **Constraints:** `start_time` must be before `end_time`; must fall within `trip_stop` dates.

### `agent_sessions` & `agent_messages`
- **Purpose:** Audit and persistence of AI conversations.
- **Fields:** `session_id`, `user_id`, `trip_id` (optional), `role` (user/assistant/tool), `content`, `tool_calls`.

## Design Rules
- All user-generated data (`trips`, `trip_stops`, `itinerary_items`) must have RLS ensuring only owners or authorized members can mutate them.
- AI Agent operations write directly to these tables using the authenticated user's context (passed from backend to DB).
