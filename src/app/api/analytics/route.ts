import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);
    
    // Use the PostgreSQL function for analytics (much faster!)
    const { data, error } = await supabase
      .rpc('get_analytics_data', { days_back: days });

    if (error) {
      console.error('Analytics query error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}