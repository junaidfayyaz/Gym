import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Attendance from '@/models/Attendance';
import Member from '@/models/Member';
import { getAdminFromCookie } from '@/lib/auth';
import { syncMemberStatuses } from '@/lib/memberUtils';

function getLocalDateString(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function GET(req) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    await syncMemberStatuses();
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    const search = searchParams.get('search') || '';
    const statusParam = searchParams.get('status') || '';

    // Calculate today's local date string
    const todayStr = getLocalDateString(new Date());
    const targetDateStr = dateStr && dateStr.trim() ? dateStr.trim() : todayStr;
    const isToday = targetDateStr === todayStr;

    // Build target date bounds in local time
    const start = new Date(`${targetDateStr}T00:00:00`);
    const end = new Date(`${targetDateStr}T23:59:59.999`);

    // Fetch existing attendance logs for the target date
    const logs = await Attendance.find({ date: { $gte: start, $lte: end } }).populate('memberId');

    // Map logs by member ObjectId
    const loggedMemberMap = new Map();
    logs.forEach((log) => {
      if (log.memberId && log.memberId._id) {
        loggedMemberMap.set(log.memberId._id.toString(), log);
      }
    });

    // Fetch all active members
    const allMembers = await Member.find().populate('planId').sort({ createdAt: -1 });

    // Combine logged records + unmarked active members
    let combinedLogs = [];

    allMembers.forEach((m) => {
      const existingLog = loggedMemberMap.get(m._id.toString());
      if (existingLog) {
        combinedLogs.push({
          ...existingLog.toObject(),
          isLogged: true,
        });
      } else {
        combinedLogs.push({
          _id: `unmarked_${m._id}`,
          memberId: m,
          date: start,
          checkInTime: '-',
          type: 'N/A',
          status: 'Not Checked In',
          isLogged: false,
        });
      }
    });

    // Filter by Verification Status if specified
    if (statusParam) {
      combinedLogs = combinedLogs.filter((log) => log.status === statusParam);
    }

    // Filter by search query
    if (search) {
      const s = search.toLowerCase();
      combinedLogs = combinedLogs.filter((log) => {
        const m = log.memberId;
        if (!m) return false;
        return (
          (m.memberId && m.memberId.toLowerCase().includes(s)) ||
          (m.name && m.name.toLowerCase().includes(s)) ||
          (m.phone && m.phone.toLowerCase().includes(s)) ||
          (log.type && log.type.toLowerCase().includes(s)) ||
          (log.status && log.status.toLowerCase().includes(s))
        );
      });
    }

    return NextResponse.json({
      success: true,
      count: combinedLogs.length,
      isToday,
      targetDate: targetDateStr,
      logs: combinedLogs,
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
    const { memberQuery, type } = await req.json();

    if (!memberQuery) {
      return NextResponse.json({ success: false, message: 'Member ID or phone number required' }, { status: 400 });
    }

    const q = memberQuery.trim();
    let member = await Member.findOne({
      $or: [{ memberId: q.toUpperCase() }, { phone: q }, { memberId: { $regex: q, $options: 'i' } }],
    });

    if (!member) {
      try {
        member = await Member.findById(q);
      } catch (e) {
        member = null;
      }
    }

    if (!member) {
      return NextResponse.json({ success: false, message: 'Member not found with provided ID or phone' }, { status: 404 });
    }

    if (member.status === 'suspended') {
      return NextResponse.json(
        { success: false, message: `Check-in denied: ${member.name} is currently SUSPENDED.` },
        { status: 403 }
      );
    }

    const todayLocalStr = getLocalDateString(new Date());
    const startOfDay = new Date(`${todayLocalStr}T00:00:00`);
    const endOfDay = new Date(`${todayLocalStr}T23:59:59.999`);

    const existingLog = await Attendance.findOne({
      memberId: member._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingLog) {
      return NextResponse.json({
        success: false,
        message: `${member.name} (${member.memberId || 'N/A'}) already checked in today at ${existingLog.checkInTime}`,
        member,
      });
    }

    const checkInTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const attendance = await Attendance.create({
      memberId: member._id,
      date: new Date(),
      checkInTime,
      type: type || 'On-site / Physical',
      status: 'Verified Present',
    });

    const populatedLog = await Attendance.findById(attendance._id).populate('memberId');

    return NextResponse.json(
      {
        success: true,
        message: `Attendance marked present for ${member.name} (${member.memberId || 'N/A'}) at ${checkInTime}!`,
        attendance: populatedLog,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { id, type, status } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Attendance record ID required' }, { status: 400 });
    }

    const updateFields = {};
    if (type) updateFields.type = type;
    if (status) updateFields.status = status;

    const updatedLog = await Attendance.findByIdAndUpdate(id, updateFields, { new: true }).populate('memberId');

    if (!updatedLog) {
      return NextResponse.json({ success: false, message: 'Attendance record not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Attendance type updated to "${updatedLog.type}" (${updatedLog.status})`,
      log: updatedLog,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
