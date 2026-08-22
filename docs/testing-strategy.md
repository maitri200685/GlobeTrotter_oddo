# Testing & Evaluation Strategy

## Standard Testing

1. **Unit Tests:** 
   - Test independent business logic, budget arithmetic, and date math.
2. **Integration Tests:**
   - Test backend modules interacting with the database.
3. **API Tests:**
   - E2E testing of the Express router endpoints for proper status codes and JSON formatting.
4. **Database & RLS Tests:**
   - Verify that User A cannot read/mutate User B's private trips directly in Supabase.
5. **Agent Tool Tests:**
   - Ensure tools correctly map input schemas to backend services and handle errors gracefully.
6. **Agent Loop Tests:**
   - Mock LLM responses to verify the loop terminates correctly under edge cases (e.g., tool failures).
7. **End-to-End (E2E) Tests:**
   - Cypress or Playwright tests simulating user UI flow.

## AI Evaluation Cases
The AI Agent must be evaluated against standard tricky scenarios:

1. **Missing budget:** Does the agent ask for a budget before planning?
2. **Missing dates:** Does it prompt for specific travel dates?
3. **Invalid dates:** If user says "return before I leave", does it catch the logic error?
4. **Budget too low:** Does it respectfully state the budget is insufficient and ask to adjust?
5. **Multi-city trip:** Does it successfully link transportation between cities?
6. **Conflicting activities:** Does it prevent booking two overlapping tours?
7. **Hotel replacement:** If the user says "change hotel", does it remove the old one and add the new?
8. **Activity replacement:** Can it swap a museum for a beach day?
9. **Budget optimization:** Does it recalculate the total after modifications?
10. **Trip modification:** Can it adapt an existing plan without starting from scratch?
11. **Unauthorized access:** Does it block attempts to modify someone else's trip ID via chat?
12. **Public trip copying:** Can it correctly clone a public itinerary to the user's account?

## Observability
- **Logging:** Structured logs (Winston/Pino) for API endpoints.
- **Agent Tracing:** Log every session step (User Message -> Intent -> Tool Call -> Tool Result -> LLM Output) for debugging hallucinations.
- **Cost Tracking:** Monitor token usage per session to estimate LLM cost constraints.
