# AI Agent Architecture

## Agent Design Philosophy
The AI Travel Agent is not a simple passthrough to an LLM. It operates via a controlled **Agent Loop** where the LLM can invoke predefined, secure tools to gather data, build itineraries, and validate against constraints. 

**Architecture Flow:**
`User -> Agent Controller -> Agent Loop -> Tool Execution -> Backend Service -> Supabase/External API -> Validated Result -> Agent State -> Final Response`

## Key Components
1. **Agent Controller:** Manages sessions, handles HTTP I/O, and tracks message history.
2. **Agent State:** Stores the current context, including extracted user intent, identified parameters (budget, dates), and intermediate planning data.
3. **Agent Loop:** The orchestration engine that runs the LLM, parses tool requests, calls the Tool Execution Layer, and loops until a final answer or termination condition is met.
4. **Tool Registry:** The whitelist of allowed functions the LLM can invoke.
5. **Tool Execution Layer:** Securely maps tool requests to backend services, handling authentication and authorization.
6. **Validation Layer (Deterministic):** Ensures the generated plan meets hard constraints (math, dates, availability) independently of the LLM.
7. **Replanning Layer:** If validation fails, feeds the error back to the LLM to trigger a correction cycle.

## Decision Making
- **Probabilistic Decisions (LLM-driven):** Intent extraction, preference matching, activity selection, conversation handling.
- **Deterministic Decisions (Code-driven):** Budget arithmetic, date conflict detection, authorization, external API availability checks, tool input schema validation.

## Agent Limits and Protection
- **Max Iterations:** Hard cap (e.g., 5-7 iterations per request) to prevent infinite loops.
- **Max Replanning Attempts:** Limit validation retries to 3 before falling back to the user.
- **Timeouts:** Global request timeout.
- **Fallback Response:** Graceful degradation if a plan cannot be formed ("I couldn't find a complete plan within your budget, but here is what I found...").

## Agent Tools

| Tool Name | Purpose | Input Schema | Output Schema | Type | Owner Module | Auth Required |
| --- | --- | --- | --- | --- | --- | --- |
| `search_cities` | Find cities matching criteria | `{query, region?}` | `City[]` | External | Cities | User Token |
| `search_hotels` | Find hotels within budget/location | `{cityId, maxPrice, dates}` | `Hotel[]` | External | Hotels | User Token |
| `search_activities` | Find activities based on interests | `{cityId, category}` | `Activity[]` | External | Activities | User Token |
| `calculate_trip_cost` | Deterministic cost calculation | `{itineraryId}` | `{total, breakdown}`| Deterministic| Budget | User Token |
| `create_trip` | Initialize an empty trip | `{name, dates, budget}` | `Trip` | Deterministic| Trips | User Token |
| `add_trip_stop` | Add a city stop to trip | `{tripId, cityId, duration}`| `TripStop` | Deterministic| Trips | Trip Owner |
| `add_activity` | Add activity to day | `{tripId, activityId, time}`| `ItineraryItem` | Deterministic| Itinerary | Trip Owner |
| `validate_itinerary`| Check schedule & budget | `{tripId}` | `{isValid, errors}` | Deterministic| Itinerary | Trip Owner |

## Data Reliability
To prevent hallucination of factual data:
1. The AI is **forbidden** from returning raw textual itineraries that include assumed prices or fake hotels.
2. The AI must use `search_*` tools to retrieve real options.
3. The AI must use `add_*` tools to construct the itinerary in the database.
4. Only data successfully saved and validated by the backend is displayed to the user via standard UI components.
