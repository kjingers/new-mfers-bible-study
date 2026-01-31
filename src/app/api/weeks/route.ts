import { NextResponse } from 'next/server';
import { studies, weeks, meals, rsvps } from '@/lib/db/operations';
import type { WeekWithDetails } from '@/types';

export async function GET() {
  try {
    // Get the active study
    const activeStudy = await studies.getActive();

    if (!activeStudy) {
      return NextResponse.json({
        data: [],
        study: null,
        message: 'No active study found',
      });
    }

    // Get all weeks for this study
    const studyWeeks = await weeks.getByStudy(activeStudy.id);

    if (studyWeeks.length === 0) {
      return NextResponse.json({
        data: [],
        study: activeStudy,
        message: 'No weeks configured for this study',
      });
    }

    // Fetch meals and RSVPs for all weeks in parallel
    const weeksWithDetails: WeekWithDetails[] = await Promise.all(
      studyWeeks.map(async (week) => {
        const [weekMeal, weekRsvps] = await Promise.all([
          meals.getByWeek(week.id),
          rsvps.getByWeek(week.id),
        ]);

        const totalAdults = weekRsvps.reduce((sum, r) => sum + r.adultCount, 0);
        const totalChildren = weekRsvps.reduce((sum, r) => sum + r.childCount, 0);

        return {
          ...week,
          study: activeStudy,
          meal: weekMeal || undefined,
          rsvps: weekRsvps,
          totalAdults,
          totalChildren,
        };
      })
    );

    return NextResponse.json({
      data: weeksWithDetails,
      study: activeStudy,
    });
  } catch (error) {
    console.error('Error fetching weeks:', error);
    return NextResponse.json({ error: 'Failed to fetch weeks' }, { status: 500 });
  }
}
