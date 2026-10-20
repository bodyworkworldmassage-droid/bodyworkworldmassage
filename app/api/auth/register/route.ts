import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword, createToken, generateApprovalToken } from '@/lib/auth';
import { sendAdminApprovalEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      first_name, last_name, username, email, password, confirm_password,
      phone, date_of_birth, instagram_url, website,
      account_type, terms_accepted, gdpr_accepted, state,
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

    const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email or username already in use.' }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const isProvider = account_type === 'provider';

    // Providers go pending for admin approval; default users auto-approve
    const accountStatus = isProvider ? 'pending' : 'approved';

    const rows = await sql`
      INSERT INTO users (first_name, last_name, username, email, password_hash, phone, date_of_birth, instagram_url, website, account_type, account_status, terms_accepted, gdpr_accepted, state)
      VALUES (${first_name}, ${last_name}, ${username}, ${email}, ${password_hash},
              ${phone || null}, ${date_of_birth || null}, ${instagram_url || null}, ${website || null},
              ${account_type || 'default'}, ${accountStatus}, ${terms_accepted ? 1 : 0}, ${gdpr_accepted ? 1 : 0}, ${state || null})
      RETURNING id
    `;

    const userId = rows[0].id as number;

    if (isProvider) {
      // Generate approval token valid for 7 days
      const { token, hash } = generateApprovalToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await sql`
        INSERT INTO approval_tokens (user_id, token_hash, expires_at)
        VALUES (${userId}, ${hash}, ${expiresAt})
      `;

      try {
        await sendAdminApprovalEmail(
          { id: userId, first_name, last_name, email, username },
          token
        );
      } catch (e) {
        console.error('Failed to send admin approval email:', e);
      }

      return NextResponse.json({
        success: true,
        pending: true,
        message: 'Registration successful! Your account is pending admin approval. You will receive an email once approved.',
      });
    }

    // Default users: auto-approve and log in immediately
    const sessionToken = createToken(userId);
    const response = NextResponse.json({
      success: true,
      pending: false,
      message: 'Registration successful! You are now logged in.',
    });

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('REGISTER ERROR:', err);
    return NextResponse.json({ error: err?.message || 'Server error.' }, { status: 500 });
  }
}
