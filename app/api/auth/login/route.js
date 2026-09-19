import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { signToken, setAdminAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please enter email and password' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid admin credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = signToken({ id: admin._id, email: admin.email, role: 'admin' });
    
    // Set HTTP-only cookie
    setAdminAuthCookie(null, token);

    return NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      admin: { id: admin._id, email: admin.email, role: 'admin' },
      token,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
