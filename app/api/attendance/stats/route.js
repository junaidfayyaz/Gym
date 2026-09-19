import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Attendance from '@/models/Attendance';
import Member from '@/models/Member';
import { getAdminFromCookie } from '@/lib/auth';

function getLocalDateString(dateObj = new Date()) {
  const d = new Date(dateObj);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function GET(req) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const memberId = searchParams.get('memberId');
    const range = searchParams.get('range') || 'this_month';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    if (!memberId) {
      return NextResponse.json({ success: false, message: 'Member ID is required' }, { status: 400 });
    }

    const member = await Member.findById(memberId).populate('planId');
    if (!member) {
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    const now = new Date();
    const todayLocalStr = getLocalDateString(now);

    let startLocalStr = todayLocalStr;
    let endLocalStr = todayLocalStr;

    if (range === 'this_month') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      startLocalStr = `${y}-${m}-01`;
      endLocalStr = todayLocalStr;
    } else if (range === 'last_30_days') {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      startLocalStr = getLocalDateString(past);
      endLocalStr = todayLocalStr;
    } else if (range === 'custom') {
      if (startDateParam) startLocalStr = startDateParam;
      if (endDateParam) endLocalStr = endDateParam;
    }

    const start = new Date(`${startLocalStr}T00:00:00`);
    const end = new Date(`${endLocalStr}T23:59:59.999`);

    // Fetch existing attendance logs in date range for this member
    const logs = await Attendance.find({
      memberId: member._id,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    // Map logs by local date string (YYYY-MM-DD)
    const logsByDate = {};
    logs.forEach((log) => {
      const dateKey = getLocalDateString(log.date);
      logsByDate[dateKey] = log;
    });

    // Calculate daily history timeline
    const history = [];
    let curr = new Date(start);
    curr.setHours(12, 0, 0, 0); // set to mid-day to prevent DST shifts

    const limitDate = new Date(end);
    limitDate.setHours(23, 59, 59, 999);

    let totalDays = 0;
    let totalPresent = 0;
    let totalAbsent = 0;

    while (curr <= limitDate) {
      totalDays++;
      const dateKey = getLocalDateString(curr);
      const existingLog = logsByDate[dateKey];

      if (existingLog && existingLog.status !== 'Excused / Absent') {
        totalPresent++;
        history.push({
          date: dateKey,
          displayDate: curr.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
          status: existingLog.status || 'Verified Present',
          type: existingLog.type || 'On-site / Physical',
          checkInTime: existingLog.checkInTime || 'Checked in',
          isPresent: true,
        });
      } else {
        totalAbsent++;
        history.push({
          date: dateKey,
          displayDate: curr.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
          status: existingLog ? existingLog.status : 'Absent / Not Logged',
          type: existingLog ? existingLog.type : 'N/A',
          checkInTime: '-',
          isPresent: false,
        });
      }

      curr.setDate(curr.getDate() + 1);
    }

    // Reverse history to show newest date first
    history.reverse();

    const attendanceRate = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

    return NextResponse.json({
      success: true,
      member: {
        _id: member._id,
        memberId: member.memberId,
        avatar: member.avatar,
        name: member.name,
        phone: member.phone,
        email: member.email,
        planTitle: member.planId?.title || 'Pass',
      },
      stats: {
        range,
        startDate: startLocalStr,
        endDate: endLocalStr,
        totalDays,
        totalPresent,
        totalAbsent,
        attendanceRate,
      },
      history,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
