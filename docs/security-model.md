# Security Model

## Core Security Tenets
1. **Never rely solely on frontend authorization.** All checks must be enforced at the backend and database levels.
2. **Never expose service-role keys.** The frontend only gets the Supabase `anon` key.
3. **No direct LLM Database Access.** The AI model never writes raw SQL. It interacts with the database exclusively via structured, authenticated API endpoints/backend services.

## Authentication
- **Supabase Auth:** Handles JWT generation and verification.
- **Backend Verification:** Express middleware verifies the JWT against Supabase for every protected route, injecting `req.user`.

## Authorization & Row Level Security (RLS)
The database enforces authorization using RLS.

**Trip Ownership:**
- `trips` table has an RLS policy: `auth.uid() = owner_id`.
- Users can only edit trips they own or are assigned `editor` roles in `trip_members`.

**Public Trips:**
- `visibility = 'public'` allows unauthenticated READ access but denies mutations.

**Agent Authorization:**
- When the Agent calls a backend tool (e.g., `add_activity`), the tool executes using the user's JWT or backend context.
- If the AI tries to add an activity to a trip the user doesn't own, the backend validation and RLS will reject it.

## Input Validation & Rate Limiting
- **API Validation:** Zod schemas validate all inbound JSON bodies. Malformed requests are rejected before hitting business logic.
- **Rate Limiting:** Protects the Agent endpoints against abuse (e.g., max 10 messages per minute per IP/user) to prevent massive token billing spikes.

## Secrets Management
- Keys (Mistral AI API, Supabase Service Role, External Travel APIs) are stored exclusively in backend `.env` variables and deployment secrets. They are never shipped to the frontend client.
