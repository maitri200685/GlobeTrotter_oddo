# Database Migration Guide (Hosted Supabase)

## Environment Setup
GlobeTrotter uses a hosted Supabase project. Local Docker is NOT required to apply migrations.

### 1. Authenticate with Supabase CLI
First, log in to your Supabase account using the CLI:
```bash
npx supabase login
```

### 2. Link the Hosted Project
Link the repository to your specific hosted Supabase project using your Project Reference ID (found in the Supabase Dashboard under Settings > General):
```bash
npx supabase link --project-ref <your-project-ref>
```

### 3. Push Migrations
To apply the SQL migrations defined in `supabase/migrations/` to the hosted database, run:
```bash
npx supabase db push
```
This command automatically executes the migrations sequentially. 

### 4. Seed Data (Optional/Development Only)
If you are pushing to a development environment on hosted Supabase, you can push the safe seed data using:
```bash
npx supabase db execute --file supabase/seed.sql
```
*Note: Do not run seed data on the production database.*

### 5. Run pgTAP Tests remotely
If you want to run the RLS behavior tests against the hosted project:
```bash
npx supabase test db --remote
```

## Environment Variables
Create a `.env` file in the backend (Phase 2) root with the following details from your Supabase Dashboard (Settings > API):
```env
# DO NOT EXPOSE THESE TO THE FRONTEND
SUPABASE_URL="https://<your-project-ref>.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

> [!WARNING]
> The `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row Level Security. Never expose it to the client side or commit it to GitHub.
