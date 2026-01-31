# Architecture Overview

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + React Query (TanStack Query)
- **Real-time**: Azure SignalR client

### Backend
- **API**: Next.js API Routes (serverless)
- **Database**: Azure Cosmos DB (NoSQL, free tier)
- **Real-time**: Azure SignalR Service
- **Hosting**: Azure Static Web Apps

### Testing
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage Target**: 100% for business logic, 80%+ overall

---

## Why These Choices?

### Next.js 14 with App Router
- Server components for fast initial load
- Built-in API routes (no separate backend needed)
- Excellent mobile PWA support
- Static site generation where possible
- Works great with Azure Static Web Apps

### Azure Cosmos DB
- Free tier: 1000 RU/s, 25 GB storage
- Perfect for ~12 users
- Flexible JSON schema (no migrations needed)
- Serverless billing option available

### Azure SignalR Service
- Native Azure integration
- Free tier: 20 concurrent connections (plenty for 12 people)
- WebSocket fallback to long polling
- Perfect for the live question sync feature

### Tailwind CSS
- Mobile-first design made easy
- Consistent design system
- Small bundle size with purging
- Fast development

### Simple Auth (Family Codes)
Instead of OAuth/social login:
- Families get a simple 6-character code
- Codes are stored in environment variables
- No database user management needed
- Perfect for trusted small group

---

## Data Model

### Core Entities

```typescript
interface Study {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Week {
  id: string;
  studyId: string;
  weekNumber: number;
  date: string; // Tuesday date (ISO)
  title: string;
  reading: Reading[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

interface Reading {
  id: string;
  type: 'bible' | 'book';
  reference: string; // e.g., "Romans 5:1-21" or "Chapters 3-4"
  description?: string;
}

interface Question {
  id: string;
  number: number;
  text: string;
}

interface Family {
  id: string;
  name: string;
  members: string[]; // Names of family members
  code: string; // 6-char access code
  isAdmin: boolean;
  createdAt: string;
}

interface Meal {
  id: string;
  weekId: string;
  familyId: string;
  description: string; // What they're bringing
  createdAt: string;
}

interface RSVP {
  id: string;
  weekId: string;
  familyId: string;
  adultCount: number;
  childCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface LiveSession {
  id: string;
  weekId: string;
  currentQuestionIndex: number;
  isActive: boolean;
  startedAt: string;
  updatedAt: string;
}
```

### Database Design (Cosmos DB)

**Container: studies**
- Partition key: `/id`
- Contains: Study documents

**Container: weeks**
- Partition key: `/studyId`
- Contains: Week documents with embedded readings and questions

**Container: families**
- Partition key: `/id`
- Contains: Family documents

**Container: meals**
- Partition key: `/weekId`
- Contains: Meal documents

**Container: rsvps**
- Partition key: `/weekId`
- Contains: RSVP documents

**Container: sessions**
- Partition key: `/weekId`
- Contains: LiveSession documents (for real-time sync)

---

## Application Structure

```
/
├── docs/                    # Documentation
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Auth-protected routes
│   │   │   ├── page.tsx    # Home/Dashboard
│   │   │   ├── week/[id]/  # Week detail
│   │   │   ├── study/      # Study management
│   │   │   ├── meals/      # Meal signup
│   │   │   └── admin/      # Admin panel
│   │   ├── login/          # Login page
│   │   ├── api/            # API routes
│   │   │   ├── studies/
│   │   │   ├── weeks/
│   │   │   ├── meals/
│   │   │   ├── rsvps/
│   │   │   └── live/       # SignalR endpoints
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components
│   │   ├── study/          # Study-related
│   │   ├── week/           # Week-related
│   │   ├── meal/           # Meal-related
│   │   └── live/           # Live session components
│   ├── lib/                # Utilities
│   │   ├── db/             # Cosmos DB client
│   │   ├── signalr/        # SignalR client
│   │   └── utils/          # Helper functions
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   └── contexts/           # React contexts
├── __tests__/              # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                 # Static assets
└── infrastructure/         # Azure Bicep/ARM templates
```

---

## Key Features & Implementation

### 1. "What's happening this week?" (Home Screen)

**Implementation:**
- Calculate "current week" = next Tuesday (or today if Tuesday)
- Query weeks container for matching date
- Display reading, questions, meal info, RSVP count
- Cache aggressively (data doesn't change often)

### 2. Live Question Sync

**How it works:**
1. Leader taps "Start Live Session" on their phone
2. Creates/updates LiveSession in Cosmos DB
3. All clients connect to SignalR hub
4. When leader taps next question:
   - Update `currentQuestionIndex` in DB
   - Broadcast to SignalR group
   - All clients receive update and highlight question

**SignalR Messages:**
- `session:start` - Leader started session
- `session:question` - Question changed
- `session:end` - Session ended

**Permissions:**
- Any family can view
- Only admin families can control the session

### 3. Meal Signup & RSVP

**Signup Flow:**
1. Family views upcoming weeks
2. Taps "Sign up to bring food"
3. Enters meal description
4. Other families see signup

**RSVP Flow:**
1. Family views this week's meal
2. Enters adult count + child count
3. Total displayed for meal provider

---

## Security Model

### Authentication
- Simple family codes (6 alphanumeric chars)
- Stored in JWT cookie after login
- No passwords to forget

### Authorization
- `isAdmin: true` families can:
  - Create/edit studies and weeks
  - Control live sessions
  - Manage families
- Regular families can:
  - View everything
  - RSVP for their family
  - Sign up to bring meals

---

## Azure Resources

All resources created in new resource group: `rg-bible-study`

| Resource | SKU | Purpose |
|----------|-----|---------|
| Static Web App | Free | Host Next.js app |
| Cosmos DB | Free tier | Database |
| SignalR Service | Free | Real-time sync |

**Estimated Cost:** $0/month (all free tier)

---

## Deployment Pipeline

```
GitHub Push → GitHub Actions → Build Next.js → Deploy to Azure Static Web Apps
```

Azure Static Web Apps handles:
- Auto-deploy on push to `main`
- Preview environments for PRs
- API routes as Azure Functions
- SSL certificates
- CDN distribution
