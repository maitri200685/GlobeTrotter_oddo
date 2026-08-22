# API Conventions

## Base URL
All API routes are versioned and mounted under `/api/v1`.
Example: `GET /api/v1/health`

## Response Format
Every API response strictly follows one of two formats.

### Success Response (HTTP 200, 201)
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response (HTTP 4xx, 5xx)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { ... }
  }
}
```

## Status Codes
- `200 OK`: Successful read/update
- `201 Created`: Successful creation
- `400 Bad Request`: Client sent invalid data (Zod validation failed)
- `401 Unauthorized`: Missing or invalid Bearer token
- `403 Forbidden`: User lacks permission to access resource
- `404 Not Found`: Resource or route does not exist
- `409 Conflict`: Resource state conflict (e.g., duplicate)
- `500 Internal Server Error`: Unexpected backend failure

## Pagination (Future)
When implemented, paginated responses will include a `meta` block:
```json
{
  "success": true,
  "data": [ ... ],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```
