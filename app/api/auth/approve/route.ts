import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import { sendUserApprovedEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) {
      return new NextResponse('<html><body><h2>Invalid link.</h2></body></html>', { status: 400, headers: { 'Content-Type': 'text/html' } });
    }

    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenRow = db.prepare(`
      SELECT * FROM approval_tokens
      WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')
    `).get(hash) as { id: number; user_id: number } | undefined;

    if (!tokenRow) {
      return new NextResponse('<html><body><h2>Invalid or expired link.</h2></body></html>', { status: 400, headers: { 'Content-Type': 'text/html' } });
    }

    db.prepare("UPDATE users SET account_status = 'approved', approved_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(tokenRow.user_id);
    db.prepare("UPDATE approval_tokens SET used_at = datetime('now') WHERE id = ?").run(tokenRow.id);

    const user = db.prepare('SELECT id, first_name, last_name, email, username FROM users WHERE id = ?').get(tokenRow.user_id) as { id: number; first_name: string; last_name: string; email: string; username: string };
    try {
      await sendUserApprovedEmail(user);
    } catch (e) {
      console.error('Failed to send user approved email:', e);
    }

    return new NextResponse(`
      <html>
        <head><title>Account Approved</title></head>
        <body style="font-family:sans-serif;max-width:500px;margin:80px auto;text-align:center;">
          <h2 style="color:#1a3a2a;">Account Approved Successfully</h2>
          <p>The account for <strong>${user.first_name} ${user.last_name}</strong> (${user.email}) has been approved.</p>
          <p>They have been notified by email.</p>
        </body>
      </html>
    `, { status: 200, headers: { 'Content-Type': 'text/html' } });
  } catch (err) {
    console.error(err);
    return new NextResponse('<html><body><h2>Server error.</h2></body></html>', { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}
