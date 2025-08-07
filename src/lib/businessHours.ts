import { supabase } from '@/lib/supabase';

export interface BusinessHours {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  isHoliday: boolean;
  holidayName: string | null;
}

export interface RestaurantStatus {
  isOpen: boolean;
  isTemporarilyClosed: boolean;
  closureReason: string | null;
  currentTime: string;
  nextOpenTime: string | null;
}

export async function getCurrentRestaurantStatus(): Promise<RestaurantStatus> {
  try {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format
    
    // Get restaurant status and business hours
    const [statusResult, businessHoursResult] = await Promise.all([
      supabase.from('restaurant_status').select('*').eq('id', 'singleton').single(),
      supabase.from('business_hours').select('*').eq('day_of_week', currentDay).single()
    ]);
    
    const status = statusResult.data;
    const businessHours = businessHoursResult.data;
    
    // Check if temporarily closed by admin
    if (status?.is_temporarily_closed) {
      return {
        isOpen: false,
        isTemporarilyClosed: true,
        closureReason: status.closure_reason || 'Temporarily closed',
        currentTime,
        nextOpenTime: await getNextOpenTime()
      };
    }
    
    // Check if closed for the day or holiday
    if (!businessHours || businessHours.is_closed || businessHours.is_holiday) {
      const reason = businessHours?.is_holiday 
        ? `Closed for ${businessHours.holiday_name || 'holiday'}`
        : 'Closed today';
        
      return {
        isOpen: false,
        isTemporarilyClosed: false,
        closureReason: reason,
        currentTime,
        nextOpenTime: await getNextOpenTime()
      };
    }
    
    // Check if within business hours
    const isWithinHours = businessHours.open_time && businessHours.close_time &&
      currentTime >= businessHours.open_time && currentTime <= businessHours.close_time;
    
    return {
      isOpen: Boolean(isWithinHours),
      isTemporarilyClosed: false,
      closureReason: isWithinHours ? null : 'Currently closed',
      currentTime,
      nextOpenTime: isWithinHours ? null : await getNextOpenTime()
    };
    
  } catch (error) {
    console.error('Error getting restaurant status:', error);
    return {
      isOpen: false,
      isTemporarilyClosed: false,
      closureReason: 'Unable to determine status',
      currentTime: new Date().toTimeString().slice(0, 5),
      nextOpenTime: null
    };
  }
}

async function getNextOpenTime(): Promise<string | null> {
  try {
    const now = new Date();
    const currentDay = now.getDay();
    
    // Look for next opening time in the next 7 days
    for (let i = 0; i < 7; i++) {
      const checkDay = (currentDay + i) % 7;
      const { data: businessHours } = await supabase
        .from('business_hours')
        .select('*')
        .eq('day_of_week', checkDay)
        .single();
      
      if (businessHours && !businessHours.is_closed && !businessHours.is_holiday && businessHours.open_time) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[checkDay];
        
        if (i === 0) {
          // Same day - check if opening time is in the future
          const currentTime = now.toTimeString().slice(0, 5);
          if (businessHours.open_time > currentTime) {
            return `Today at ${businessHours.open_time}`;
          }
        } else if (i === 1) {
          return `Tomorrow at ${businessHours.open_time}`;
        } else {
          return `${dayName} at ${businessHours.open_time}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting next open time:', error);
    return null;
  }
}