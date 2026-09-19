import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Member from '@/models/Member';
import { getAdminFromCookie } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (body.endDate && body.status !== 'suspended') {
      const now = new Date();
      const end = new Date(body.endDate);
      body.status = end < now ? 'expired' : 'active';
    }

    const member = await Member.findByIdAndUpdate(params.id, body, { new: true }).populate('planId');
    if (!member) {
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Member details updated successfully',
      member,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const member = await Member.findByIdAndDelete(params.id);
    if (!member) {
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Member archived/deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
