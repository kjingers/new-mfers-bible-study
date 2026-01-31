'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  Badge,
  SkeletonWeekDetail,
  ThemeToggle,
  Collapsible,
} from '@/components/ui';
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
      <main className="min-h-screen bg-stone-50 dark:bg-stone-900 has-bottom-nav">
        <SkeletonWeekDetail />
      </main>
    );
  }

  if (error || !weekData) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-900 has-bottom-nav">
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
    <main className="min-h-screen bg-stone-50 dark:bg-stone-900 has-bottom-nav">
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
      <div className="mx-auto max-w-2xl p-4">
        {/* Week Header with Navigation */}
        <div className="text-center mb-4">
          {/* Study Title */}
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">
            {weekData.study.title}
          </p>

          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-4">
            {/* Previous Week Button */}
            {prevWeek ? (
              <Link
                href={`/week/${prevWeek.id}`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label={`Go to Week ${prevWeek.weekNumber}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
            ) : (
              <div className="h-10 w-10" />
            )}

            {/* Week Info */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                Week {weekData.weekNumber}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {formatDate(new Date(weekData.date), {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {weekData.title && (
                <p className="mt-1 text-stone-600 dark:text-stone-300 italic">
                  &ldquo;{weekData.title}&rdquo;
                </p>
              )}
            </div>

            {/* Next Week Button */}
            {nextWeek ? (
              <Link
                href={`/week/${nextWeek.id}`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label={`Go to Week ${nextWeek.weekNumber}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div className="h-10 w-10" />
            )}
          </div>
        </div>

        {/* Live Session Banner */}
        {weekData.liveSession?.isActive && (
          <Card className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="font-semibold text-red-700 dark:text-red-300">LIVE SESSION</span>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Join Live
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Card */}
        <Card className="overflow-hidden">
          {/* Readings Section */}
          <Collapsible
            title="This Week's Reading"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
            rightContent={<Badge variant="default">{weekData.readings.length} readings</Badge>}
          >
            {weekData.readings.length > 0 ? (
              <div className="space-y-4">
                {weekData.readings.map((reading) => (
                  <div key={reading.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={reading.type === 'bible' ? 'warning' : 'info'}
                        className="text-xs"
                      >
                        {reading.type === 'bible' ? 'Bible' : 'Book'}
                      </Badge>
                    </div>
                    <p className="font-serif text-xl font-semibold text-amber-700 dark:text-amber-400">
                      <VerseText text={reading.reference} />
                    </p>
                    {reading.description && (
                      <p className="mt-1 text-stone-600 dark:text-stone-400 leading-relaxed">
                        <VerseText text={reading.description} />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 dark:text-stone-400 italic">
                No readings assigned for this week.
              </p>
            )}
          </Collapsible>

          {/* Discussion Questions Section */}
          <Collapsible
            title="Discussion Questions"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            rightContent={<Badge variant="default">{weekData.questions.length} questions</Badge>}
          >
            {weekData.questions.length > 0 ? (
              <div className="space-y-4">
                {weekData.questions.map((question) => (
                  <div key={question.id} className="flex gap-3">
                    <span className="flex-shrink-0 font-bold text-amber-600 dark:text-amber-400 text-lg">
                      {question.number}.
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      <VerseText text={question.text} />
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 dark:text-stone-400 italic">
                No discussion questions for this week.
              </p>
            )}
          </Collapsible>

          {/* Meal & Attendance Section */}
          <Collapsible
            title="This Week's Gathering"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            rightContent={
              <span className="text-sm text-stone-500 dark:text-stone-400">
                {weekData.totalAdults + weekData.totalChildren} attending
              </span>
            }
          >
            <div className="space-y-4">
              {/* Attendance Stats */}
              <div className="flex items-center gap-6 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-2xl font-bold text-stone-900 dark:text-white">
                      {weekData.totalAdults + weekData.totalChildren}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {weekData.totalAdults} adults, {weekData.totalChildren} kids
                    </p>
                  </div>
                </div>
              </div>

              {/* Meal Info */}
              {weekData.meal ? (
                <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🍽️</span>
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
                      <Button size="sm" variant="secondary" onClick={() => setShowMealForm(true)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-600 p-4 text-center">
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

              {/* Who's Coming */}
              {weekData.rsvps.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Who&apos;s Coming:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weekData.rsvps.map((rsvp) => (
                      <Badge
                        key={rsvp.id}
                        variant={rsvp.familyId === family?.id ? 'success' : 'default'}
                      >
                        {rsvp.familyName} ({rsvp.adultCount + rsvp.childCount})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* RSVP Button */}
              {isAuthenticated && (
                <Button className="w-full min-h-[44px]" onClick={() => setShowRsvpForm(true)}>
                  {currentUserRsvp ? 'Update RSVP' : 'RSVP Now'}
                </Button>
              )}
            </div>
          </Collapsible>
        </Card>

        {/* Week Navigation Footer */}
        <nav className="flex justify-between gap-4 mt-6 pb-4" aria-label="Week navigation">
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
    </main>
  );
}
