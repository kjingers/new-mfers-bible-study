import { NextRequest, NextResponse } from 'next/server';
import { rsvps } from '@/lib/db/operations';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

// Create or update RSVP
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { weekId, adultCount, childCount, notes } = body;

    if (!weekId) {
      return NextResponse.json({ error: 'Week ID is required' }, { status: 400 });
    }

    if (typeof adultCount !== 'number' || adultCount < 0) {
      return NextResponse.json(
        { error: 'Adult count must be a non-negative number' },
        { status: 400 }
      );
    }

    if (typeof childCount !== 'number' || childCount < 0) {
      return NextResponse.json(
        { error: 'Child count must be a non-negative number' },
        { status: 400 }
      );
    }

    // Check if RSVP already exists for this family/week
    const existingRsvp = await rsvps.getByFamilyAndWeek(payload.familyId, weekId);

    if (existingRsvp) {
      // Update existing RSVP
      const updatedRsvp = await rsvps.update(existingRsvp.id, weekId, {
        adultCount,
        childCount,
        notes: notes || undefined,
      });

      return NextResponse.json({
        data: updatedRsvp,
        message: 'RSVP updated successfully',
      });
    } else {
      // Create new RSVP
      const newRsvp = await rsvps.create({
        weekId,
        familyId: payload.familyId,
        familyName: payload.familyName,
        adultCount,
        childCount,
        notes: notes || undefined,
      });

      return NextResponse.json(
        {
          data: newRsvp,
          message: 'RSVP created successfully',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating/updating RSVP:', error);
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
  }
}

// Delete RSVP
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekId = searchParams.get('weekId');

    if (!weekId) {
      return NextResponse.json({ error: 'Week ID is required' }, { status: 400 });
    }

    // Find the RSVP for this family/week
    const existingRsvp = await rsvps.getByFamilyAndWeek(payload.familyId, weekId);

    if (!existingRsvp) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }

    // Delete the RSVP
    await rsvps.delete(existingRsvp.id, weekId);

    return NextResponse.json({
      message: 'RSVP deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json({ error: 'Failed to delete RSVP' }, { status: 500 });
  }
}
