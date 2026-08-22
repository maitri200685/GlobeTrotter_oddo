# Critical Database Review

## 1. Existing Proposed Entities
The Phase 0 `database-design.md` proposed the following entities:
- `profiles`
- `user_preferences`
- `trips`
- `trip_members`
- `cities`
- `trip_stops`
- `hotels` / `hotel_options`
- `activities`
- `itinerary_items`
- `agent_sessions` & `agent_messages`

## 2. Problems Found & Changes Made

### Missing Grouping Entity for Itineraries
**Problem:** `itinerary_items` were directly linked to `trip_stops`, meaning there was no concept of a "Day 1", "Day 2", etc., other than sorting by time.
**Change:** Added `itinerary_days` table.
**Reason:** A `trip_stop` can span multiple days. By creating `itinerary_days`, we can explicitly store day-specific notes, daily budgets, and easily render a day-by-day UI without complex date-range parsing on the frontend.

### Missing Financial Entities
**Problem:** Phase 0 mentions "expenses" in the prompt, but it was missing from the entity design. Also, costs on `itinerary_items` were mixed.
**Change:** Added `expenses` table. All financial fields changed from FLOAT to `NUMERIC(12,2)`.
**Reason:** Separating expenses allows users to track estimated vs. actual costs, and add manual expenses (e.g., "taxi ride") that don't belong on an itinerary schedule. `NUMERIC` prevents floating-point rounding errors.

### Missing Inter-city Transport
**Problem:** `transport_options` was missing.
**Change:** Added `transport_options` reference table for flights, trains, etc.
**Reason:** Multi-city trips require modeling how users get from City A to City B.

### Incomplete AI Agent Model
**Problem:** `agent_sessions` lacked state tracking and tool invocation auditing.
**Change:** Added `agent_tool_calls` and `agent_state`.
**Reason:** The agent needs to track iterations, errors, and intermediate constraints (e.g., parsed budget limits) independently of the raw chat log.

### Enums & Constraints
**Problem:** Statuses, visibility, and roles were loosely defined.
**Change:** Introduced PostgreSQL ENUMs: `trip_visibility`, `trip_status`, `member_role`, `activity_category`.
**Reason:** Enums strictly enforce database integrity at the lowest level, preventing invalid states (e.g., a trip visibility of "secret").

### Public Sharing Decoupling
**Problem:** The prompt asks if a separate `shared_trips` table is needed for public trips.
**Change:** Decided against `shared_trips`. Instead, relying on `trips.visibility` and unguessable UUIDs for `trips.id`.
**Reason:** RLS policies can securely filter out private fields (like total budget if the user chooses) or limit access to related tables when `visibility = 'public'`. Creating a separate table would cause massive duplication and sync issues.

### Profile Automation
**Problem:** How does a profile get created?
**Change:** Added a PostgreSQL trigger on `auth.users`.
**Reason:** Automatically inserts a row into `public.profiles` whenever a user signs up via Supabase Auth, guaranteeing profile existence.

## 3. Final Entity List
1. `profiles`
2. `user_preferences`
3. `cities`
4. `activities`
5. `hotels`
6. `transport_options`
7. `trips`
8. `trip_members`
9. `trip_stops`
10. `itinerary_days`
11. `itinerary_items`
12. `expenses`
13. `agent_sessions`
14. `agent_messages`
15. `agent_tool_calls`
16. `agent_state`

## 4. Indexing Strategy
- Primary keys are inherently indexed.
- Foreign keys (`user_id`, `trip_id`, `city_id`, `session_id`) will be indexed to support fast joins and RLS policy evaluation (RLS relies heavily on `trip_id` and `user_id`).
