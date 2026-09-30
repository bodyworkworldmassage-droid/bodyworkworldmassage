import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM,
    adminEmail: process.env.ADMIN_EMAIL,
    hasPass: !!process.env.SMTP_PASS,
  };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email - BodyWorkWorldMassage',
      html: '<p>This is a test email. If you received this, email sending is working correctly!</p>',
    });

    return NextResponse.json({ success: true, message: 'Test email sent!', config });
  } catch (err: unknown) {
    const error = err as Error & { code?: string; command?: string };
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      config,
    }, { status: 500 });
  }
}
