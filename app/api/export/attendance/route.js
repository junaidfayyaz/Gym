import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Attendance from '@/models/Attendance';
import { getAdminFromCookie } from '@/lib/auth';
import Papa from 'papaparse';

export async function GET() {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const logs = await Attendance.find().populate('memberId').sort({ date: -1 });

    const exportData = logs.map((log) => ({
      'Log ID': log._id.toString(),
      'Member ID': log.memberId?.memberId || 'N/A',
      'Member Name': log.memberId?.name || 'Unknown',
      Phone: log.memberId?.phone || 'N/A',
      Email: log.memberId?.email || 'N/A',
      'Check-in Date': new Date(log.date).toISOString().split('T')[0],
      'Check-in Time': log.checkInTime,
      'Attendance Type': log.type || 'On-site / Physical',
      'Verification Status': log.status || 'Verified Present',
    }));

    const csv = Papa.unparse(exportData);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="titanfit_attendance_export.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
