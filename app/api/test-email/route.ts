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
    passLength: process.env.SMTP_PASS?.length,
  };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"BodyWorkWorld Massage" <${process.env.SMTP_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email - BodyWorkWorldMassage',
      html: '<p>✅ Brevo SMTP is working correctly! Email sending is configured.</p>',
    });

    return NextResponse.json({ success: true, message: 'Test email sent!', messageId: info.messageId, config });
  } catch (err: unknown) {
    const error = err as Error & { code?: string; command?: string; response?: string; responseCode?: number };
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      config,
    }, { status: 500 });
  }
}
