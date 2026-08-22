# GlobeTrotter Requirements

## Project Overview
GlobeTrotter is a personalized travel planning platform designed to allow users to create, manage, visualize, optimize, and share multi-city travel itineraries. The main differentiator is the AI Travel Agent, which assists in intent extraction, planning, and optimization.

## Core Dual-Mode Principle
The system must fully support two trip planning modes that converge to the same database structure:
1. **Manual Trip Planning:** Users explicitly define cities, dates, activities, and budget via UI.
2. **AI-Assisted Trip Planning:** Users provide intent in natural language; the AI handles search, constraint solving, and initial itinerary generation.

## Official Hackathon Requirements
The application must allow users to:
1. Create customized multi-city itineraries.
2. Assign travel dates.
3. Add and manage travel stops.
4. Set durations for stops.
5. Add activities.
6. Discover cities and destinations through search.
7. Discover activities through search.
8. Estimate trip budgets automatically.
9. View cost breakdowns.
10. View trips through calendars/timelines.
11. Share trip plans publicly or with friends.
12. Copy existing shared trips.
13. Manage user profiles and preferences.
14. Store complex travel data using a relational database (Supabase PostgreSQL).
15. Provide a responsive and dynamic frontend (React/Vite).
16. Include an admin interface for platform-level analytics.

## Required Screens
- **Login / Signup**
- **Dashboard / Home**
- **Create Trip**
- **My Trips**
- **Itinerary Builder**
- **Itinerary View**
- **City Search**
- **Activity Search**
- **Trip Budget & Cost Breakdown**
- **Trip Calendar / Timeline**
- **Shared/Public Itinerary**
- **User Profile / Settings**
- **Admin Dashboard**

## AI Flow Requirements
- Understand natural language requirements (destinations, dates, budget, etc.).
- Search and recommend cities, hotels, activities, and transport.
- Validate itineraries against constraints (budget, dates, conflicts).
- Allow modification through follow-up conversational requests.
