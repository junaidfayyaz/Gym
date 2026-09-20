import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Member from '@/models/Member';
import Plan from '@/models/Plan';
import Attendance from '@/models/Attendance';
import { getAdminFromCookie } from '@/lib/auth';
import { generateNextMemberId, syncMemberStatuses } from '@/lib/memberUtils';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    await syncMemberStatuses();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const planId = searchParams.get('planId') || '';

    let filter = {};

    if (status) filter.status = status;
    if (planId) filter.planId = planId;
    if (search) {
      filter.$or = [
        { memberId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await Member.find(filter).populate('planId').sort({ createdAt: -1 });

    // Sanitize any legacy uncompressed >50KB avatars to prevent network payload bloat
    const sanitizedMembers = members.map((m) => {
      const obj = m.toObject();
      if (obj.avatar && obj.avatar.length > 50000) {
        obj.avatar = ''; // Strip 24MB legacy string payload
      }
      return obj;
    });

    return NextResponse.json({
      success: true,
      count: sanitizedMembers.length,
      members: sanitizedMembers,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const { name, phone, email, planId, startDate, endDate, feePaidPKR, paymentMethod, avatar } = body;

    if (!name || !phone || !planId || !feePaidPKR) {
      return NextResponse.json(
        { success: false, message: 'Name, Pakistani phone number, plan, and fee in PKR are required' },
        { status: 400 }
      );
    }

    const selectedPlan = await Plan.findById(planId);
    if (!selectedPlan) {
      return NextResponse.json({ success: false, message: 'Invalid membership plan selected' }, { status: 404 });
    }

    const start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date(start);
    if (!endDate) {
      end.setMonth(start.getMonth() + (selectedPlan.durationMonths || 1));
    }

    const generatedMemberId = await generateNextMemberId();
    const now = new Date();
    const initialStatus = end < now ? 'expired' : 'active';

    const member = await Member.create({
      memberId: generatedMemberId,
      avatar: avatar || '',
      name,
      phone,
      email: email ? email.toLowerCase() : '',
      planId: selectedPlan._id,
      startDate: start,
      endDate: end,
      status: initialStatus,
      feePaidPKR: Number(feePaidPKR),
      paymentMethod: paymentMethod || 'Cash',
    });

    const populatedMember = await Member.findById(member._id).populate('planId');

    return NextResponse.json(
      {
        success: true,
        message: `Member ${member.name} (${generatedMemberId}) enrolled successfully! Fee received: Rs. ${member.feePaidPKR}`,
        member: populatedMember,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
