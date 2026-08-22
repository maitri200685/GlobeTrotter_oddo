# Backend Development Guide

## Prerequisites
- Node.js (v18+)
- Supabase Project (Hosted or Local)

## Setup
1. Navigate to the `backend/` directory.
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in the required values.

## Available Commands
- `npm run dev` - Starts the development server with hot-reloading using `tsx watch`.
- `npm run build` - Compiles TypeScript to JavaScript in the `dist/` directory.
- `npm run start` - Runs the compiled production code.
- `npm run test` - Runs the automated Vitest test suite.

## Environment Variables
The application strictly validates environment variables on startup.
- `NODE_ENV`: 'development', 'test', or 'production'
- `PORT`: HTTP port
- `CORS_ORIGIN`: Allowed frontend origin
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Secret service role key (Never commit this!)

## Logging
The backend uses `pino` for high-performance structured logging. In production, logs are output as raw JSON strings. Each HTTP request is automatically logged with a unique `reqId`.
