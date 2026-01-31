# Tuesday Bible Study App

A mobile-first web application for a small group Bible study that meets every Tuesday.

## Features

- 📖 **Weekly Content**: View reading assignments and discussion questions
- 🔴 **Live Session**: Real-time question sync during meetings
- 🍽️ **Meal Coordination**: Sign up to bring food and RSVP
- 👨‍👩‍👧‍👦 **Family-based Auth**: Simple family codes for easy access
- 📱 **Mobile-first**: Designed for phones, works on desktop

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Azure Cosmos DB
- **Real-time**: Azure SignalR Service
- **Hosting**: Azure Static Web Apps

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Lint code
npm run typecheck    # Type checking
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Tech stack and design decisions
- [Setup Guide](./docs/SETUP.md) - Local development setup
- [Deployment](./docs/DEPLOYMENT.md) - Azure deployment guide
- [Progress](./docs/PROGRESS.md) - Development progress tracking

## Project Structure

```
src/
├── app/           # Next.js pages and API routes
├── components/    # React components
├── lib/           # Utilities and database client
├── hooks/         # Custom React hooks
├── types/         # TypeScript types
└── contexts/      # React contexts
```

## Contributing

1. Pick up a GitHub issue
2. Create a feature branch
3. Make changes with tests
4. Submit a PR

## License

Private - for use by the Bible study group only.
