// Core domain types for the Bible Study app

/**
 * A study is a multi-week series (typically 10-15 weeks).
 * Only one study is active at a time.
 */
export interface Study {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string (Tuesday)
  endDate: string; // ISO date string (Tuesday)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * A week represents one Tuesday meeting within a study.
 */
export interface Week {
  id: string;
  studyId: string;
  weekNumber: number;
  date: string; // ISO date string (Tuesday)
  title?: string;
  readings: Reading[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Reading assignment for a week.
 */
export interface Reading {
  id: string;
  type: 'bible' | 'book';
  reference: string; // e.g., "Romans 5:1-21" or "Chapters 3-4"
  description?: string;
}

/**
 * Discussion question for a week.
 */
export interface Question {
  id: string;
  number: number;
  text: string;
}

/**
 * A family in the Bible study group.
 */
export interface Family {
  id: string;
  name: string;
  members: string[]; // Names of family members
  isAdmin: boolean;
  createdAt: string;
}

/**
 * Meal signup for a week.
 */
export interface Meal {
  id: string;
  weekId: string;
  familyId: string;
  familyName: string; // Denormalized for display
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * RSVP for a family attending a week.
 */
export interface RSVP {
  id: string;
  weekId: string;
  familyId: string;
  familyName: string; // Denormalized for display
  adultCount: number;
  childCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Live session for real-time question sync.
 */
export interface LiveSession {
  id: string;
  weekId: string;
  currentQuestionIndex: number;
  isActive: boolean;
  controlledBy: string; // Family ID
  startedAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Aggregate types for views
export interface WeekWithDetails extends Week {
  study: Study;
  meal?: Meal;
  rsvps: RSVP[];
  totalAdults: number;
  totalChildren: number;
  liveSession?: LiveSession;
}

export interface ThisWeekSummary {
  week: WeekWithDetails | null;
  isCurrentWeek: boolean;
  nextWeek?: Week;
}
