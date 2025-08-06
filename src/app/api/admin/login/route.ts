import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken } from '@/lib/auth';

// Rate limiting store (in production, use Redis or database)
const loginAttempts: { [key: string]: { count: number; lastAttempt: number } } = {};

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts[key];
  
  if (!attempts) {
    return false;
  }
  
  // Reset attempts after 15 minutes
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    delete loginAttempts[key];
    return false;
  }
  
  // Allow max 5 attempts per 15 minutes
  return attempts.count >= 5;
}

function recordLoginAttempt(key: string, success: boolean) {
  const now = Date.now();
  
  if (success) {
    // Clear attempts on successful login
    delete loginAttempts[key];
    return;
  }
  
  if (!loginAttempts[key]) {
    loginAttempts[key] = { count: 0, lastAttempt: now };
  }
  
  loginAttempts[key].count++;
  loginAttempts[key].lastAttempt = now;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request);
    
    // Check rate limiting
    if (isRateLimited(rateLimitKey)) {
      recordLoginAttempt(rateLimitKey, false);
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }
    
    const { password } = await request.json();
    
    if (!password) {
      recordLoginAttempt(rateLimitKey, false);
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }
    
    // Validate admin password
    const isValid = await validateAdminPassword(password);
    
    if (!isValid) {
      recordLoginAttempt(rateLimitKey, false);
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateAdminToken();
    
    // Create response with success
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );
    
    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    });
    
    recordLoginAttempt(rateLimitKey, true);
    
    return response;
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}