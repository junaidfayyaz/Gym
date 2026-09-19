import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Member from '@/models/Member';
import Attendance from '@/models/Attendance';
import { getAdminFromCookie } from '@/lib/auth';
import { syncMemberStatuses } from '@/lib/memberUtils';

export async function GET() {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    await syncMemberStatuses();

    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'active' });
    const expiredMembers = await Member.countDocuments({ status: 'expired' });

    // Today's Footfall
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayFootfall = await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Monthly PKR Revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const members = await Member.find();
    const monthlyRevenuePKR = members
      .filter((m) => new Date(m.createdAt) >= startOfMonth)
      .reduce((sum, m) => sum + (m.feePaidPKR || 0), 0);

    const totalRevenuePKR = members.reduce((sum, m) => sum + (m.feePaidPKR || 0), 0);

    // Monthly Revenue Graph Data (Past 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueChart = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();

      const mStart = new Date(year, month, 1);
      const mEnd = new Date(year, month + 1, 0, 23, 59, 59);

      const monthFee = members
        .filter((m) => {
          const created = new Date(m.createdAt);
          return created >= mStart && created <= mEnd;
        })
        .reduce((sum, m) => sum + (m.feePaidPKR || 0), 0);

      revenueChart.push({
        month: monthNames[month],
        revenuePKR: monthFee,
      });
    }

    return NextResponse.json({
      success: true,
      kpis: {
        totalMembers,
        activeMembers,
        expiredMembers,
        todayFootfall,
        monthlyRevenuePKR,
        totalRevenuePKR,
      },
      revenueChart,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
