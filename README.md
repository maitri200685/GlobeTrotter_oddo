# 🌍 GlobeTrotter — Smart Travel Planner

> **Plan smarter. Travel better. Experience more.**

GlobeTrotter is an intelligent travel planning platform designed to transform the way users discover destinations, build itineraries, manage budgets, and organize complete trips.

Instead of forcing travelers to manually search across multiple platforms for destinations, activities, transportation, and schedules, GlobeTrotter brings the complete trip-planning experience into one intuitive platform.

The application combines **personalized travel planning, itinerary management, budget awareness, destination discovery, and an AI-assisted experience** to help users turn a travel idea into a structured and actionable journey.

---

## 🚀 Project Overview

Planning a trip usually involves switching between multiple applications and websites for:

* Destination research
* Places to visit
* Activities
* Daily schedules
* Transportation
* Budget estimation
* Trip organization
* Itinerary management

This makes travel planning time-consuming and difficult to manage.

### GlobeTrotter solves this by providing a centralized travel workspace where users can:

1. Discover destinations
2. Select their preferred travel locations
3. Build a personalized trip
4. Organize activities day-by-day
5. Manage estimated expenses
6. Visualize their complete itinerary
7. Modify their plan whenever required

The goal is simple:

> **Turn scattered travel research into one organized, personalized travel plan.**

---

# 🎯 Problem Statement

Travel planning is often fragmented across different platforms.

A traveler may need one platform to search for destinations, another to find attractions, another to calculate expenses, and another to organize the final itinerary.

This creates several problems:

* Too much manual research
* Difficulty organizing activities
* Poor visibility of the complete trip
* Difficulty maintaining a realistic schedule
* Budget uncertainty
* Repeated switching between applications
* Lack of personalization

GlobeTrotter addresses these challenges by bringing the major stages of trip planning into a single platform.

---

# 💡 Our Solution

GlobeTrotter acts as a **centralized digital travel planner**.

Users provide their travel preferences and destinations, and the application helps them create an organized travel experience.

The platform focuses on:

### 🗺️ Destination Planning

Discover and organize destinations that the traveler wants to visit.

### 📅 Smart Itinerary

Arrange destinations and activities into a structured day-by-day itinerary.

### 💰 Budget Awareness

Keep track of expected trip expenses and help travelers understand their overall travel plan.

### ❤️ Personalized Experience

The trip can be customized according to the user's destinations, interests, duration, and preferences.

### 📊 Trip Visualization

Present the complete journey in a clean and easy-to-understand interface.

---

# 🔄 GlobeTrotter User Flow

The complete application follows a simple travel-planning workflow:

```text
                    ┌─────────────────┐
                    │      USER       │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Open GlobeTrotter │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Explore Destinations│
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Select Trip Details │
                  │ • Destination       │
                  │ • Duration          │
                  │ • Preferences       │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Build Itinerary   │
                  │  Day → Activities   │
                  │  Places → Schedule  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Plan & Organize   │
                  │   Complete Journey  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Budget & Trip View  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Final Trip Plan   │
                  └─────────────────────┘
```

---

# ✨ Key Features

## 🏠 1. Modern Travel Dashboard

The dashboard provides users with a centralized overview of their travel planning experience.

Users can quickly access:

* Current trips
* Planned destinations
* Itineraries
* Travel information
* Budget overview
* Important trip details

---

## 🌎 2. Destination Discovery

GlobeTrotter allows travelers to explore destinations and identify places they may want to include in their journey.

The destination experience is designed to make exploration visual, intuitive, and engaging.

---

## 🧳 3. Trip Creation

Users can create a new trip by defining important trip parameters such as:

* Destination
* Travel duration
* Travel preferences
* Activities
* Places to visit

The trip then becomes a structured workspace that can be modified as planning progresses.

---

## 📅 4. Day-by-Day Itinerary

One of the core features of GlobeTrotter is itinerary organization.

Instead of having a simple list of destinations, the journey can be structured into individual days.

Example:

```text
DAY 1
├── Arrival
├── Hotel Check-in
├── Local Exploration
└── Dinner

DAY 2
├── Tourist Attraction
├── Museum
├── Local Food Experience
└── Evening Activity

DAY 3
├── Adventure Activity
├── Shopping
└── Departure
```

This gives travelers a clear understanding of how their journey will progress.

---

## 💰 5. Budget Planning

Travel planning should not only consider destinations and activities—it should also consider affordability.

GlobeTrotter incorporates budget awareness into the planning experience so users can understand their expected trip expenses.

The planning experience can consider categories such as:

* Transportation
* Accommodation
* Food
* Activities
* Other expenses

This helps users make more informed travel decisions.

---

## 🗺️ 6. Complete Trip Overview

Users can view their entire journey from one place.

The trip overview brings together:

* Destinations
* Travel duration
* Daily itinerary
* Activities
* Budget information
* Trip details

This reduces the need to manage travel information across multiple disconnected tools.

---

## 🎨 7. Responsive & Modern UI

GlobeTrotter is designed with a modern travel-focused interface.

The UI focuses on:

* Clean visual hierarchy
* Responsive layouts
* Intuitive navigation
* Modern cards and components
* Clear information presentation
* Smooth user experience

The design is intended to feel like a real-world travel product rather than a simple hackathon prototype.

---

# 🧠 AI-Powered Travel Experience

GlobeTrotter is designed with an AI-first approach to make travel planning more intelligent and personalized.

The AI layer can assist with tasks such as:

* Understanding travel preferences
* Suggesting suitable destinations
* Helping structure itineraries
* Recommending activities
* Supporting personalized travel decisions

Instead of treating AI as a separate chatbot, GlobeTrotter aims to integrate intelligence directly into the travel-planning workflow.

---

# 🏗️ Application Architecture

The project follows a modular frontend architecture designed to keep the application scalable and maintainable.

```text
                    ┌──────────────────────┐
                    │       USER           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    GlobeTrotter UI   │
                    │   React Frontend     │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          ┌──────────┐   ┌───────────┐   ┌──────────┐
          │ Explore  │   │  Trips    │   │ Profile  │
          └────┬─────┘   └─────┬─────┘   └──────────┘
               │               │
               │               ▼
               │        ┌───────────────┐
               │        │  Itinerary    │
               │        │    Engine     │
               │        └───────┬───────┘
               │                │
               ▼                ▼
        ┌─────────────────────────────┐
        │       Travel Planning       │
        │ Destination + Activities    │
        │ Schedule + Budget           │
        └──────────────┬──────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Final Trip Plan │
              └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* **React.js**
* **JavaScript / JSX**
* **Vite**
* **HTML5**
* **CSS3**
* Responsive UI components

## Development

* **Git**
* **GitHub**
* **VS Code**
* Component-based architecture
* Modular project structure

## AI / Intelligence Layer

The project is designed to support AI-assisted travel planning and personalization.

Depending on the deployed implementation, the intelligence layer can be integrated with modern LLM/API-based services for recommendations and itinerary assistance.

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/maitri200685/GlobeTrotter_oddo.git
```

## 2. Navigate to the Project

```bash
cd GlobeTrotter_oddo
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Development Server

```bash
npm run dev
```

The application will be available at the local development URL shown by Vite.

---

# 🖥️ User Journey

A typical GlobeTrotter journey looks like this:

### Step 1 — Discover

The user enters the platform and explores destinations.

↓

### Step 2 — Choose

The user selects the destination and defines travel preferences.

↓

### Step 3 — Plan

The user creates a trip and organizes destinations and activities.

↓

### Step 4 — Structure

The itinerary is divided into manageable days.

↓

### Step 5 — Review

The traveler reviews the complete journey and expected expenses.

↓

### Step 6 — Customize

The traveler can modify activities, destinations, schedules, or other trip details.

↓

### Step 7 — Travel

The final structured itinerary becomes the user's travel companion.

---

# 🎯 Why GlobeTrotter?

Most travel platforms focus primarily on **booking**.

GlobeTrotter focuses on **planning**.

The project is designed around the idea that travelers need a place where they can think through their entire journey before booking anything.

### GlobeTrotter focuses on:

**Discover → Decide → Plan → Organize → Optimize → Travel**

This makes the platform more than a destination-search interface—it becomes a **complete travel-planning workspace**.

---

# 🌟 What Makes Our Approach Different?

### 1. Planning-Centric

The platform is designed around the user's complete journey rather than a single travel transaction.

### 2. Personalized

The itinerary can be adapted to the user's preferences and trip requirements.

### 3. Structured

Travel information is converted into an organized itinerary instead of remaining as disconnected recommendations.

### 4. Budget-Aware

Financial considerations are incorporated into the planning process.

### 5. AI-Assisted

AI can support travelers in making better and faster planning decisions.

### 6. User-Friendly

The interface is designed to reduce complexity and make travel planning approachable.

---

# 📊 Product Flow

```text
USER
  │
  ▼
Landing Page
  │
  ▼
Explore Destinations
  │
  ▼
Select Destination
  │
  ▼
Create Trip
  │
  ├───────────────┐
  ▼               ▼
Preferences     Duration
  │               │
  └───────┬───────┘
          ▼
   Generate / Build
      Itinerary
          │
          ▼
   Organize Activities
          │
          ▼
    Budget Overview
          │
          ▼
    Trip Dashboard
          │
          ▼
   Final Travel Plan
```

---

# 🔮 Future Scope

GlobeTrotter can be extended into a complete intelligent travel ecosystem.

Potential future improvements include:

* AI-generated personalized itineraries
* Real-time flight and hotel integration
* Live weather-aware itinerary adjustment
* Real-time traffic and route optimization
* Local event recommendations
* Multi-city trip optimization
* Collaborative trip planning
* Social travel recommendations
* Offline itinerary access
* Expense splitting for groups
* Smart packing recommendations
* Voice-based travel assistant
* Personalized travel history and preferences

---

# 🏆 Hackathon Vision

GlobeTrotter was developed as a solution to demonstrate how modern web technologies and AI can simplify a real-world problem.

Our objective was not simply to create another travel website.

We wanted to build a platform that answers a more important question:

> **“How can technology turn a travel idea into a complete, personalized and actionable journey?”**

GlobeTrotter is our answer.

---

# 👥 Team

**Team Odoo Hackathon**

### Contributors

* **Maitri Prajapati** — Frontend Development & UI/UX
* **Nisarg Panchal** —  Backend, AI & Integration

> Update the contributor names and responsibilities according to the final team contribution before submission.

---

# 🚀 Future Vision

GlobeTrotter can evolve from a hackathon prototype into an intelligent travel companion capable of understanding a traveler's preferences, constraints, and goals and continuously helping them optimize their journey.

The long-term vision is:

```text
Travel Idea
     ↓
AI Understanding
     ↓
Destination Discovery
     ↓
Personalized Planning
     ↓
Optimized Itinerary
     ↓
Budget Management
     ↓
Real-Time Adaptation
     ↓
Complete Travel Companion
```

---

## 🌍 GlobeTrotter

**From “Where should I go?” to “Here is my complete journey.”**

**Plan smarter. Travel better. Experience more.**
