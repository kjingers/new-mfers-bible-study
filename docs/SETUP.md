# Local Development Setup

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+
- Azure CLI (for deployment)
- Git

## Quick Start

```bash
# Clone the repository
git clone https://github.com/kjingers/new-mfers-bible-study.git
cd new-mfers-bible-study

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your values (see Environment Variables below)

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with:

```env
# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
COSMOS_DATABASE=bible-study

# Azure SignalR (for real-time features)
SIGNALR_CONNECTION_STRING=Endpoint=https://your-signalr.service.signalr.net;AccessKey=xxx;Version=1.0;

# Authentication
JWT_SECRET=your-random-32-char-secret
FAMILY_CODES={"family1":"ABC123","family2":"XYZ789"}

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run with coverage report
npm run test:e2e     # Run Playwright E2E tests

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run typecheck    # TypeScript type checking
```

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
├── components/       # React components
├── lib/              # Utilities and database client
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── contexts/         # React contexts
```

## Testing

### Unit Tests

```bash
npm run test
```

Tests are co-located with source files or in `__tests__/` directory.

### E2E Tests

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run E2E tests
npm run test:e2e
```

## Working with Cosmos DB Locally

For local development, you can use the Azure Cosmos DB Emulator:

1. Install [Cosmos DB Emulator](https://docs.microsoft.com/azure/cosmos-db/local-emulator)
2. Update `.env.local`:
   ```env
   COSMOS_ENDPOINT=https://localhost:8081
   COSMOS_KEY=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
   ```

## Common Issues

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors after pulling
```bash
npm run typecheck
```

### Environment variables not loading
- Make sure `.env.local` exists (not `.env`)
- Restart the dev server
