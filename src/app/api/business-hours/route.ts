import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all business hours and restaurant status
    const [businessHoursResult, restaurantStatusResult] = await Promise.all([
      supabase.from('business_hours').select('*').order('day_of_week'),
      supabase.from('restaurant_status').select('*').eq('id', 'singleton').single()
    ]);

    const businessHours = businessHoursResult.data || [];
    const restaurantStatus = restaurantStatusResult.data || {
      is_temporarily_closed: false,
      closure_reason: null,
      last_updated: null
    };

    return NextResponse.json({
      businessHours: businessHours.map(bh => ({
        dayOfWeek: bh.day_of_week,
        openTime: bh.open_time,
        closeTime: bh.close_time,
        isClosed: bh.is_closed,
        isHoliday: bh.is_holiday,
        holidayName: bh.holiday_name
      })),
      restaurantStatus: {
        isTemporarilyClosed: restaurantStatus.is_temporarily_closed,
        closureReason: restaurantStatus.closure_reason,
        lastUpdated: restaurantStatus.last_updated
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
      const { error } = await supabase
        .from('business_hours')
        .upsert({
          day_of_week: dayOfWeek,
          open_time: hours.openTime,
          close_time: hours.closeTime,
          is_closed: hours.isClosed || false,
          is_holiday: hours.isHoliday || false,
          holiday_name: hours.holidayName || null
        });
      
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'temporaryClosure' && temporaryClosure !== undefined) {
      const { error } = await supabase
        .from('restaurant_status')
        .upsert({
          id: 'singleton',
          is_temporarily_closed: temporaryClosure.isClosed,
          closure_reason: temporaryClosure.reason || null,
          last_updated: new Date().toISOString()
        });
      
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Error updating business hours:', error);
    return NextResponse.json({ error: 'Failed to update business hours' }, { status: 500 });
  }
}