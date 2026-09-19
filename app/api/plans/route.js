import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Plan from '@/models/Plan';

export async function GET() {
  try {
    await connectToDatabase();
    const plans = await Plan.find({ isActive: true }).sort({ pricePKR: 1 });
    return NextResponse.json({ success: true, count: plans.length, plans });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
