import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Member from '@/models/Member';
import Plan from '@/models/Plan';
import Attendance from '@/models/Attendance';
import { getAdminFromCookie } from '@/lib/auth';
import { generateNextMemberId } from '@/lib/memberUtils';
import Papa from 'papaparse';

export async function POST(req) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { csvContent } = await req.json();

    if (!csvContent) {
      return NextResponse.json({ success: false, message: 'CSV text content is required' }, { status: 400 });
    }

    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid CSV format' }, { status: 400 });
    }

    // Default plan fallback
    const defaultPlan = await Plan.findOne({ isActive: true });
    if (!defaultPlan) {
      return NextResponse.json({ success: false, message: 'No active plan found to assign imported members' }, { status: 400 });
    }

    let createdCount = 0;

    for (const row of parsed.data) {
      const name = row.name || row.Name || row['Member Name'];
      const phone = row.phone || row.Phone || row['Phone Number'];
      const email = row.email || row.Email || '';
      const feePaid = Number(row.feePaidPKR || row.fee || row.Fee || defaultPlan.pricePKR);
      const method = row.paymentMethod || row.PaymentMethod || 'Cash';
      const providedMemberId = row.memberId || row['Member ID'] || '';

      if (name && phone) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + defaultPlan.durationMonths);

        const memberId = providedMemberId ? providedMemberId.trim().toUpperCase() : await generateNextMemberId();

        const newMember = await Member.create({
          memberId,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          planId: defaultPlan._id,
          startDate,
          endDate,
          status: 'active',
          feePaidPKR: feePaid,
          paymentMethod: ['Cash', 'JazzCash', 'EasyPaisa', 'Bank Transfer'].includes(method) ? method : 'Cash',
        });

        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdCount} members from CSV!`,
      createdCount,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
