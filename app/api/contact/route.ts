import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { mode, name, email, phone, location, service, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const isProvider = mode === 'provider';
    const subject = isProvider
      ? `New Provider Request: ${name}`
      : `New Client Inquiry: ${name}`;

    await transporter.sendMail({
      from: `"BodyWorkWorld Massage" <${process.env.SMTP_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#1a3a2a;">${isProvider ? '🏢 New Provider Request' : '🔍 New Client Inquiry'}</h2>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;font-weight:600;width:140px;background:#f9f9f9">Name</td><td style="padding:8px">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:600;background:#f0f0f0">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px;font-weight:600;background:#f9f9f9">Phone</td><td style="padding:8px">${phone}</td></tr>` : ''}
            <tr><td style="padding:8px;font-weight:600;background:#f0f0f0">${isProvider ? 'Location' : 'Their Location'}</td><td style="padding:8px">${location || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:600;background:#f9f9f9">${isProvider ? 'Service Offered' : 'Looking For'}</td><td style="padding:8px">${service || '—'}</td></tr>
          </table>
          <div style="background:#f9f9f9;border-left:4px solid #1a3a2a;padding:14px;border-radius:4px;margin-top:16px">
            <p style="margin:0;font-weight:600;margin-bottom:8px">Message:</p>
            <p style="margin:0;line-height:1.6">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#888">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
