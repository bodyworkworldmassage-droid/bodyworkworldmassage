import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import db from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const imageUrl = `/uploads/profiles/${filename}`;
    db.prepare("UPDATE users SET profile_image=?, updated_at=datetime('now') WHERE id=?").run(imageUrl, sessionUser.id);

    return NextResponse.json({ image_url: imageUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
