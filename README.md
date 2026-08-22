# 🌍 GlobeTrotter

GlobeTrotter is a full-stack, AI-powered intelligent travel planning application. It acts as a specialized AI agent capable of planning complex itineraries, validating budget constraints, finding relevant activities, and assisting users with their travel journeys.

## 🏗 Architecture

GlobeTrotter follows a decoupled, modular monolith architecture:
- **Frontend**: React, TypeScript, Vite, TailwindCSS (for UI components)
- **Backend**: Node.js, Express.js, TypeScript (API, Agent orchestration)
- **Database**: PostgreSQL (via Supabase) with Row Level Security (RLS)
- **AI Core**: Mistral AI (`@mistralai/mistralai`)

### AI Architecture & Agent Core
The core differentiator of GlobeTrotter is its **Agentic Engine** (Phases 10-13). Instead of merely streaming text from an LLM, the backend orchestrates a multi-turn reasoning loop:
1. The user provides a natural language request.
2. Mistral outputs a tool selection payload.
3. The backend executes the specific tools (`search_hotels`, `calculate_budget`, `submit_travel_plan`).
4. If a tool fails (e.g. Budget constraint violated), the error is fed back to the Agent, triggering an autonomous **replanning** loop.

## 🚀 Getting Started

### 1. Database Setup (Supabase)
1. Install Supabase CLI.
2. Initialize and start: `supabase start`
3. Apply all migrations in sequence (`supabase db reset` automatically handles this).
4. Note your Local API URL, Anon Key, and Service Role Key.

### 2. Environment Variables
Create `.env` in both the backend and frontend.

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MISTRAL_API_KEY=your_mistral_key
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> **Security Note**: Never expose `SUPABASE_SERVICE_ROLE_KEY` or `MISTRAL_API_KEY` to the frontend.

### 3. Backend Startup
```bash
cd backend
npm install
npm run dev
```
Health Check: `GET http://localhost:5000/api/v1/health`

### 4. Frontend Startup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing & Evaluation

### Backend Regression Tests
We rely on Vitest to execute full API controller coverage.
```bash
cd backend
npm run test
```

### Agent Evaluation
The agent reasoning trace, tool selection, and deterministic replanning upon constraint failure are evaluated heavily:
```bash
cd backend
npx vitest tests/agent-eval.test.ts
```

### Frontend E2E
Playwright is used for full browser end-to-end flows.
```bash
cd frontend
npx playwright test
```

## 🛡️ Security
- **Authentication**: JWT verification is implemented across the stack using Supabase Auth.
- **Authorization & RLS**: All Supabase tables use `Row Level Security` mapped strictly to `auth.uid()`. Cross-tenant reading is impossible at the database level.
- **Admin**: An admin `role` secures `/api/v1/admin/analytics/overview`.
- **AI Safety**: The Mistral Agent operates exclusively via deterministic tools and cannot generate arbitrary SQL.
- **Rate Limiting**: `express-rate-limit` secures the costly AI endpoints from abuse.

## 📦 Production Build & Deployment

### Build Command
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Deployment Strategy
- **Frontend**: Deploy `frontend/dist` using Vercel, Netlify, or AWS S3.
- **Backend**: Deploy using Render, Fly.io, or Heroku as a Node.js web service. Ensure `NODE_ENV=production` is set so proper CORS and Error handling policies engage.
- **Database**: Use a hosted Supabase project.

## ⚠️ Known Limitations
- The current Agentic Loop limits iterations to 5 cycles to prevent runaway credit costs.
- The Map rendering feature uses fallback mocked coordinates for the hackathon MVP, as an external Google/Mapbox API key has not been provided.
