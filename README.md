# GlobeTrotter – Empowering Personalized Travel Planning

GlobeTrotter is a personalized travel planning platform that allows users to create, manage, visualize, optimize, and share multi-city travel itineraries.

The major differentiator of GlobeTrotter is the **AI Travel Agent**, which assists users through natural language to plan, validate, and optimize their trips based on their specific budget, dates, and interests.

## Features

* **Multi-City Itineraries:** Seamlessly plan trips spanning multiple destinations.
* **AI-Powered Recommendations:** Get intelligent suggestions for activities and hotels.
* **Budget Tracking:** Keep a close eye on your expenses throughout the trip.

## Backend Setup
The backend is built with Node.js, Express, and TypeScript.
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your Supabase credentials.
4. Run `npm run dev` to start the development server.
5. Run `npm run test` to execute the automated tests.

## Architecture Summary

- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript (Modular Monolith)
- **Database:** Supabase (PostgreSQL) with Row Level Security (RLS)
- **AI Integration:** Mistral AI driving an Agentic Loop

### Core Principle
GlobeTrotter fully supports both **manual** and **AI-assisted** trip planning. Both methods write to the exact same underlying relational database structures. The database, not the LLM, is the strict source of truth. The AI uses predefined backend tools to interact with the database securely, ensuring no hallucinations in factual planning data and strict adherence to Row Level Security rules.

## Local Database Setup (Supabase)

GlobeTrotter uses a local Supabase instance for development.

**Requirements:** Docker Desktop

1. **Initialize and Start Supabase**
```bash
npx supabase start
```
This will automatically apply all database migrations and load the development seed data.

2. **Reset the Database**
If you need to wipe the database and start fresh:
```bash
npx supabase db reset
```

3. **Environment Variables**
You will need the keys printed by `supabase start`. Ensure you keep the `service_role` key strictly in your backend `.env` file, out of version control and away from the frontend.

## Documentation
Please refer to the `docs/` folder for complete system architecture and database documentation:
- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Agent Architecture](docs/agent-architecture.md)
- [Database Review](docs/database-review.md)
- [Database Schema](docs/database-schema.md)
- [RLS Policy Matrix](docs/rls-policy-matrix.md)
- [Migration Guide](docs/migration-guide.md)
- [API Design](docs/api-design.md)
- [Security Model](docs/security-model.md)
- [Testing Strategy](docs/testing-strategy.md)
- [Development Phases](docs/development-phases.md)
