'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, Badge, SkeletonWeekDetail, ThemeToggle } from '@/components/ui';
import { RSVPForm } from '@/components/rsvp';
import { MealForm } from '@/components/meal';
import { VerseText } from '@/components/verse';
import { useAuth } from '@/contexts/AuthContext';
import { useWeek } from '@/hooks';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WeekDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, family } = useAuth();
  const { data: weekResponse, isLoading, error } = useWeek(id);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);

  const weekData = weekResponse?.data;
  const prevWeek = weekResponse?.prevWeek;
  const nextWeek = weekResponse?.nextWeek;

  // Find current user's RSVP
  const currentUserRsvp = weekData?.rsvps.find((r) => r.familyId === family?.id);

  // Check if current user owns the meal signup
  const isMealOwner = weekData?.meal?.familyId === family?.id;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
        <SkeletonWeekDetail />
      </main>
    );
  }

  if (error || !weekData) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
        <div className="mx-auto max-w-2xl p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Week not found'}
              </p>
              <Link href="/home">
                <Button className="mt-4">Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-lg p-2 text-stone-600 transition-colors hover:bg-stone-100 active:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-800 dark:active:bg-stone-700"
            aria-label="Go back to previous page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-lg font-bold text-stone-900 dark:text-white">
            Week {weekData.weekNumber}
          </h1>
          <ThemeToggle size="sm" />
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {/* Week Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                {weekData.title || `Week ${weekData.weekNumber}`}
              </h2>
              <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                {weekData.study.title}
              </p>
              <p className="mt-2 text-stone-600 dark:text-stone-400">
                {formatDate(new Date(weekData.date), {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Live Session Button */}
            {weekData.liveSession?.isActive && (
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
                Join Live Session
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Readings Section */}
        {weekData.readings.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-white">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30"
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </span>
                Readings
              </h3>
              <div className="space-y-3">
                {weekData.readings.map((reading) => (
                  <div
                    key={reading.id}
                    className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800"
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant={reading.type === 'bible' ? 'warning' : 'info'}>
                        {reading.type === 'bible' ? 'Bible' : 'Book'}
                      </Badge>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">
                          <VerseText text={reading.reference} />
                        </p>
                        {reading.description && (
                          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                            <VerseText text={reading.description} />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discussion Questions Section */}
        {weekData.questions.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-white">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                Discussion Questions
              </h3>
              <div className="space-y-4">
                {weekData.questions.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-lg border-l-4 border-blue-500 bg-stone-50 p-4 dark:bg-stone-800"
                  >
                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {question.number}
                      </span>
                      <p className="text-stone-800 dark:text-stone-200">
                        <VerseText text={question.text} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance & Meal Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-stone-900 dark:text-white">
              This Week&apos;s Gathering
            </h3>

            {/* Attendance Summary */}
            <div className="mb-4 flex items-center gap-6">
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
                  <p className="text-sm text-stone-500 dark:text-stone-400">Attending</p>
                  <p className="font-semibold text-stone-900 dark:text-white">
                    {weekData.totalAdults} adults, {weekData.totalChildren} kids
                  </p>
                </div>
              </div>
            </div>

            {/* Meal Info */}
            {weekData.meal ? (
              <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">
                      🍽️
                    </span>
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">
                        {weekData.meal.familyName} is bringing the meal
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {weekData.meal.description}
                      </p>
                    </div>
                  </div>
                  {isAuthenticated && isMealOwner && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowMealForm(true)}
                      aria-label="Edit your meal signup"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-stone-300 p-4 text-center dark:border-stone-600">
                <p className="text-stone-500 dark:text-stone-400">No meal signed up yet</p>
                {isAuthenticated && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2"
                    onClick={() => setShowMealForm(true)}
                  >
                    Sign Up to Bring Meal
                  </Button>
                )}
              </div>
            )}

            {/* RSVP List */}
            {weekData.rsvps.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                  Who&apos;s Coming:
                </p>
                <div className="flex flex-wrap gap-2">
                  {weekData.rsvps.map((rsvp) => (
                    <Badge key={rsvp.id} variant="default">
                      {rsvp.familyName} ({rsvp.adultCount + rsvp.childCount})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* RSVP Button */}
            {isAuthenticated && (
              <div className="mt-4 border-t border-stone-200 pt-4 dark:border-stone-700">
                <Button className="w-full" onClick={() => setShowRsvpForm(true)}>
                  {currentUserRsvp ? 'Update RSVP' : 'RSVP Now'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RSVP Form Modal */}
        {isAuthenticated && weekData && (
          <RSVPForm
            isOpen={showRsvpForm}
            onClose={() => setShowRsvpForm(false)}
            weekId={weekData.id}
            existingRsvp={currentUserRsvp}
          />
        )}

        {/* Meal Form Modal */}
        {isAuthenticated && weekData && (
          <MealForm
            isOpen={showMealForm}
            onClose={() => setShowMealForm(false)}
            weekId={weekData.id}
            existingMeal={weekData.meal}
            isOwner={isMealOwner}
          />
        )}

        {/* Week Navigation */}
        <nav className="flex justify-between gap-4 pb-8" aria-label="Week navigation">
          {prevWeek ? (
            <Link href={`/week/${prevWeek.id}`} className="flex-1">
              <Button variant="secondary" className="w-full min-h-[44px]">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Week {prevWeek.weekNumber}
              </Button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextWeek ? (
            <Link href={`/week/${nextWeek.id}`} className="flex-1">
              <Button variant="secondary" className="w-full min-h-[44px]">
                Week {nextWeek.weekNumber}
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </div>
    </main>
  );
}
