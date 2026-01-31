'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Badge, ThemeToggle } from '@/components/ui';
import { MealForm } from '@/components/meal';
import { useWeeks } from '@/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';
import type { WeekWithDetails } from '@/types';

function getWeekStatus(weekDate: string): 'past' | 'current' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(weekDate + 'T00:00:00');

  const dayOfWeek = today.getDay();
  const daysSinceTuesday = dayOfWeek >= 2 ? dayOfWeek - 2 : dayOfWeek + 5;
  const lastTuesday = new Date(today);
  lastTuesday.setDate(today.getDate() - daysSinceTuesday);
  const nextTuesday = new Date(lastTuesday);
  nextTuesday.setDate(lastTuesday.getDate() + 7);

  if (date >= lastTuesday && date < nextTuesday) {
    return 'current';
  } else if (date < today) {
    return 'past';
  }
  return 'upcoming';
}

function MealWeekCard({
  week,
  familyId,
  onSignupClick,
}: {
  week: WeekWithDetails;
  familyId: string | undefined;
  onSignupClick: () => void;
}) {
  const status = getWeekStatus(week.date);
  const isCurrentWeek = status === 'current';
  const isOwner = week.meal?.familyId === familyId;

  return (
    <Card
      className={`overflow-hidden transition-all ${
        isCurrentWeek ? 'ring-2 ring-amber-500/50 dark:ring-amber-400/30' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-stone-900 dark:text-white">
                Week {week.weekNumber}
              </h3>
              {isCurrentWeek && <Badge variant="success">This Week</Badge>}
            </div>
            {week.title && (
              <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                {week.title}
              </p>
            )}
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {formatDate(new Date(week.date), {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Attendance count */}
          <div className="text-right">
            <p className="text-lg font-bold text-stone-900 dark:text-white">
              {week.totalAdults + week.totalChildren}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">attending</p>
          </div>
        </div>

        {/* Meal Status */}
        <div className="mt-4">
          {week.meal ? (
            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍽️</span>
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">
                      {week.meal.familyName}
                    </p>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {week.meal.description}
                    </p>
                  </div>
                </div>
                {familyId && isOwner && (
                  <Button size="sm" variant="secondary" onClick={onSignupClick}>
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <p className="font-medium text-green-700 dark:text-green-300">
                    Meal slot available!
                  </p>
                </div>
                {familyId && (
                  <Button size="sm" onClick={onSignupClick}>
                    Sign Up
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MealsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 bg-stone-200 dark:bg-stone-700 rounded-xl" />
      ))}
    </div>
  );
}

function GuestBanner() {
  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Sign in to sign up for meals
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              You need to sign in with your family code to volunteer to bring a meal.
            </p>
            <Link href="/login">
              <Button size="sm" className="mt-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MealsPage() {
  const { data, isLoading, error } = useWeeks();
  const { isAuthenticated, isLoading: authLoading, family } = useAuth();
  const [mealModalWeek, setMealModalWeek] = useState<WeekWithDetails | null>(null);

  const weeks = data?.data || [];
  const upcomingWeeks = weeks.filter((w) => getWeekStatus(w.date) !== 'past');
  const pastWeeks = weeks.filter((w) => getWeekStatus(w.date) === 'past');

  // Stats
  const weeksWithMeals = upcomingWeeks.filter((w) => w.meal);
  const availableSlots = upcomingWeeks.filter((w) => !w.meal);

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900 has-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-stone-900 dark:text-white">Meals</h1>
          <ThemeToggle size="sm" />
        </div>
      </header>

      {isLoading || authLoading ? (
        <MealsSkeleton />
      ) : error ? (
        <div className="mx-auto max-w-2xl p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Failed to load meals data'}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-4 p-4">
          {/* Guest Banner */}
          {!isAuthenticated && <GuestBanner />}

          {/* Summary Stats */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    Meal Schedule
                  </p>
                  <div className="mt-1 flex items-center gap-4">
                    <p className="text-2xl font-bold text-stone-900 dark:text-white">
                      {weeksWithMeals.length}{' '}
                      <span className="text-base font-normal text-stone-500">filled</span>
                    </p>
                    {availableSlots.length > 0 && (
                      <p className="text-lg font-medium text-green-600 dark:text-green-400">
                        {availableSlots.length} available
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <span className="text-2xl">🍽️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Weeks */}
          {upcomingWeeks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-stone-500 dark:text-stone-400">No upcoming gatherings.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 px-1">
                Upcoming Meals
              </h2>
              {upcomingWeeks.map((week) => (
                <MealWeekCard
                  key={week.id}
                  week={week}
                  familyId={family?.id}
                  onSignupClick={() => setMealModalWeek(week)}
                />
              ))}
            </div>
          )}

          {/* Past Weeks Summary */}
          {pastWeeks.length > 0 && (
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-500 dark:text-stone-400 py-2 px-1">
                <svg
                  className="h-4 w-4 transition-transform group-open:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Past Meals ({pastWeeks.length})
              </summary>
              <div className="space-y-2 mt-2">
                {pastWeeks.map((week) => (
                  <Card key={week.id} className="opacity-60">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {week.meal && <span>🍽️</span>}
                          <div>
                            <p className="font-medium text-stone-700 dark:text-stone-300">
                              Week {week.weekNumber}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {formatDate(new Date(week.date), { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        {week.meal ? (
                          <p className="text-sm text-stone-600 dark:text-stone-400">
                            {week.meal.familyName}
                          </p>
                        ) : (
                          <p className="text-sm text-stone-400 italic">No meal</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Meal Modal */}
      {mealModalWeek && isAuthenticated && (
        <MealForm
          isOpen={!!mealModalWeek}
          onClose={() => setMealModalWeek(null)}
          weekId={mealModalWeek.id}
          existingMeal={mealModalWeek.meal}
          isOwner={mealModalWeek.meal?.familyId === family?.id}
        />
      )}
    </main>
  );
}
