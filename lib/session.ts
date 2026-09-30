import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import db from './db';

export interface SessionUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  instagram_url: string | null;
  website: string | null;
  profile_image: string | null;
  bio: string | null;
  account_type: string;
  account_status: string;
  terms_accepted: number;
  gdpr_accepted: number;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    const userId = verifyToken(token);
    if (!userId) return null;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as SessionUser | undefined;
    return user || null;
  } catch {
    return null;
  }
}
