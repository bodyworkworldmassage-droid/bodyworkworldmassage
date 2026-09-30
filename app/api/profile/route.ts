import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import db from '@/lib/db';

export async function PUT(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { first_name, last_name, username, email, bio, phone, date_of_birth, instagram_url, website } = body;

    if (!first_name || !last_name || !username || !email) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 });
    }

    const conflict = db.prepare('SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?').get(email, username, sessionUser.id);
    if (conflict) {
      return NextResponse.json({ error: 'Email or username already in use.' }, { status: 409 });
    }

    db.prepare(`
      UPDATE users SET first_name=?, last_name=?, username=?, email=?, bio=?, phone=?, date_of_birth=?, instagram_url=?, website=?, updated_at=datetime('now')
      WHERE id=?
    `).run(first_name, last_name, username, email, bio || null, phone || null, date_of_birth || null, instagram_url || null, website || null, sessionUser.id);

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(sessionUser.id) as Record<string, unknown>;
    delete updated.password_hash;
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
