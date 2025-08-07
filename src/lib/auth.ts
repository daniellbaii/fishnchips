import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Hash the admin password for comparison
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

export interface AdminUser {
  id: string;
  role: 'admin';
  loginTime: number;
}

export async function validateAdminPassword(password: string): Promise<boolean> {
  try {
    const result = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    return result;
  } catch (error) {
    console.error('Password validation error:', error);
    return false;
  }
}

// Simple token generation using base64 encoding (Edge Runtime compatible)
export function generateAdminToken(): string {
  const payload: AdminUser = {
    id: 'admin',
    role: 'admin',
    loginTime: Date.now(),
  };
  
  const tokenData = JSON.stringify(payload);
  const signature = btoa(tokenData + TOKEN_SECRET).slice(0, 32); // Simple signature
  const token = btoa(tokenData) + '.' + signature;
  
  return token;
}

// Simple token verification (Edge Runtime compatible)
export function verifyAdminToken(token: string): AdminUser | null {
  try {
    if (!token || !token.includes('.')) {
      return null;
    }
    
    const [encodedPayload, signature] = token.split('.');
    
    // Verify signature
    const decodedPayload = atob(encodedPayload);
    const expectedSignature = btoa(decodedPayload + TOKEN_SECRET).slice(0, 32);
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload: AdminUser = JSON.parse(decodedPayload);
    
    // Check if token is older than 2 hours
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    if (payload.loginTime < twoHoursAgo) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/',
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
}

export async function getAdminFromCookies(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }
    
    return verifyAdminToken(token);
  } catch (error) {
    console.error('Cookie verification error:', error);
    return null;
  }
}