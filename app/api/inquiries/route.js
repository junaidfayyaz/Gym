import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { sendInquiryNotificationEmail } from '@/lib/mailer';
import { getAdminFromCookie } from '@/lib/auth';
import { z } from 'zod';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid Pakistani phone number required (e.g. 03XX-XXXXXXX)'),
  email: z.string().email('Please enter a valid email address'),
  selectedPlan: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const validatedData = inquirySchema.parse(body);

    const inquiry = await Inquiry.create({
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email.toLowerCase(),
      selectedPlan: validatedData.selectedPlan || 'General Inquiry',
      message: validatedData.message,
      status: 'new',
    });

    // Dispatch Nodemailer Email Notification to Gym Owner
    await sendInquiryNotificationEmail(inquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your inquiry has been submitted and sent to our gym management team.',
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
