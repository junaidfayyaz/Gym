import nodemailer from 'nodemailer';

export async function sendInquiryNotificationEmail(inquiry) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const recipient = process.env.ADMIN_EMAIL || 'owner@titanfitgym.com';

  if (!user || user.includes('demo')) {
    console.log(`✉️ [MAIL MOCK TRIGGERED] New Lead Inquiry from ${inquiry.name} (${inquiry.phone})`);
    console.log(`   Message: ${inquiry.message}`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"TitanFit Gym Website" <${user}>`,
      to: recipient,
      subject: `🚨 NEW LEAD INQUIRY: ${inquiry.name} (${inquiry.selectedPlan || 'General'})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff;">
          <h2 style="color: #f43f5e;">🏋️ New Lead Inquiry Received!</h2>
          <p><strong>Full Name:</strong> ${inquiry.name}</p>
          <p><strong>Phone Number:</strong> ${inquiry.phone}</p>
          <p><strong>Email Address:</strong> ${inquiry.email}</p>
          <p><strong>Selected Membership:</strong> ${inquiry.selectedPlan || 'General Inquiry'}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #1e293b; padding: 12px; border-left: 4px solid #f43f5e; color: #cbd5e1;">
            "${inquiry.message}"
          </blockquote>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
            This inquiry was automatically dispatched from your TitanFit Gym Website.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email dispatched to ${recipient}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️ Nodemailer warning: ${error.message}`);
    return { success: false, error: error.message };
  }
}
