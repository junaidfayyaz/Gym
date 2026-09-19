import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import Member from '../models/Member';
import Plan from '../models/Plan';
import Attendance from '../models/Attendance';
import Inquiry from '../models/Inquiry';

export default async function seedHelper() {
  console.log('🧹 Clearing existing collections...');
  await Admin.deleteMany({});
  await Member.deleteMany({});
  await Plan.deleteMany({});
  await Attendance.deleteMany({});
  await Inquiry.deleteMany({});

  console.log('🔑 Creating Admin account...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  await Admin.create({
    email: 'admin@gym.com',
    passwordHash,
    role: 'admin',
  });

  console.log('💳 Creating PKR Membership Plans...');
  const monthlyPlan = await Plan.create({
    title: 'Monthly Access Pass',
    durationMonths: 1,
    pricePKR: 3500,
    features: ['Full Gym Floor & Cardio Zone', 'Standard Locker Room Access', 'Trainer Guidance'],
    isActive: true,
  });

  const quarterlyPlan = await Plan.create({
    title: 'Executive Quarterly Split',
    durationMonths: 3,
    pricePKR: 9000,
    features: [
      'Unlimited Gym & Cardio Access',
      'Free Customized Diet & Workout Plan',
      'Group Fitness Classes Included',
      'Sauna & Steam Bath (1x/week)',
    ],
    isActive: true,
  });

  const annualPlan = await Plan.create({
    title: 'VIP Annual Championship',
    durationMonths: 12,
    pricePKR: 30000,
    features: [
      'All Executive Benefits Included',
      '1-on-1 Personal Master Trainer',
      'Free Locker & Towel Service',
      'Monthly Guest Pass (2 Guests)',
      'Free Hydration & Protein Shakes',
    ],
    isActive: true,
  });

  console.log('👤 Creating Demo Pakistani Members...');
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + 3);

  const member1 = await Member.create({
    memberId: 'WS-7001',
    name: 'Muhammad Ali',
    phone: '0300-1234567',
    email: 'ali.khan@example.com',
    planId: quarterlyPlan._id,
    startDate,
    endDate,
    status: 'active',
    feePaidPKR: 9000,
    paymentMethod: 'JazzCash',
  });

  const member2 = await Member.create({
    memberId: 'WS-7002',
    name: 'Usman Tariq',
    phone: '0321-7654321',
    email: 'usman.tariq@example.com',
    planId: monthlyPlan._id,
    startDate,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    feePaidPKR: 3500,
    paymentMethod: 'EasyPaisa',
  });

  console.log('⏱️ Logging Sample Attendance...');
  await Attendance.create({
    memberId: member1._id,
    date: new Date(),
    checkInTime: '07:45 AM',
    type: 'On-site / Physical',
    status: 'Verified Present',
  });

  await Attendance.create({
    memberId: member2._id,
    date: new Date(),
    checkInTime: '06:15 PM',
    type: 'On-site / Physical',
    status: 'Verified Present',
  });

  console.log('📩 Creating Lead Inquiries...');
  await Inquiry.create([
    {
      name: 'Hamza Sheikh',
      phone: '0333-5551234',
      email: 'hamza.sheikh@example.com',
      selectedPlan: 'Executive Quarterly Split',
      message: 'Inquiring about personal trainer availability and timing.',
      status: 'new',
    },
    {
      name: 'Zubair Ahmad',
      phone: '0301-9988776',
      email: 'zubair.ahmad@example.com',
      selectedPlan: 'Monthly Access Pass',
      message: 'Do you have discounts for university students?',
      status: 'contacted',
    },
  ]);

  console.log('✅ PKR Database Seeded Successfully!');
  console.log('=============================================');
  console.log('🔑 Admin Login Credentials:');
  console.log('  Email:    admin@gym.com');
  console.log('  Password: admin123');
  console.log('=============================================');
}
