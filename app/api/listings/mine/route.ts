import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { sql } from '@/lib/db';

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const listings = await sql`SELECT * FROM listings WHERE user_id = ${sessionUser.id} ORDER BY created_at DESC`;
    return NextResponse.json({ listings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
