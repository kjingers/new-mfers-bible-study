# Design Reference - Bible Study App

This document captures design patterns and UI/UX decisions based on analysis of the MFers Bible Study App and best practices for mobile-first faith-based applications.

## Design Philosophy

- **Warm & Welcoming**: Stone + Amber palette creates a cozy, candlelit atmosphere
- **Mobile-First**: Bottom navigation, large touch targets, safe area handling
- **Accessibility**: Focus rings, ARIA labels, semantic HTML
- **Performance**: Skeleton loading, optimized animations
- **Scripture-Focused**: Serif typography for Bible verses, subtle styling for references

---

## Color Palette

### Light Mode

| Token         | Value     | Tailwind    |
| ------------- | --------- | ----------- |
| Background    | `#fafaf9` | `stone-50`  |
| Foreground    | `#1c1917` | `stone-900` |
| Card          | `#ffffff` | `white`     |
| Card Border   | `#e7e5e4` | `stone-200` |
| Primary       | `#d97706` | `amber-600` |
| Primary Hover | `#b45309` | `amber-700` |

### Candlelight Dark Mode (Warm, not cold gray)

| Token         | Value     | Description            |
| ------------- | --------- | ---------------------- |
| Background    | `#1a1614` | Warm dark brown        |
| Foreground    | `#faf5f0` | Warm off-white         |
| Card          | `#262220` | Warm dark card         |
| Card Border   | `#3d3633` | Warm border            |
| Primary       | `#f59e0b` | `amber-500` (brighter) |
| Primary Hover | `#fbbf24` | `amber-400`            |

---

## Layout Patterns

### Page Structure

```tsx
<main className="min-h-screen bg-stone-50 dark:bg-stone-900">
  {/* Sticky Header with glassmorphism */}
  <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/80">
    <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
      {/* Header content */}
    </div>
  </header>

  {/* Content Container */}
  <div className="mx-auto max-w-2xl space-y-4 p-4">{/* Cards stacked vertically */}</div>
</main>
```

### Key Measurements

- **Max width**: `max-w-2xl` (672px) - keeps content readable
- **Padding**: `p-4` (16px) on content areas
- **Spacing**: `space-y-4` between cards
- **Bottom nav height**: 56px + safe area inset

---

## Component Patterns

### Cards

```tsx
// Standard card
<Card className="rounded-xl bg-white p-4 shadow-sm dark:bg-stone-800">

// Interactive card with hover
<Card className="transition-shadow hover:shadow-md cursor-pointer">

// Alert/Banner card
<Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
```

### Section Headers with Icon

```tsx
<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-white">
  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
    <Icon className="h-4 w-4 text-amber-600" />
  </span>
  Section Title
</h3>
```

### Discussion Question Cards

```tsx
<div className="rounded-lg border-l-4 border-blue-500 bg-stone-50 p-4 dark:bg-stone-800">
  <div className="flex gap-3">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
      {number}
    </span>
    <p className="text-stone-800 dark:text-stone-200">{text}</p>
  </div>
</div>
```

---

## Typography

### Font Stack

- **UI**: System fonts (Geist Sans for this app)
- **Scripture**: `Georgia, 'Times New Roman', Times, serif`

### Text Sizes

| Usage           | Class                                        |
| --------------- | -------------------------------------------- |
| Page title      | `text-2xl font-bold`                         |
| Section heading | `text-lg font-semibold`                      |
| Subsection      | `text-sm font-semibold`                      |
| Body            | `text-base` (default)                        |
| Secondary       | `text-sm text-stone-600 dark:text-stone-400` |
| Meta/caption    | `text-xs text-stone-500`                     |

### Scripture Styling

```css
.font-scripture {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 1.05em;
  line-height: 1.75;
  letter-spacing: 0.01em;
}

.verse-number {
  font-size: 0.65em;
  font-weight: 600;
  vertical-align: super;
  color: var(--primary);
  opacity: 0.8;
}
```

---

## Touch Targets (Mobile)

| Element              | Size                               |
| -------------------- | ---------------------------------- |
| Minimum touch target | `44px × 44px`                      |
| Stepper buttons      | `48px × 48px` (`h-12 w-12`)        |
| Bottom nav items     | `56px` min height                  |
| Buttons              | `44px` min height (`min-h-[44px]`) |

---

## Animations

### CSS Keyframes (defined in globals.css)

- `fade-in` - 0.2s ease-out
- `slide-up` - 0.3s ease-out
- `scale-in` - 0.2s ease-out
- `glow-pulse` - 2s infinite (for live indicators)

### Usage

```tsx
// Card entrance
className="animate-fade-in"

// Theme toggle
className="transition-all duration-300 active:scale-95"

// Card hover
className="transition-shadow hover:shadow-md"

// Live indicator
<span className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
```

---

## Features to Implement

### From Reference App (MFers Bible Study)

1. **Verse Detection & Modal** - Click Bible references to see verse text
   - Multiple translation support (ESV, NIV, etc.)
   - Uses Bible API for verse lookup
   - Modal with translation tabs

2. **Live Session Sync** - Real-time question highlighting during meetings
   - SignalR for real-time updates
   - Admin controls current question
   - All users see highlighted question

### Our Unique Features

1. **Bottom Navigation** - iOS-style app navigation
2. **Candlelight Theme** - Warm dark mode (not cold gray)
3. **Family-based Auth** - Simple family codes
4. **RSVP & Meals** - Attendance and meal coordination

---

## Design Tokens Summary

| Token                        | Value                 |
| ---------------------------- | --------------------- |
| Border Radius (Card)         | `rounded-xl` (12px)   |
| Border Radius (Button/Input) | `rounded-lg` (8px)    |
| Border Radius (Badge)        | `rounded-full`        |
| Shadow (Card)                | `shadow-sm`           |
| Shadow (Hover)               | `shadow-md`           |
| Transition Duration          | `150ms` to `300ms`    |
| Content Max Width            | `max-w-2xl` (672px)   |
| Primary Color                | Amber-600 (`#d97706`) |
| Neutral Palette              | Stone                 |

---

## File References

- **Theme**: `src/contexts/ThemeContext.tsx`
- **Bottom Nav**: `src/components/ui/BottomNav.tsx`
- **Theme Toggle**: `src/components/ui/ThemeToggle.tsx`
- **Global Styles**: `src/app/globals.css`
- **Verse Components**: `src/components/verse/`
