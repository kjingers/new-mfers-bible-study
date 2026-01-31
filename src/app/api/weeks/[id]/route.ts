import { NextRequest, NextResponse } from 'next/server';
import { studies, weeks, meals, rsvps, sessions } from '@/lib/db/operations';
import type { WeekWithDetails, Week } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get the active study
    const activeStudy = await studies.getActive();

    if (!activeStudy) {
      return NextResponse.json({ error: 'No active study found' }, { status: 404 });
    }

    // Get all weeks for this study to find the requested one and adjacent weeks
    const studyWeeks = await weeks.getByStudy(activeStudy.id);
    const weekIndex = studyWeeks.findIndex((w) => w.id === id);

    if (weekIndex === -1) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 });
    }

    const week = studyWeeks[weekIndex];

    // Get adjacent weeks for navigation
    const prevWeek: Week | null = weekIndex > 0 ? studyWeeks[weekIndex - 1] : null;
    const nextWeek: Week | null =
      weekIndex < studyWeeks.length - 1 ? studyWeeks[weekIndex + 1] : null;

    // Get meal, RSVPs, and live session for this week
    const [weekMeal, weekRsvps, liveSession] = await Promise.all([
      meals.getByWeek(week.id),
      rsvps.getByWeek(week.id),
      sessions.getActiveByWeek(week.id),
    ]);

    // Calculate totals
    const totalAdults = weekRsvps.reduce((sum, r) => sum + r.adultCount, 0);
    const totalChildren = weekRsvps.reduce((sum, r) => sum + r.childCount, 0);

    // Build the response
    const weekWithDetails: WeekWithDetails = {
      ...week,
      study: activeStudy,
      meal: weekMeal || undefined,
      rsvps: weekRsvps,
      totalAdults,
      totalChildren,
      liveSession: liveSession || undefined,
    };

    return NextResponse.json({
      data: weekWithDetails,
      prevWeek: prevWeek ? { id: prevWeek.id, weekNumber: prevWeek.weekNumber } : null,
      nextWeek: nextWeek ? { id: nextWeek.id, weekNumber: nextWeek.weekNumber } : null,
    });
  } catch (error) {
    console.error('Error fetching week:', error);
    return NextResponse.json({ error: 'Failed to fetch week' }, { status: 500 });
  }
}
