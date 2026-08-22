# Row Level Security (RLS) Policy Matrix

| Table | Anonymous SELECT | Authenticated SELECT | INSERT | UPDATE | DELETE | Owner | Editor | Viewer | Public |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `profiles` | ALLOW | ALLOW | DENY (Trigger only) | CONDITIONAL (Own profile) | DENY | N/A | N/A | N/A | ALLOW |
| `user_preferences` | DENY | CONDITIONAL (Own only) | CONDITIONAL (Own only) | CONDITIONAL (Own only) | DENY | N/A | N/A | N/A | DENY |
| `cities` / `activities` | ALLOW | ALLOW | DENY (Service Role) | DENY | DENY | N/A | N/A | N/A | ALLOW |
| `trips` | CONDITIONAL (visibility='public') | CONDITIONAL (Owner or Member) | CONDITIONAL (Own ID) | CONDITIONAL (Owner or Editor) | CONDITIONAL (Owner) | ALLOW | ALLOW (Update) | ALLOW (Select) | ALLOW (Select) |
| `trip_members` | CONDITIONAL (if trip public) | CONDITIONAL (if trip member) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | ALLOW | DENY | DENY | ALLOW (Select) |
| `trip_stops` | CONDITIONAL (if trip public) | CONDITIONAL (if trip member) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor)| ALLOW | ALLOW | ALLOW (Select) | ALLOW (Select) |
| `itinerary_days` | CONDITIONAL (if trip public) | CONDITIONAL (if trip member) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor)| ALLOW | ALLOW | ALLOW (Select) | ALLOW (Select) |
| `itinerary_items`| CONDITIONAL (if trip public) | CONDITIONAL (if trip member) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor)| ALLOW | ALLOW | ALLOW (Select) | ALLOW (Select) |
| `expenses` | CONDITIONAL (if trip public) | CONDITIONAL (if trip member) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor) | CONDITIONAL (Owner/Editor)| ALLOW | ALLOW | ALLOW (Select) | ALLOW (Select) |
| `agent_sessions` | DENY | CONDITIONAL (Owner only) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | ALLOW | N/A | N/A | DENY |
| `agent_messages` | DENY | CONDITIONAL (Owner only) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | ALLOW | N/A | N/A | DENY |
| `agent_tool_calls`| DENY | CONDITIONAL (Owner only) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | CONDITIONAL (Owner) | ALLOW | N/A | N/A | DENY |

*Note: All "CONDITIONAL" clauses are strictly enforced via PostgreSQL Row Level Security policies evaluated at the database level.*
