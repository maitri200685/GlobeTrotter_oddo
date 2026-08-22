# System Architecture

## Technology Stack
- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database/Infra:** Supabase, PostgreSQL, Supabase Auth, Supabase Storage
- **AI Model:** Mistral AI

## Core Architecture
GlobeTrotter follows a standard 3-tier architecture with an intelligent agentic middle layer.

**Client Layer:** React SPA interacting with the backend via RESTful APIs.
**Service Layer:** Express backend holding business logic, agent orchestration, and tool execution.
**Data Layer:** Supabase providing PostgreSQL database as the single source of truth.

### The Source of Truth
The relational database (Supabase) is the strict source of truth. The LLM's raw response is NEVER the source of truth. All AI recommendations must be validated and persisted through backend services before being presented as the canonical state.

## Backend Module Architecture
The backend uses a modular monolithic architecture, allowing clean separation of concerns and future scalability.

```text
src/
├── config/           # Environment variables, database connection setup
├── middleware/       # Auth validation, rate limiting, error handling
├── routes/           # Global route definitions mapping to modules
├── modules/          # Feature-based module separation
│   ├── auth/         # Authentication hooks, token generation logic
│   ├── users/        # Profiles, preferences management
│   ├── trips/        # Trip CRUD, metadata, access control
│   ├── cities/       # City search, details retrieval
│   ├── activities/   # Activity discovery and mapping
│   ├── hotels/       # Hotel search and selection
│   ├── transport/    # Transportation mapping
│   ├── itinerary/    # Day-by-day scheduling logic
│   ├── budget/       # Cost estimation and optimization engine
│   ├── sharing/      # Public links, friend-sharing, copy trip functionality
│   └── agent/        # AI orchestration, chat sessions, tool binding
├── services/         # Cross-module business logic (if any)
├── repositories/     # Data access abstraction over Supabase Client
├── validators/       # Zod schemas for input validation
├── types/            # Global TypeScript interfaces
├── utils/            # Helper functions, logger (Winston/Pino)
└── app.ts            # Express app initialization
```

**Why this structure?**
A module-based structure encapsulates routes, controllers, and services by domain. This prevents monolithic "fat controllers" and ensures that if the 'agent' module needs 'trip' data, it interacts with the 'trips' service rather than running raw queries, centralizing authorization and business logic.
