import { NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth';

export async function GET() {
  const admin = getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    admin,
  });
}
