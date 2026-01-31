# Comprehensive Suggestions for Bible Study App

This document contains detailed suggestions for improving the Bible Study app across multiple dimensions: UI/UX, coding best practices, architecture, modernization, and additional features.

**Analysis Date:** 2025-01-31  
**Analyzed by:** Code Review Agent  
**Mode:** Read-Only Analysis

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [UI/UX Best Practices](#uiux-best-practices)
3. [Color & Theme Improvements](#color--theme-improvements)
4. [Typography Enhancements](#typography-enhancements)
5. [Coding Best Practices](#coding-best-practices)
6. [Architecture Improvements](#architecture-improvements)
7. [Performance Optimizations](#performance-optimizations)
8. [Accessibility (a11y)](#accessibility-a11y)
9. [Modern Features to Add](#modern-features-to-add)
10. [Mobile Experience](#mobile-experience)
11. [Security Enhancements](#security-enhancements)
12. [Testing Recommendations](#testing-recommendations)
13. [Priority Matrix](#priority-matrix)

---

## Executive Summary

The Bible Study app has a **solid foundation** with good architectural decisions:

- Modern tech stack (Next.js 16, React 19, Tailwind v4)
- Mobile-first approach
- Clean component architecture
- Well-structured database operations

**Key Areas for Improvement:**

1. **UX Polish** - Loading states, skeleton screens, error recovery
2. **Theming** - Implement proper dark mode toggle, richer color palette
3. **Data Fetching** - Leverage React Query for caching and optimistic updates
4. **Accessibility** - Add skip links, focus management, ARIA live regions
5. **PWA Completion** - Offline support, push notifications for live sessions

---

## UI/UX Best Practices

### 1. Loading States (HIGH PRIORITY)

**Current Issue:** The app uses a simple spinner for loading states.

**Recommendation:** Implement skeleton screens that match the content layout.

```tsx
// Example: WeekSkeleton component
export function WeekCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 animate-pulse">
        <div className="h-6 w-2/3 bg-stone-200 dark:bg-stone-700 rounded mb-4" />
        <div className="h-4 w-1/2 bg-stone-200 dark:bg-stone-700 rounded mb-2" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-stone-200 dark:bg-stone-700 rounded" />
          <div className="h-4 w-5/6 bg-stone-200 dark:bg-stone-700 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Empty States

**Current Issue:** Empty states are functional but lack personality.

**Recommendation:** Create engaging empty states with clear CTAs.

```tsx
// Example: Improved empty state
<div className="text-center py-12">
  <div className="mx-auto w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
    <BookOpenIcon className="w-12 h-12 text-amber-600" />
  </div>
  <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-2">
    No study content yet
  </h3>
  <p className="text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-6">
    The study hasn't been set up for this week. Check back soon or ask an admin to add the content.
  </p>
  {isAdmin && (
    <Button>
      <PlusIcon className="w-4 h-4 mr-2" />
      Create First Week
    </Button>
  )}
</div>
```

### 3. Error States & Recovery

**Current Issue:** Error messages are shown but recovery options are limited.

**Recommendations:**

- Add retry buttons with exponential backoff
- Show contextual error messages
- Provide offline fallback UI

```tsx
// Error boundary with recovery
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Something went wrong</h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error.message}</p>
        <Button variant="secondary" onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 4. Micro-interactions & Feedback

**Current Issue:** Limited visual feedback for user actions.

**Recommendations:**

- Add haptic feedback for mobile (vibration API)
- Toast notifications for success/error states
- Subtle animations on state changes

```tsx
// Toast notification system
import { toast } from 'sonner'; // Recommend adding this library

// Usage in RSVPForm
const handleSubmit = async () => {
  try {
    await saveRSVP();
    toast.success('RSVP saved!', {
      description: `See you Tuesday with ${adultCount} adults and ${childCount} kids!`,
    });
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  } catch (error) {
    toast.error('Failed to save RSVP', {
      action: { label: 'Retry', onClick: handleSubmit },
    });
  }
};
```

### 5. Progressive Disclosure

**Current Issue:** All questions shown at once on week detail page.

**Recommendation:** Consider collapsible sections for long question lists.

```tsx
// Collapsible question section
<Accordion type="single" collapsible defaultValue="question-1">
  {questions.map((q) => (
    <AccordionItem key={q.id} value={`question-${q.number}`}>
      <AccordionTrigger className="flex items-center gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center">
          {q.number}
        </span>
        <span className="text-left">{q.text.slice(0, 60)}...</span>
      </AccordionTrigger>
      <AccordionContent>
        <p className="pl-10 text-stone-700 dark:text-stone-300">{q.text}</p>
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

### 6. Form UX Improvements

**Current Issue:** Basic form validation and interaction.

**Recommendations:**

- Add inline validation with helpful error messages
- Use react-hook-form for better form management
- Add character counters for text fields
- Implement autosave for drafts

```tsx
// Example: Enhanced input with character counter
<div className="relative">
  <Input
    label="What are you bringing?"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    maxLength={200}
  />
  <span className="absolute right-3 bottom-3 text-xs text-stone-400">{description.length}/200</span>
</div>
```

---

## Color & Theme Improvements

### 1. Extended Color Palette

**Current:** Using amber-600 as primary with stone neutrals.

**Recommendation:** Create a more sophisticated palette with semantic colors.

```css
/* Recommended palette in globals.css */
:root {
  /* Primary - Warm amber/gold for spiritual warmth */
  --primary-50: #fffbeb;
  --primary-100: #fef3c7;
  --primary-200: #fde68a;
  --primary-300: #fcd34d;
  --primary-400: #fbbf24;
  --primary-500: #f59e0b;
  --primary-600: #d97706;
  --primary-700: #b45309;
  --primary-800: #92400e;
  --primary-900: #78350f;

  /* Accent - Deep teal for contrast */
  --accent-500: #14b8a6;
  --accent-600: #0d9488;
  --accent-700: #0f766e;

  /* Semantic colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Surface colors for depth */
  --surface-1: #ffffff;
  --surface-2: #fafaf9;
  --surface-3: #f5f5f4;
  --surface-elevated: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface-1: #1c1917;
    --surface-2: #292524;
    --surface-3: #44403c;
    --surface-elevated: #292524;
  }
}
```

### 2. Dark Mode Toggle

**Current Issue:** Dark mode follows system preference with no user override.

**Recommendation:** Add explicit dark mode toggle with local storage persistence.

```tsx
// ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({} as any);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && systemDark);

    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
```

### 3. Live Session Visual Theme

**Recommendation:** During live sessions, apply a distinct visual treatment.

```css
/* Live session mode */
.live-session-active {
  --background: #1e1b18;
  --foreground: #fafaf9;
}

.live-session-active .question-active {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);
}
```

### 4. Gradient Accents

**Recommendation:** Add subtle gradients for visual interest.

```tsx
// Hero gradient for landing page
<div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-stone-900 dark:via-stone-900 dark:to-amber-900/20" />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

---

## Typography Enhancements

### 1. Font Scale

**Current:** Using Geist Sans, which is excellent.

**Recommendation:** Define a proper type scale with clear hierarchy.

```css
/* Type scale in globals.css */
:root {
  /* Display - For hero headings */
  --text-display: clamp(2rem, 5vw, 3rem);

  /* Headings */
  --text-h1: 1.875rem; /* 30px */
  --text-h2: 1.5rem; /* 24px */
  --text-h3: 1.25rem; /* 20px */
  --text-h4: 1.125rem; /* 18px */

  /* Body */
  --text-body-lg: 1.125rem; /* 18px - for question text */
  --text-body: 1rem; /* 16px */
  --text-body-sm: 0.875rem; /* 14px */

  /* Small */
  --text-caption: 0.75rem; /* 12px */
  --text-overline: 0.625rem; /* 10px */
}
```

### 2. Line Height & Spacing

**Recommendation:** Optimize line heights for readability.

```css
/* Line heights for different use cases */
.text-prose {
  line-height: 1.7; /* For long-form content like questions */
}

.text-ui {
  line-height: 1.4; /* For UI text */
}

.text-heading {
  line-height: 1.2; /* For headings */
}
```

### 3. Reading Content Styling

**Recommendation:** Style Bible references and questions for optimal reading.

```tsx
// Bible reference styling
<span className="font-serif text-amber-700 dark:text-amber-400 tracking-wide">
  Romans 5:1-21
</span>

// Question text with proper measure
<p className="max-w-prose text-lg leading-relaxed text-stone-700 dark:text-stone-300">
  {question.text}
</p>
```

---

## Coding Best Practices

### 1. React Query Integration (HIGH PRIORITY)

**Current Issue:** Using raw `fetch` with `useState`/`useEffect`.

**Recommendation:** The package.json shows `@tanstack/react-query` is already installed but not being used!

```tsx
// src/hooks/useCurrentWeek.ts
import { useQuery } from '@tanstack/react-query';
import type { WeekWithDetails } from '@/types';

export function useCurrentWeek() {
  return useQuery({
    queryKey: ['week', 'current'],
    queryFn: async () => {
      const res = await fetch('/api/weeks/current');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Usage in component
function HomePage() {
  const { data, isLoading, error, refetch } = useCurrentWeek();
  // Much cleaner!
}
```

### 2. Optimistic Updates

**Recommendation:** Implement optimistic updates for RSVP and meal forms.

```tsx
// src/hooks/useRSVP.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateRSVP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onMutate: async (newRsvp) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['week', newRsvp.weekId] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['week', newRsvp.weekId]);

      // Optimistically update
      queryClient.setQueryData(['week', newRsvp.weekId], (old) => ({
        ...old,
        rsvps: [...old.rsvps, { ...newRsvp, id: 'temp-id' }],
      }));

      return { previous };
    },
    onError: (err, vars, context) => {
      // Rollback on error
      queryClient.setQueryData(['week', vars.weekId], context.previous);
    },
    onSettled: (data, err, vars) => {
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ['week', vars.weekId] });
    },
  });
}
```

### 3. Custom Hooks Extraction

**Current Issue:** Logic mixed into page components.

**Recommendation:** Extract reusable hooks.

```tsx
// src/hooks/useAuth.ts - Already exists, good!

// Add more:
// src/hooks/useWeek.ts
// src/hooks/useRSVP.ts
// src/hooks/useMeal.ts
// src/hooks/useLiveSession.ts
// src/hooks/useMediaQuery.ts
// src/hooks/useLocalStorage.ts
```

### 4. API Route Middleware

**Current Issue:** Auth verification repeated in each API route.

**Recommendation:** Create middleware wrapper.

```tsx
// src/lib/api/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export function withAuth(handler: (req: NextRequest, auth: AuthPayload) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return handler(req, payload);
  };
}

export function withAdmin(handler: (req: NextRequest, auth: AuthPayload) => Promise<NextResponse>) {
  return withAuth(async (req, auth) => {
    if (!auth.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    return handler(req, auth);
  });
}

// Usage
export const POST = withAuth(async (req, auth) => {
  // Handler has access to auth, no boilerplate needed
});
```

### 5. Type-Safe API Client

**Recommendation:** Create a typed API client.

```tsx
// src/lib/api/client.ts
import type { Week, RSVP, Meal, WeekWithDetails } from '@/types';

class APIClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Request failed');
    }

    return res.json();
  }

  weeks = {
    getCurrent: () => this.request<{ data: WeekWithDetails }>('/api/weeks/current'),

    getById: (id: string) => this.request<{ data: WeekWithDetails }>(`/api/weeks/${id}`),
  };

  rsvps = {
    create: (data: { weekId: string; adultCount: number; childCount: number }) =>
      this.request<{ data: RSVP }>('/api/rsvps', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    delete: (weekId: string) =>
      this.request<void>(`/api/rsvps?weekId=${weekId}`, { method: 'DELETE' }),
  };
}

export const api = new APIClient();
```

### 6. Error Boundaries

**Recommendation:** Add error boundaries with proper recovery.

```tsx
// src/components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <DefaultErrorFallback
            error={this.state.error}
            resetErrorBoundary={() => this.setState({ hasError: false })}
          />
        )
      );
    }
    return this.props.children;
  }
}
```

### 7. Constants & Configuration

**Recommendation:** Centralize magic numbers and strings.

```tsx
// src/lib/constants.ts
export const APP_CONFIG = {
  name: 'Tuesday Bible Study',
  description: 'Weekly Bible study app for our small group',
  defaultAdultCount: 2,
  defaultChildCount: 0,
  maxMealDescriptionLength: 200,
  maxNotesLength: 500,
};

export const ROUTES = {
  home: '/home',
  login: '/login',
  week: (id: string) => `/week/${id}`,
  admin: '/admin',
} as const;

export const QUERY_KEYS = {
  currentWeek: ['week', 'current'],
  week: (id: string) => ['week', id],
  study: (id: string) => ['study', id],
} as const;
```

---

## Architecture Improvements

### 1. Server Components Where Possible

**Current:** Most pages are client components.

**Recommendation:** Use Server Components for initial data fetching.

```tsx
// src/app/home/page.tsx - Server Component version
import { Suspense } from 'react';
import { getCurrentWeek } from '@/lib/db/operations';
import { HomeContent } from './HomeContent'; // Client component
import { WeekCardSkeleton } from '@/components/skeletons';

export default async function HomePage() {
  // Fetch on server - faster TTFB
  const weekData = await getCurrentWeek();

  return (
    <main>
      <Suspense fallback={<WeekCardSkeleton />}>
        <HomeContent initialData={weekData} />
      </Suspense>
    </main>
  );
}
```

### 2. Route Groups for Organization

**Current:** Flat structure.

**Recommendation:** Use route groups for better organization.

```
src/app/
├── (public)/           # No auth required
│   ├── page.tsx        # Landing
│   └── login/
├── (authenticated)/    # Auth required
│   ├── home/
│   ├── week/
│   └── layout.tsx      # Auth check wrapper
├── (admin)/            # Admin only
│   ├── admin/
│   └── layout.tsx      # Admin check
└── api/
```

### 3. Shared Layouts

**Recommendation:** Create proper layout hierarchy.

```tsx
// src/app/(authenticated)/layout.tsx
import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export default async function AuthenticatedLayout({ children }) {
  const auth = await getAuthFromCookies();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={auth?.family} />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav isAuthenticated={!!auth} />
    </div>
  );
}
```

---

## Performance Optimizations

### 1. Image Optimization

**Current:** No images in the app.

**Recommendation:** If adding images/avatars later, use next/image.

```tsx
import Image from 'next/image';

<Image
  src={family.avatar}
  alt={family.name}
  width={40}
  height={40}
  className="rounded-full"
  placeholder="blur"
  blurDataURL="data:image/png;base64,..."
/>;
```

### 2. Code Splitting

**Recommendation:** Lazy load non-critical components.

```tsx
import dynamic from 'next/dynamic';

// Lazy load modal components
const RSVPForm = dynamic(() => import('@/components/rsvp/RSVPForm'), {
  loading: () => <ModalSkeleton />,
});

const MealForm = dynamic(() => import('@/components/meal/MealForm'));
```

### 3. Prefetching

**Recommendation:** Prefetch likely navigation targets.

```tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function WeekCard({ week }) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch week detail page on hover/focus
    router.prefetch(`/week/${week.id}`);
  }, [week.id, router]);

  return (
    <Link href={`/week/${week.id}`} prefetch>
      {/* Content */}
    </Link>
  );
}
```

### 4. Bundle Analysis

**Recommendation:** Add bundle analysis script.

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## Accessibility (a11y)

### 1. Skip Links

**Recommendation:** Add skip to content link.

```tsx
// In layout.tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded"
>
  Skip to main content
</a>

// Main content
<main id="main-content" tabIndex={-1}>
```

### 2. Focus Management

**Current Issue:** Focus not managed after modal close or form submit.

**Recommendation:** Implement proper focus management.

```tsx
// In Modal component
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, title, children }) {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      firstFocusableRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // ...
}
```

### 3. Live Regions for Updates

**Recommendation:** Announce dynamic updates to screen readers.

```tsx
// For RSVP count updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {totalAttendees} people are attending this week
</div>
```

### 4. Color Contrast

**Current:** Good contrast ratios overall.

**Recommendation:** Verify with automated tools.

```bash
# Add to CI
npm install -D pa11y-ci
```

### 5. Reduced Motion

**Recommendation:** Respect user preferences.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Modern Features to Add

### 1. PWA Enhancements (HIGH PRIORITY)

**Current:** Basic manifest exists.

**Recommendation:** Complete PWA implementation.

```tsx
// src/lib/serviceWorker.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}

// public/sw.js
const CACHE_NAME = 'bible-study-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/home', '/offline.html', '/manifest.json']);
    })
  );
});
```

### 2. Push Notifications for Live Sessions

**Recommendation:** Notify participants when live session starts.

```tsx
// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

// Send notification when session starts
function notifySessionStart(weekTitle: string) {
  if (Notification.permission === 'granted') {
    new Notification('Bible Study Live Session Started', {
      body: `Join the discussion for ${weekTitle}`,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      vibrate: [200, 100, 200],
    });
  }
}
```

### 3. Offline Support

**Recommendation:** Cache critical data for offline reading.

```tsx
// Use React Query with persistence
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});
```

### 4. Swipe Gestures

**Recommendation:** Add swipe to navigate between weeks.

```tsx
import { useSwipeable } from 'react-swipeable';

function WeekPage({ week, prevWeek, nextWeek }) {
  const router = useRouter();

  const handlers = useSwipeable({
    onSwipedLeft: () => nextWeek && router.push(`/week/${nextWeek.id}`),
    onSwipedRight: () => prevWeek && router.push(`/week/${prevWeek.id}`),
    trackMouse: true,
  });

  return <div {...handlers}>{/* content */}</div>;
}
```

### 5. Share Functionality

**Recommendation:** Add native share for questions/readings.

```tsx
async function shareQuestion(question: Question, weekTitle: string) {
  const shareData = {
    title: `Discussion Question - ${weekTitle}`,
    text: question.text,
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(question.text);
    toast.success('Question copied to clipboard');
  }
}
```

### 6. Bible Verse Quick View

**Already Planned:** Per PROGRESS.md, this is in Phase 6.

**Recommendation:** Design for inline tooltips/popovers.

```tsx
// Detect Bible references and make them interactive
function parseBibleReference(text: string) {
  const bibleRefRegex = /(\d?\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/g;
  // Return parsed references with positions
}

// Render with interactive links
function BibleReferenceLink({ reference }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="text-amber-600 hover:underline">{reference}</button>
      </PopoverTrigger>
      <PopoverContent>
        <VerseContent reference={reference} />
      </PopoverContent>
    </Popover>
  );
}
```

---

## Mobile Experience

### 1. Bottom Navigation

**Current:** No persistent navigation on mobile.

**Recommendation:** Add bottom navigation bar.

```tsx
// src/components/BottomNav.tsx
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 safe-area-bottom">
      <div className="flex justify-around py-2">
        <NavItem href="/home" icon={HomeIcon} label="Home" active={pathname === '/home'} />
        <NavItem
          href="/weeks"
          icon={CalendarIcon}
          label="Weeks"
          active={pathname.startsWith('/week')}
        />
        <NavItem href="/meals" icon={UtensilsIcon} label="Meals" active={pathname === '/meals'} />
        <NavItem
          href="/settings"
          icon={SettingsIcon}
          label="Settings"
          active={pathname === '/settings'}
        />
      </div>
    </nav>
  );
}
```

### 2. Pull to Refresh

**Recommendation:** Add pull-to-refresh gesture.

```tsx
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

function HomePage() {
  const { data, refetch } = useCurrentWeek();
  const { pullToRefreshProps, isRefreshing } = usePullToRefresh(refetch);

  return (
    <div {...pullToRefreshProps}>
      {isRefreshing && <RefreshIndicator />}
      {/* content */}
    </div>
  );
}
```

### 3. Haptic Feedback

**Recommendation:** Use vibration API for tactile feedback.

```tsx
// src/lib/haptics.ts
export const haptics = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(25),
  heavy: () => navigator.vibrate?.(50),
  success: () => navigator.vibrate?.([50, 30, 50]),
  error: () => navigator.vibrate?.([50, 50, 50, 50, 50]),
};
```

### 4. Touch Target Sizes

**Current:** Some touch targets may be too small.

**Recommendation:** Ensure minimum 44x44px for all interactive elements.

```tsx
// Already in week/[id]/page.tsx, but apply consistently
<button className="min-h-[44px] min-w-[44px] ...">
```

---

## Security Enhancements

### 1. Rate Limiting

**Recommendation:** Add rate limiting to API routes.

```tsx
// src/lib/rateLimit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(ip: string, limit = 10): boolean {
  const count = (rateLimit.get(ip) as number) || 0;
  if (count >= limit) return false;
  rateLimit.set(ip, count + 1);
  return true;
}
```

### 2. Input Sanitization

**Recommendation:** Sanitize all user inputs.

```tsx
import DOMPurify from 'dompurify';

// For any HTML content
const sanitizedHtml = DOMPurify.sanitize(userInput);

// For plain text
const sanitizedText = userInput.trim().slice(0, 500);
```

### 3. CSRF Protection

**Recommendation:** Consider CSRF tokens for mutations.

```tsx
// Already using httpOnly cookies which helps, but consider:
// - Adding CSRF token to forms
// - Verifying Origin header in API routes
```

---

## Testing Recommendations

### 1. Component Testing

**Current:** Some components have tests.

**Recommendation:** Increase coverage, especially for forms.

```tsx
// src/components/rsvp/RSVPForm.test.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { RSVPForm } from './RSVPForm';

describe('RSVPForm', () => {
  it('increments adult count on plus button click', async () => {
    render(<RSVPForm isOpen weekId="1" onClose={jest.fn()} onSuccess={jest.fn()} />);

    const plusButton = screen.getByLabelText('Increase adult count');
    await userEvent.click(plusButton);

    expect(screen.getByText('3')).toBeInTheDocument(); // Default 2 + 1
  });

  it('submits with correct data', async () => {
    const onSuccess = jest.fn();
    render(<RSVPForm isOpen weekId="1" onClose={jest.fn()} onSuccess={onSuccess} />);

    await userEvent.click(screen.getByText('RSVP'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

### 2. E2E Testing

**Current:** Playwright configured but tests not written.

**Recommendation:** Add critical path E2E tests.

```tsx
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('displays current week content', async ({ page }) => {
    await page.goto('/home');

    await expect(page.getByRole('heading', { name: /week/i })).toBeVisible();
    await expect(page.getByText(/readings/i)).toBeVisible();
  });

  test('can RSVP after login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="text"]', 'TESTCODE');
    await page.click('button[type="submit"]');

    // Navigate to week
    await page.click('text=View Full Details');

    // RSVP
    await page.click('text=RSVP Now');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.click('text=RSVP');

    await expect(page.getByText(/rsvp saved/i)).toBeVisible();
  });
});
```

### 3. API Testing

**Recommendation:** Add API integration tests.

```tsx
// src/app/api/rsvps/route.test.ts
import { POST, DELETE } from './route';

describe('RSVP API', () => {
  it('creates RSVP for authenticated user', async () => {
    const req = new Request('http://localhost/api/rsvps', {
      method: 'POST',
      body: JSON.stringify({ weekId: '1', adultCount: 2, childCount: 1 }),
      headers: { Cookie: 'auth_token=valid-token' },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it('rejects unauthenticated requests', async () => {
    const req = new Request('http://localhost/api/rsvps', {
      method: 'POST',
      body: JSON.stringify({ weekId: '1', adultCount: 2 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
```

---

## Priority Matrix

| Category | Task                          | Impact | Effort | Priority |
| -------- | ----------------------------- | ------ | ------ | -------- |
| Data     | Integrate React Query         | High   | Medium | **P0**   |
| UX       | Add skeleton loading states   | High   | Low    | **P0**   |
| UX       | Toast notifications           | High   | Low    | **P0**   |
| Theme    | Dark mode toggle              | Medium | Low    | **P1**   |
| A11y     | Skip links & focus management | Medium | Low    | **P1**   |
| Code     | API middleware (auth wrapper) | Medium | Low    | **P1**   |
| Mobile   | Bottom navigation             | High   | Medium | **P1**   |
| PWA      | Service worker & offline      | High   | High   | **P2**   |
| Feature  | Push notifications            | Medium | High   | **P2**   |
| Testing  | E2E critical paths            | Medium | Medium | **P2**   |
| Code     | Typed API client              | Low    | Medium | **P3**   |
| Mobile   | Swipe gestures                | Low    | Medium | **P3**   |

---

## Quick Wins (Can be done in < 1 hour each)

1. **Add toast notification library** (sonner or react-hot-toast)
2. **Create skeleton components** for cards and lists
3. **Add dark mode toggle** to settings/header
4. **Extract useCurrentWeek hook** using React Query
5. **Add skip link** to layout
6. **Create constants file** for magic numbers
7. **Add min-height to all buttons** for touch targets

---

## Conclusion

The Bible Study app has a **strong foundation** and follows many best practices. The most impactful improvements would be:

1. **Leverage React Query** - It's already installed but not used
2. **Polish the UX** - Skeleton screens, toasts, better empty states
3. **Complete the PWA** - Offline support for reading content during meetings
4. **Add bottom navigation** - Critical for mobile-first experience

These suggestions are organized by priority and effort to help plan the next development phases effectively.

---

_This analysis was performed in read-only mode. No changes were made to the codebase._
