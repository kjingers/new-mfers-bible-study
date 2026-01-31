# Project Progress

## Current Status: 🟢 Phase 2 - Core Features

**Last Updated:** 2026-01-31

---

## Phases Overview

### Phase 1: Foundation ✅ COMPLETE

- [x] Initialize repository
- [x] Design architecture
- [x] Create documentation
- [x] Create GitHub issues (15 total)
- [x] Set up Next.js project with TypeScript & Tailwind
- [x] Set up Azure resources (Cosmos DB, SignalR, Static Web App)
- [x] Deploy initial app to Azure
- [x] 41 unit tests passing

### Phase 2: Core Features (Current)

- [ ] #3 Authentication (family code login)
- [ ] #6 Home page (this week's view)
- [ ] #7 Week detail page
- [ ] #8 Admin: Study management
- [ ] #9 Admin: Week management

### Phase 3: Meals & RSVPs

- [ ] #10 Meal signup system
- [ ] #11 RSVP system

### Phase 4: Live Session

- [ ] #12 Real-time question sync with SignalR

### Phase 5: Polish & Testing

- [ ] #5 Complete UI component library
- [ ] #13 Unit tests with full coverage
- [ ] #14 Integration and E2E tests
- [ ] #15 PWA setup

### Phase 6: Bible Verse Feature (New)

- [ ] Create Azure OpenAI resource
- [ ] Implement verse detection (regex)
- [ ] Build verse lookup API
- [ ] Create verse modal component
- [ ] Integrate into content display

---

## Completed Tasks

| Date       | Task                                                     | PR/Issue     |
| ---------- | -------------------------------------------------------- | ------------ |
| 2026-01-31 | Project initialized                                      | -            |
| 2026-01-31 | Architecture documented                                  | -            |
| 2026-01-31 | Next.js setup with TypeScript, Tailwind                  | #1 (partial) |
| 2026-01-31 | Azure infrastructure created                             | #2 ✅        |
| 2026-01-31 | Initial deployment to Azure                              | -            |
| 2026-01-31 | Type definitions created                                 | -            |
| 2026-01-31 | Database operations layer                                | #4 (partial) |
| 2026-01-31 | Base UI components (Button, Input, Card, Badge, Loading) | #5 (partial) |
| 2026-01-31 | Utility functions with 29 tests                          | -            |
| 2026-01-31 | Button component with 12 tests                           | -            |

---

## In Progress

| Task                  | Issue | Started    | Notes                  |
| --------------------- | ----- | ---------- | ---------------------- |
| Authentication system | #3    | 2026-01-31 | Family code login, JWT |

---

## Azure Resources

| Resource       | Name                                                 | Details                 |
| -------------- | ---------------------------------------------------- | ----------------------- |
| Resource Group | rg-bible-study                                       | East US 2               |
| Cosmos DB      | cosmos-bible-study                                   | Database: bible-study   |
| SignalR        | signalr-bible-study                                  | Standard_S1, Serverless |
| Static Web App | swa-bible-study                                      | Standard                |
| **Live URL**   | https://yellow-ocean-073d4ae0f.4.azurestaticapps.net |                         |

---

## Test Coverage

| Area                  | Tests  | Status |
| --------------------- | ------ | ------ |
| Utilities (lib/utils) | 29     | ✅     |
| Button component      | 12     | ✅     |
| **Total**             | **41** | ✅     |

---

## Next Up (Priority Order)

1. **#3 Authentication** - Family code login system
   - Login page UI
   - API route for code validation
   - JWT token generation
   - Auth middleware
   - Protected routes

2. **#6 Home Page** - This week's view
   - Fetch current week data
   - Display reading assignments
   - Display discussion questions
   - Show meal/RSVP info
   - Quick actions

3. **#7 Week Detail Page** - Full week content
   - Reading list with details
   - Questions with numbers
   - Meal info
   - RSVP list
   - Live session controls

4. **#8-9 Admin Pages** - Content management
   - Create/edit studies
   - Create/edit weeks
   - Add readings and questions
   - Manage families

---

## Key Decisions Log

| Date       | Decision                    | Rationale                                               |
| ---------- | --------------------------- | ------------------------------------------------------- |
| 2026-01-31 | Next.js 14 App Router       | Best for mobile-first, works with Azure Static Web Apps |
| 2026-01-31 | Cosmos DB (not SQL)         | Flexible schema, free tier, good for small apps         |
| 2026-01-31 | Simple family codes auth    | Overkill to use OAuth for 12 trusted people             |
| 2026-01-31 | Azure SignalR for real-time | Native Azure, free tier covers our needs                |
| 2026-01-31 | Standard tier resources     | $150/month credits available                            |
| 2026-01-31 | Standalone output for SWA   | Required for Next.js hybrid on Azure Static Web Apps    |
