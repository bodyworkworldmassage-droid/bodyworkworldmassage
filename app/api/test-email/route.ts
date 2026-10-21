import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.SMTP_FROM || 'bodyworkworldmassage@gmail.com';
    const adminEmail = process.env.ADMIN_EMAIL || 'bodyworkworldmassage@gmail.com';

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'BREVO_API_KEY not set' });
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'BodyWorkWorld Massage', email: fromEmail },
        to: [{ email: adminEmail }],
        subject: 'Test Email from BodyWorkWorld',
        htmlContent: '<p>This is a test email. Email sending is working correctly!</p>',
      }),
    });

    const body = await res.text();

    if (!res.ok) {
      return NextResponse.json({ success: false, status: res.status, error: body });
    }

    return NextResponse.json({ success: true, status: res.status, response: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
