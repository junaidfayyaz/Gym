import { NextResponse } from 'next/server';
import { removeAdminAuthCookie } from '@/lib/auth';

export async function POST() {
  removeAdminAuthCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
