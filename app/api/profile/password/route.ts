import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import db from '@/lib/db';
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

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(sessionUser.id) as { password_hash: string };
    const valid = await verifyPassword(current_password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    const newHash = await hashPassword(new_password);
    db.prepare("UPDATE users SET password_hash=?, updated_at=datetime('now') WHERE id=?").run(newHash, sessionUser.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
