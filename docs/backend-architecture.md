# Backend Architecture

The GlobeTrotter backend is a Node.js + Express + TypeScript modular monolith.

## Core Principles
1. **Modular Monolith**: The application is structured around logical modules but deployed as a single service.
2. **Strict Separation of Concerns**:
   - `Routes`: Map HTTP methods/paths to controllers.
   - `Controllers`: Extract HTTP request parameters/bodies, invoke services, and format HTTP responses.
   - `Services`: Core business logic and orchestration. (To be expanded in later phases).
   - `Middleware`: Cross-cutting concerns (Auth, Error handling, Validation).
3. **Database Access**: Direct database querying should be isolated from controllers. Supabase acts as the PostgreSQL backend.
4. **Validation**: All incoming HTTP data must be strictly validated at the boundary using `Zod` before entering business logic.
5. **AI Isolation**: AI agents must never possess direct database credentials or construct raw SQL. They will interact with the system strictly via defined domain tools (e.g. `AgentService`).

## Dependency Flow
`Request -> Middleware (Auth, Zod) -> Routes -> Controllers -> Services -> Supabase`

## Error Handling
Errors are thrown using typed classes (`AppError`, `NotFoundError`, etc.) from `src/utils/errors.ts` and caught centrally in `error.middleware.ts` to ensure consistent response shapes.
