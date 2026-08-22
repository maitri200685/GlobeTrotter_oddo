# API Architecture

The backend exposes a versioned API `/api/v1` for frontend communication and AI Tool proxying.

## API Standards
- **Authentication:** Bearer JWT (Supabase Auth).
- **Format:** JSON.
- **Error Handling:** Standardized error object structure.
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date range.",
    "details": [...]
  }
}
```

## API Groups

### Auth & Users
- `GET /api/v1/users/me` - Get current profile and preferences
- `PATCH /api/v1/users/me` - Update preferences

### Trips
- `GET /api/v1/trips` - List user's trips
- `POST /api/v1/trips` - Create new manual or empty trip
- `GET /api/v1/trips/:tripId` - Get full trip details, stops, and itinerary
- `PATCH /api/v1/trips/:tripId` - Update trip metadata
- `DELETE /api/v1/trips/:tripId` - Delete trip
- `POST /api/v1/trips/:tripId/copy` - Copy a shared trip to own profile

### Itinerary & Stops
- `POST /api/v1/trips/:tripId/stops` - Add a city
- `POST /api/v1/trips/:tripId/stops/:stopId/items` - Add activity/hotel
- `DELETE /api/v1/trips/:tripId/items/:itemId` - Remove itinerary item

### Discovery (Reference Data)
- `GET /api/v1/cities` - Search cities
- `GET /api/v1/cities/:cityId/activities` - List activities
- `GET /api/v1/cities/:cityId/hotels` - List hotels

### AI Agent
- `POST /api/v1/agent/sessions` - Start a new planning session
- `POST /api/v1/agent/sessions/:sessionId/messages` - Send a natural language message to the AI
  - *Input:* `{ "message": "Change my hotel to something cheaper." }`
  - *Output:* AI response text, updated trip state, and tool action summary.

## Error Categories
- **400 Bad Request:** Validation error (Zod schemas).
- **401 Unauthorized:** Missing or invalid JWT.
- **403 Forbidden:** Valid JWT, but lacking ownership/RLS permissions.
- **404 Not Found:** Resource missing.
- **409 Conflict:** Scheduling conflict, invalid date boundaries.
- **429 Too Many Requests:** Rate limit exceeded.
- **500 Internal Error:** Database down, unhandled exception.
- **502 Bad Gateway:** External API or Mistral AI failure.
