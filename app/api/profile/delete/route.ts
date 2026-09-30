import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import db from '@/lib/db';

export async function DELETE() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(sessionUser.id);
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', '', { maxAge: 0, path: '/' });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
