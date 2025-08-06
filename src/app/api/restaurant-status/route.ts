import { NextResponse } from 'next/server';
import { getCurrentRestaurantStatus } from '@/lib/businessHours';

export async function GET() {
  try {
    const status = await getCurrentRestaurantStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching restaurant status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant status' }, 
      { status: 500 }
    );
  }
}