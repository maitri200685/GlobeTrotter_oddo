# Database Verification and Hardening Pass

## 1. Migration Verification & Relational Hardening
- **Foreign Keys Fixed:** Replaced the generic polymorphic `reference_id` in `itinerary_items` with three explicit, type-safe foreign keys: `activity_id`, `hotel_id`, and `transport_option_id`.
- **Constraint Added:** Implemented a `CHECK` constraint (`at_most_one_reference`) ensuring that an itinerary item can only point to a maximum of one of these reference entities at a time.
- **Unique Constraint Added:** Implemented a `UNIQUE(trip_id, day_date)` constraint on `itinerary_days` to prevent duplicate days being created for the same trip.
- **Indexes Updated:** Updated `007_indexes_and_constraints.sql` to properly index the new foreign keys.

## 2. RLS Behavioral Testing
Authored a robust `pgTAP` test suite (`supabase/tests/database/001_rls_behavior.test.sql`) that explicitly tests behavior across multiple mock users (Owner, Editor, Unauthorized, and Anonymous).
The test suite verifies:
- User A can access their own private trip.
- User A cannot access User B's private trip.
- Owners can update and delete their own trips.
- Editors can update trips but cannot delete them.
- Public trips can be read without authentication.
- Private trips are completely hidden from the public.
- Agent sessions, messages, tool calls, and state are strictly siloed and inaccessible to other users.

## 3. Storage Security Hardening
Secured the `trip-covers` storage bucket in `009_storage.sql`.
- **Hardened state:** Implemented path-based ownership extraction. The RLS policy extracts the `trip_id` from the upload path (e.g., `<trip_id>/cover.jpg`), uses a custom `is_valid_uuid()` PostgreSQL helper to validate the format, and enforces that the authenticated user actually owns or edits that `trip_id` via the `user_can_edit_trip()` function.

## 4. Execution & Testing Results (Hosted Supabase)
**Status:** PENDING HOSTED EXECUTION
- The migrations, RLS policies, and behavioral tests are fully implemented and structurally validated.
- **No Docker Required:** Following architectural requirements, the environment does not rely on local Docker execution.
- Executing the migrations and tests against the hosted Supabase project is pending manual authentication via the Supabase CLI using project credentials (see `migration-guide.md`).

## 5. Schema Alignment
- Verified `docs/database-schema.md` perfectly matches the migrations.
- Updated the Mermaid ERD to explicitly show `agent_sessions` relationships and explicit foreign keys on `itinerary_items`.
