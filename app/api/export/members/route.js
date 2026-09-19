import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Member from '@/models/Member';
import { getAdminFromCookie } from '@/lib/auth';
import Papa from 'papaparse';

export async function GET() {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const members = await Member.find().populate('planId').sort({ createdAt: -1 });

    const exportData = members.map((m) => ({
      'Member ID': m.memberId || m._id.toString(),
      Name: m.name,
      Phone: m.phone,
      Email: m.email,
      Plan: m.planId?.title || 'N/A',
      Status: m.status,
      'Fee Paid (PKR)': m.feePaidPKR,
      'Payment Method': m.paymentMethod,
      'Start Date': new Date(m.startDate).toISOString().split('T')[0],
      'Expiry Date': new Date(m.endDate).toISOString().split('T')[0],
    }));

    const csv = Papa.unparse(exportData);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="titanfit_members_export.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
