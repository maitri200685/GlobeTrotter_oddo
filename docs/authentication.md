# Authentication & Authorization

## Supabase Auth Source of Truth
GlobeTrotter uses Supabase Auth as the single source of truth for user identities. The backend does NOT issue JWTs or handle passwords. All signup/login flows happen directly between the client frontend and Supabase.

## Request Authentication
1. The frontend authenticates with Supabase and receives an access token (JWT).
2. The frontend sends this token to the backend in the `Authorization: Bearer <token>` header.
3. The backend `requireAuth` middleware verifies this token cryptographically using the Supabase Admin Client.
4. If valid, the user's identity is attached to `req.user`.

## Authorization
Authentication answers "Who are you?". Authorization answers "What can you do?".

### The RLS Model
The database is heavily secured with Row Level Security (RLS). To ensure the backend respects these rules, most database queries should be made using an Authenticated Supabase Client created specifically for the current request's JWT (`getAuthSupabaseClient(token)`).

### Service Role Key
The `SUPABASE_SERVICE_ROLE_KEY` is highly privileged. It bypasses all RLS policies. It is used in the backend for:
- Verifying authentication tokens safely.
- Performing administrative or background tasks (e.g. AI background workers acting on behalf of the system).
It MUST NEVER be exposed to the frontend or used to bypass user-scoped RLS restrictions carelessly.
