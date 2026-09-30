import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const safeUser = user as unknown as Record<string, unknown>;
    delete safeUser.password_hash;
    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
