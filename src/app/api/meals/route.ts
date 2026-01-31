import { NextRequest, NextResponse } from 'next/server';
import { meals } from '@/lib/db/operations';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

// Create or update meal signup
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
    const { weekId, description } = body;

    if (!weekId) {
      return NextResponse.json({ error: 'Week ID is required' }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'Meal description is required' }, { status: 400 });
    }

    // Check if a meal already exists for this week
    const existingMeal = await meals.getByWeek(weekId);

    if (existingMeal) {
      // Only the family that signed up can update
      if (existingMeal.familyId !== payload.familyId) {
        return NextResponse.json(
          { error: "Another family has already signed up for this week's meal" },
          { status: 409 }
        );
      }

      // Update existing meal
      const updatedMeal = await meals.update(existingMeal.id, weekId, {
        description: description.trim(),
      });

      return NextResponse.json({
        data: updatedMeal,
        message: 'Meal signup updated successfully',
      });
    } else {
      // Create new meal signup
      const newMeal = await meals.create({
        weekId,
        familyId: payload.familyId,
        familyName: payload.familyName,
        description: description.trim(),
      });

      return NextResponse.json(
        {
          data: newMeal,
          message: 'Meal signup created successfully',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating/updating meal signup:', error);
    return NextResponse.json({ error: 'Failed to save meal signup' }, { status: 500 });
  }
}

// Delete meal signup
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

    // Find the meal for this week
    const existingMeal = await meals.getByWeek(weekId);

    if (!existingMeal) {
      return NextResponse.json({ error: 'Meal signup not found' }, { status: 404 });
    }

    // Only the family that signed up can delete (or admin)
    if (existingMeal.familyId !== payload.familyId && !payload.isAdmin) {
      return NextResponse.json(
        { error: 'You can only cancel your own meal signup' },
        { status: 403 }
      );
    }

    // Delete the meal signup
    await meals.delete(existingMeal.id, weekId);

    return NextResponse.json({
      message: 'Meal signup cancelled successfully',
    });
  } catch (error) {
    console.error('Error deleting meal signup:', error);
    return NextResponse.json({ error: 'Failed to cancel meal signup' }, { status: 500 });
  }
}
