'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Badge, ThemeToggle } from '@/components/ui';
import { RSVPForm } from '@/components/rsvp';
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

function RSVPWeekCard({
  week,
  familyId,
  onRsvpClick,
}: {
  week: WeekWithDetails;
  familyId: string | undefined;
  onRsvpClick: () => void;
}) {
  const status = getWeekStatus(week.date);
  const userRsvp = week.rsvps.find((r) => r.familyId === familyId);
  const isCurrentWeek = status === 'current';

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
              {userRsvp && (
                <Badge variant="info" className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  You&apos;re Going
                </Badge>
              )}
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
        </div>

        {/* Attendance Stats */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
            <div>
              <p className="text-2xl font-bold text-stone-900 dark:text-white">
                {week.totalAdults + week.totalChildren}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {week.totalAdults} adults, {week.totalChildren} kids
              </p>
            </div>
          </div>

          {week.meal && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <div>
                <p className="text-sm font-medium text-stone-900 dark:text-white">
                  {week.meal.familyName}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">bringing meal</p>
              </div>
            </div>
          )}
        </div>

        {/* Who's Coming */}
        {week.rsvps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
              Who&apos;s Coming:
            </p>
            <div className="flex flex-wrap gap-2">
              {week.rsvps.map((rsvp) => (
                <Badge key={rsvp.id} variant={rsvp.familyId === familyId ? 'success' : 'default'}>
                  {rsvp.familyName} ({rsvp.adultCount + rsvp.childCount})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* RSVP Action */}
        {familyId && (
          <Button className="w-full mt-4 min-h-[44px]" onClick={onRsvpClick}>
            {userRsvp ? (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Update RSVP
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                RSVP Now
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function RSVPSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 bg-stone-200 dark:bg-stone-700 rounded-xl" />
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
              Sign in to RSVP
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              You need to sign in with your family code to RSVP for upcoming gatherings.
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

export default function RSVPPage() {
  const { data, isLoading, error } = useWeeks();
  const { isAuthenticated, isLoading: authLoading, family } = useAuth();
  const [rsvpModalWeek, setRsvpModalWeek] = useState<WeekWithDetails | null>(null);

  const weeks = data?.data || [];
  const upcomingWeeks = weeks.filter((w) => getWeekStatus(w.date) !== 'past');
  const pastWeeks = weeks.filter((w) => getWeekStatus(w.date) === 'past');

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900 has-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-stone-900 dark:text-white">RSVP</h1>
          <ThemeToggle size="sm" />
        </div>
      </header>

      {isLoading || authLoading ? (
        <RSVPSkeleton />
      ) : error ? (
        <div className="mx-auto max-w-2xl p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Failed to load RSVP data'}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-4 p-4">
          {/* Guest Banner */}
          {!isAuthenticated && <GuestBanner />}

          {/* Summary Stats */}
          {isAuthenticated && upcomingWeeks.length > 0 && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                      Your RSVPs
                    </p>
                    <p className="text-2xl font-bold text-stone-900 dark:text-white">
                      {
                        upcomingWeeks.filter((w) => w.rsvps.some((r) => r.familyId === family?.id))
                          .length
                      }{' '}
                      <span className="text-base font-normal text-stone-500">
                        / {upcomingWeeks.length} upcoming
                      </span>
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                Upcoming Gatherings
              </h2>
              {upcomingWeeks.map((week) => (
                <RSVPWeekCard
                  key={week.id}
                  week={week}
                  familyId={family?.id}
                  onRsvpClick={() => setRsvpModalWeek(week)}
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
                Past Gatherings ({pastWeeks.length})
              </summary>
              <div className="space-y-2 mt-2">
                {pastWeeks.map((week) => (
                  <Card key={week.id} className="opacity-60">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-stone-700 dark:text-stone-300">
                            Week {week.weekNumber}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {formatDate(new Date(week.date), { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                          {week.totalAdults + week.totalChildren} attended
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpModalWeek && isAuthenticated && (
        <RSVPForm
          isOpen={!!rsvpModalWeek}
          onClose={() => setRsvpModalWeek(null)}
          weekId={rsvpModalWeek.id}
          existingRsvp={rsvpModalWeek.rsvps.find((r) => r.familyId === family?.id)}
        />
      )}
    </main>
  );
}
