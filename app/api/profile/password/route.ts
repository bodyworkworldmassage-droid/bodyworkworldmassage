import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { sql } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { current_password, new_password, confirm_new_password } = await request.json();
    if (!current_password || !new_password || !confirm_new_password) {
      return NextResponse.json({ error: 'All fields required.' }, { status: 400 });
    }
    if (new_password !== confirm_new_password) {
      return NextResponse.json({ error: 'New passwords do not match.' }, { status: 400 });
    }
    if (new_password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const rows = await sql`SELECT password_hash FROM users WHERE id = ${sessionUser.id}`;
    const valid = await verifyPassword(current_password, rows[0].password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const newHash = await hashPassword(new_password);
    await sql`UPDATE users SET password_hash=${newHash}, updated_at=NOW() WHERE id=${sessionUser.id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
