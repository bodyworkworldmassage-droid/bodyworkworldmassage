import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, generateApprovalToken } from '@/lib/auth';
import { sendAdminApprovalEmail } from '@/lib/email';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      first_name, last_name, username, email, password, confirm_password,
      phone, date_of_birth, instagram_url, website,
      account_type, terms_accepted, gdpr_accepted,
    } = body;

    if (!first_name || !last_name || !username || !email || !password || !confirm_password) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }
    if (password !== confirm_password) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    if (!terms_accepted) {
      return NextResponse.json({ error: 'You must accept the terms.' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existing) {
      return NextResponse.json({ error: 'Email or username already in use.' }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const result = db.prepare(`
      INSERT INTO users (first_name, last_name, username, email, password_hash, phone, date_of_birth, instagram_url, website, account_type, terms_accepted, gdpr_accepted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      first_name, last_name, username, email, password_hash,
      phone || null, date_of_birth || null, instagram_url || null, website || null,
      account_type || 'default', terms_accepted ? 1 : 0, gdpr_accepted ? 1 : 0
    );

    const userId = result.lastInsertRowid as number;
    const { token, hash } = generateApprovalToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO approval_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)').run(userId, hash, expiresAt);

    const user = db.prepare('SELECT id, first_name, last_name, email, username FROM users WHERE id = ?').get(userId) as { id: number; first_name: string; last_name: string; email: string; username: string };

    try {
      await sendAdminApprovalEmail(user, token);
    } catch (emailErr) {
      console.error('Failed to send admin email:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your account is in progress. Your registration has been submitted successfully and is currently waiting for admin approval.',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
