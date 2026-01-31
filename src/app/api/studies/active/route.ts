import { NextResponse } from 'next/server';
import { studies } from '@/lib/db/operations';

export async function GET() {
  try {
    const activeStudy = await studies.getActive();

    if (!activeStudy) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: activeStudy });
  } catch (error) {
    console.error('Error fetching active study:', error);
    return NextResponse.json({ error: 'Failed to fetch active study' }, { status: 500 });
  }
}
