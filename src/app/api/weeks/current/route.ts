import { NextResponse } from 'next/server';
import { studies, weeks, meals, rsvps } from '@/lib/db/operations';
import type { WeekWithDetails } from '@/types';
import { getNextTuesday, toISODateString, isSameDay, parseISODate } from '@/lib/utils';

export async function GET() {
  try {
    // Get the active study
    const activeStudy = await studies.getActive();

    if (!activeStudy) {
      return NextResponse.json({
        data: null,
        message: 'No active study found',
      });
    }

    // Get all weeks for this study
    const studyWeeks = await weeks.getByStudy(activeStudy.id);

    if (studyWeeks.length === 0) {
      return NextResponse.json({
        data: null,
        study: activeStudy,
        message: 'No weeks configured for this study',
      });
    }

    // Find the current or upcoming week
    const today = new Date();
    const nextTuesday = getNextTuesday();
    const nextTuesdayStr = toISODateString(nextTuesday);

    // Find the week that matches the next Tuesday, or the closest upcoming week
    let currentWeek = studyWeeks.find((w) => w.date === nextTuesdayStr);

    if (!currentWeek) {
      // Find the next upcoming week
      currentWeek = studyWeeks.find((w) => {
        const weekDate = parseISODate(w.date);
        return weekDate >= today;
      });
    }

    if (!currentWeek) {
      // All weeks are in the past, return the last week
      currentWeek = studyWeeks[studyWeeks.length - 1];
    }

    // Get meal and RSVPs for this week
    const [weekMeal, weekRsvps] = await Promise.all([
      meals.getByWeek(currentWeek.id),
      rsvps.getByWeek(currentWeek.id),
    ]);

    // Calculate totals
    const totalAdults = weekRsvps.reduce((sum, r) => sum + r.adultCount, 0);
    const totalChildren = weekRsvps.reduce((sum, r) => sum + r.childCount, 0);

    // Check if this is the current week (next Tuesday)
    const isCurrentWeek = isSameDay(parseISODate(currentWeek.date), nextTuesday);

    // Build the response
    const weekWithDetails: WeekWithDetails = {
      ...currentWeek,
      study: activeStudy,
      meal: weekMeal || undefined,
      rsvps: weekRsvps,
      totalAdults,
      totalChildren,
    };

    return NextResponse.json({
      data: weekWithDetails,
      isCurrentWeek,
    });
  } catch (error) {
    console.error('Error fetching current week:', error);
    return NextResponse.json({ error: 'Failed to fetch current week' }, { status: 500 });
  }
}
