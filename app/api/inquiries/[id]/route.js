import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { getAdminFromCookie } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { status } = await req.json();

    if (!['new', 'contacted', 'resolved'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!inquiry) {
      return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      inquiry,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
