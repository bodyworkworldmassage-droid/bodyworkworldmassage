import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { sql } from '@/lib/db';

export async function PUT(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { first_name, last_name, username, email, bio, phone, date_of_birth, instagram_url, website } = body;

    if (!first_name || !last_name || !username || !email) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 });
    }

    const conflict = await sql`SELECT id FROM users WHERE (email = ${email} OR username = ${username}) AND id != ${sessionUser.id}`;
    if (conflict.length > 0) {
      return NextResponse.json({ error: 'Email or username already in use.' }, { status: 409 });
    }

    await sql`
      UPDATE users SET
        first_name=${first_name}, last_name=${last_name}, username=${username}, email=${email},
        bio=${bio||null}, phone=${phone||null}, date_of_birth=${date_of_birth||null},
        instagram_url=${instagram_url||null}, website=${website||null}, updated_at=NOW()
      WHERE id=${sessionUser.id}
    `;

    const rows = await sql`SELECT * FROM users WHERE id = ${sessionUser.id}`;
    const updated = { ...rows[0] } as Record<string, unknown>;
    delete updated.password_hash;
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
