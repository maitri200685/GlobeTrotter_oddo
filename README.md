# GlobeTrotter – Empowering Personalized Travel Planning

GlobeTrotter is a personalized travel planning platform that allows users to create, manage, visualize, optimize, and share multi-city travel itineraries.

The major differentiator of GlobeTrotter is the **AI Travel Agent**, which assists users through natural language to plan, validate, and optimize their trips based on their specific budget, dates, and interests.

## Architecture Summary

- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript (Modular Monolith)
- **Database:** Supabase (PostgreSQL) with Row Level Security (RLS)
- **AI Integration:** Mistral AI driving an Agentic Loop

### Core Principle
GlobeTrotter fully supports both **manual** and **AI-assisted** trip planning. Both methods write to the exact same underlying relational database structures. The database, not the LLM, is the strict source of truth. The AI uses predefined backend tools to interact with the database securely, ensuring no hallucinations in factual planning data and strict adherence to Row Level Security rules.

## Documentation
Please refer to the `docs/` folder for complete Phase 0 system architecture documentation:
- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Agent Architecture](docs/agent-architecture.md)
- [Database Design](docs/database-design.md)
- [API Design](docs/api-design.md)
- [Security Model](docs/security-model.md)
- [Testing Strategy](docs/testing-strategy.md)
- [Development Phases](docs/development-phases.md)
