import { prisma } from '@/lib/prisma';

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

const DEFAULT_HOURS: BusinessHours[] = [
  { dayOfWeek: 0, openTime: "16:00", closeTime: "20:30", isClosed: false, isHoliday: false, holidayName: null }, // Sunday
  { dayOfWeek: 1, openTime: "11:30", closeTime: "20:30", isClosed: false, isHoliday: false, holidayName: null }, // Monday
  { dayOfWeek: 2, openTime: "11:30", closeTime: "20:30", isClosed: false, isHoliday: false, holidayName: null }, // Tuesday
  { dayOfWeek: 3, openTime: "11:30", closeTime: "20:30", isClosed: false, isHoliday: false, holidayName: null }, // Wednesday
  { dayOfWeek: 4, openTime: "11:30", closeTime: "20:30", isClosed: false, isHoliday: false, holidayName: null }, // Thursday
  { dayOfWeek: 5, openTime: "11:30", closeTime: "20:30", isClosed: false, isHoliday: false, holidayName: null }, // Friday
  { dayOfWeek: 6, openTime: "11:30", closeTime: "21:00", isClosed: false, isHoliday: false, holidayName: null }, // Saturday
];

export async function initializeBusinessHours() {
  try {
    const existingHours = await prisma.businessHours.findMany();
    
    if (existingHours.length === 0) {
      // Initialize with default hours
      await prisma.businessHours.createMany({
        data: DEFAULT_HOURS
      });
    }
    
    // Initialize restaurant status if not exists
    const existingStatus = await prisma.restaurantStatus.findFirst();
    if (!existingStatus) {
      await prisma.restaurantStatus.create({
        data: {
          id: 'singleton',
          isOpen: true,
          isTemporarilyClosed: false,
        }
      });
    }
    
  } catch (error) {
    console.error('Error initializing business hours:', error);
  }
}

export async function getCurrentRestaurantStatus(): Promise<RestaurantStatus> {
  try {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format
    
    // Get restaurant status and business hours
    const [status, businessHours] = await Promise.all([
      prisma.restaurantStatus.findFirst(),
      prisma.businessHours.findUnique({ where: { dayOfWeek: currentDay } })
    ]);
    
    // Check if temporarily closed by admin
    if (status?.isTemporarilyClosed) {
      return {
        isOpen: false,
        isTemporarilyClosed: true,
        closureReason: status.closureReason || 'Temporarily closed',
        currentTime,
        nextOpenTime: await getNextOpenTime()
      };
    }
    
    // Check if closed for the day or holiday
    if (!businessHours || businessHours.isClosed || businessHours.isHoliday) {
      const reason = businessHours?.isHoliday 
        ? `Closed for ${businessHours.holidayName || 'holiday'}`
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
    const isWithinHours = businessHours.openTime && businessHours.closeTime &&
      currentTime >= businessHours.openTime && currentTime <= businessHours.closeTime;
    
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
      const businessHours = await prisma.businessHours.findUnique({ 
        where: { dayOfWeek: checkDay } 
      });
      
      if (businessHours && !businessHours.isClosed && !businessHours.isHoliday && businessHours.openTime) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[checkDay];
        
        if (i === 0) {
          // Same day - check if opening time is in the future
          const currentTime = now.toTimeString().slice(0, 5);
          if (businessHours.openTime > currentTime) {
            return `Today at ${businessHours.openTime}`;
          }
        } else if (i === 1) {
          return `Tomorrow at ${businessHours.openTime}`;
        } else {
          return `${dayName} at ${businessHours.openTime}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting next open time:', error);
    return null;
  }
}

export async function updateBusinessHours(dayOfWeek: number, hours: Partial<BusinessHours>) {
  try {
    await prisma.businessHours.upsert({
      where: { dayOfWeek },
      create: { dayOfWeek, ...hours },
      update: hours
    });
  } catch (error) {
    console.error('Error updating business hours:', error);
    throw error;
  }
}

export async function setTemporaryClosure(isClosed: boolean, reason?: string) {
  try {
    await prisma.restaurantStatus.upsert({
      where: { id: 'singleton' },
      create: {
        id: 'singleton',
        isTemporarilyClosed: isClosed,
        closureReason: reason || null,
        lastUpdated: new Date()
      },
      update: {
        isTemporarilyClosed: isClosed,
        closureReason: reason || null,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error setting temporary closure:', error);
    throw error;
  }
}

export async function getAllBusinessHours(): Promise<BusinessHours[]> {
  try {
    const hours = await prisma.businessHours.findMany({
      orderBy: { dayOfWeek: 'asc' }
    });
    
    return hours.map(h => ({
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isClosed: h.isClosed,
      isHoliday: h.isHoliday,
      holidayName: h.holidayName
    }));
  } catch (error) {
    console.error('Error getting business hours:', error);
    return [];
  }
}