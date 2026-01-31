'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Badge, Loading } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';
import type { WeekWithDetails } from '@/types';

interface CurrentWeekResponse {
  data: WeekWithDetails | null;
  isCurrentWeek?: boolean;
  study?: { title: string };
  message?: string;
  error?: string;
}

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading, family } = useAuth();
  const [weekData, setWeekData] = useState<WeekWithDetails | null>(null);
  const [isCurrentWeek, setIsCurrentWeek] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurrentWeek() {
      try {
        const response = await fetch('/api/weeks/current');
        const data: CurrentWeekResponse = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setWeekData(data.data);
          setIsCurrentWeek(data.isCurrentWeek || false);
        }
      } catch {
        setError("Failed to load this week's content");
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentWeek();
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-stone-900 dark:text-white">Tuesday Bible Study</h1>
          <div className="flex items-center gap-2">
            {authLoading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-stone-200 dark:bg-stone-700" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-stone-600 dark:text-stone-400">{family?.name}</span>
                {family?.isAdmin && <Badge variant="info">Admin</Badge>}
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="secondary">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {/* This Week Card */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loading message="Loading this week..." />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : weekData ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                    {weekData.title || `Week ${weekData.weekNumber}`}
                  </h2>
                  <Badge variant={isCurrentWeek ? 'success' : 'default'}>
                    {isCurrentWeek ? 'This Week' : 'Upcoming'}
                  </Badge>
                </div>

                <div className="mb-4 text-sm text-stone-600 dark:text-stone-400">
                  {formatDate(new Date(weekData.date), {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                {/* Study Title */}
                <div className="mb-4 text-sm font-medium text-amber-600 dark:text-amber-400">
                  {weekData.study.title}
                </div>

                {/* Readings */}
                {weekData.readings.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                      Readings
                    </h3>
                    <div className="space-y-2">
                      {weekData.readings.map((reading) => (
                        <div
                          key={reading.id}
                          className="flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800"
                        >
                          <span
                            className={`text-xs font-medium ${
                              reading.type === 'bible'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }`}
                          >
                            {reading.type === 'bible' ? '📖' : '📚'}
                          </span>
                          <span className="text-sm text-stone-700 dark:text-stone-300">
                            {reading.reference}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Questions Preview */}
                {weekData.questions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-stone-700 dark:text-stone-300">
                      Discussion Questions ({weekData.questions.length})
                    </h3>
                    <div className="rounded-lg bg-stone-100 p-3 dark:bg-stone-800">
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {weekData.questions[0].text}
                      </p>
                      {weekData.questions.length > 1 && (
                        <p className="mt-2 text-xs text-stone-500">
                          +{weekData.questions.length - 1} more questions
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Attendance Info */}
                <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                  <span>👨‍👩‍👧‍👦 {weekData.totalAdults + weekData.totalChildren} attending</span>
                  {weekData.meal && <span>🍽️ {weekData.meal.familyName} bringing meal</span>}
                </div>
              </>
            ) : (
              <div className="space-y-3 rounded-lg bg-stone-100 p-4 dark:bg-stone-800">
                <p className="text-center text-stone-500 dark:text-stone-400">
                  No study content available yet.
                </p>
                <p className="text-center text-sm text-stone-400 dark:text-stone-500">
                  Check back soon or ask an admin to set up the study.
                </p>
                {isAuthenticated && family?.isAdmin && (
                  <div className="mt-4 text-center">
                    <Button
                      size="sm"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          await fetch('/api/seed', { method: 'POST' });
                          window.location.reload();
                        } catch {
                          setError('Failed to seed database');
                          setLoading(false);
                        }
                      }}
                    >
                      Seed Sample Data
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <svg
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-stone-900 dark:text-white">Readings</h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">View assignments</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-stone-900 dark:text-white">Questions</h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Discussion topics</p>
            </CardContent>
          </Card>

          <Card
            className={`transition-shadow ${isAuthenticated ? 'cursor-pointer hover:shadow-md' : 'opacity-60'}`}
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
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
              <h3 className="font-medium text-stone-900 dark:text-white">RSVP</h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                {isAuthenticated ? 'Mark attendance' : 'Sign in required'}
              </p>
            </CardContent>
          </Card>

          <Card
            className={`transition-shadow ${isAuthenticated ? 'cursor-pointer hover:shadow-md' : 'opacity-60'}`}
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-stone-900 dark:text-white">Meals</h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                {isAuthenticated ? 'Sign up to bring' : 'Sign in required'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guest Mode Banner */}
        {!authLoading && !isAuthenticated && (
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    You&apos;re browsing as a guest
                  </p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    Sign in with your family code to RSVP and sign up for meals.
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
        )}

        {/* Footer */}
        <div className="py-4 text-center text-xs text-stone-400">
          Made with love for Tuesday nights
        </div>
      </div>
    </main>
  );
}
