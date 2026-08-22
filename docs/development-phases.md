# Development Phases

**PHASE 0: Architecture & Requirements**
- *Goal:* Complete technical blueprint.
- *Completion:* All docs approved. (Current Phase)

**PHASE 1: Supabase Database + RLS**
- *Goal:* Create all database tables, relations, and RLS policies based on `database-design.md`.

**PHASE 2: Backend Foundation**
- *Goal:* Initialize Express, setup routing, error handling, and basic middleware.

**PHASE 3: Authentication**
- *Goal:* Integrate Supabase Auth in frontend and backend token verification.

**PHASE 4: Trip Management**
- *Goal:* Manual CRUD operations for trips.

**PHASE 5: Cities & Destinations**
- *Goal:* Implement city search capabilities and reference data loading.

**PHASE 6: Activities**
- *Goal:* Implement activity search and data integration.

**PHASE 7: Hotels & Transport**
- *Goal:* Implement accommodation and transit search endpoints.

**PHASE 8: Itinerary Engine**
- *Goal:* Logic to assign items to specific days and times, checking overlaps.

**PHASE 9: Budget Engine**
- *Goal:* Service to calculate and track total costs vs set budget.

**PHASE 10: AI Agent Core**
- *Goal:* Setup LLM connection, agent controller, and chat session state management.

**PHASE 11: Agent Tools**
- *Goal:* Bind backend services (Trips, Itinerary, Budget) to LLM tool definitions.

**PHASE 12: Planning + Validation + Replanning**
- *Goal:* Implement the core agent loop, constraint validation, and retry logic.

**PHASE 13: AI Trip Assistant**
- *Goal:* Integrate the Agent chat UI in the frontend itinerary view for modifications.

**PHASE 14: Calendar + Timeline + Map**
- *Goal:* Frontend visual representations of the planned trip.

**PHASE 15: Sharing + Copy Trip**
- *Goal:* Public trip URLs and the ability to duplicate itineraries.

**PHASE 16: Preferences + User Memory**
- *Goal:* Inject user preferences into the AI context for personalized results.

**PHASE 17: Admin Dashboard**
- *Goal:* Platform-level analytics and user management views.

**PHASE 18: Testing + Agent Evaluations**
- *Goal:* Run the defined test suite and evaluate AI against the 12 scenarios.

**PHASE 19: Security + Production Hardening**
- *Goal:* Rate limiting, secret rotations, final RLS audits.

**PHASE 20: Deployment + Final Hackathon Demo**
- *Goal:* Host on Vercel (Frontend) and Render/Fly.io (Backend), prepare demo flow.
