import { NextRequest, NextResponse } from 'next/server';
import { getAllBusinessHours, updateBusinessHours, setTemporaryClosure, initializeBusinessHours } from '@/lib/businessHours';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Initialize business hours if not exists
    await initializeBusinessHours();
    
    // Get all business hours and restaurant status
    const [businessHours, restaurantStatus] = await Promise.all([
      getAllBusinessHours(),
      prisma.restaurantStatus.findFirst()
    ]);

    return NextResponse.json({
      businessHours,
      restaurantStatus: restaurantStatus || {
        isTemporarilyClosed: false,
        closureReason: null,
        lastUpdated: null
      }
    });
  } catch (error) {
    console.error('Error fetching business hours:', error);
    return NextResponse.json({ error: 'Failed to fetch business hours' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, dayOfWeek, hours, temporaryClosure } = body;

    if (action === 'updateHours' && typeof dayOfWeek === 'number' && hours) {
      await updateBusinessHours(dayOfWeek, hours);
      return NextResponse.json({ success: true });
    }

    if (action === 'temporaryClosure' && temporaryClosure !== undefined) {
      await setTemporaryClosure(
        temporaryClosure.isClosed, 
        temporaryClosure.reason
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error updating business hours:', error);
    return NextResponse.json({ error: 'Failed to update business hours' }, { status: 500 });
  }
}