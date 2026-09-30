import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    return payload.userId;
  } catch {
    return null;
  }
}

export function generateApprovalToken(): { token: string; hash: string } {
  const token = uuidv4() + '-' + uuidv4();
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}
