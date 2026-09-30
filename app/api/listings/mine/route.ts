import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import db from '@/lib/db';

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const listings = db.prepare('SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC').all(sessionUser.id);
    return NextResponse.json({ listings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
