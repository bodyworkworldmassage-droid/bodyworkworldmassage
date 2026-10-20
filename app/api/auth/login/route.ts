import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username/email and password are required.' }, { status: 400 });
    }

    const rows = await sql`SELECT * FROM users WHERE email = ${identifier} OR username = ${identifier}`;
    const user = rows[0] as {
      id: number; username: string; email: string; password_hash: string;
      account_status: string; account_type: string; profile_image: string | null;
      first_name: string; last_name: string;
    } | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    if (user.account_status === 'pending') {
      return NextResponse.json({
        error: 'Your account is awaiting admin approval. You will receive an email once approved.',
      }, { status: 403 });
    }

    if (user.account_status === 'rejected' || user.account_status === 'suspended') {
      return NextResponse.json({ error: 'Your account has been suspended or rejected.' }, { status: 403 });
    }

    const token = createToken(user.id);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        account_type: user.account_type,
        profile_image: user.profile_image,
      },
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
