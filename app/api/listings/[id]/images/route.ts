import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import db from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const listing = db.prepare('SELECT user_id FROM listings WHERE id=?').get(id) as { user_id: number } | undefined;
    if (!listing || listing.user_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'listings', id);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const urls: string[] = [];

    for (const file of files) {
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${uuidv4()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      const imageUrl = `/uploads/listings/${id}/${filename}`;
      db.prepare('INSERT INTO listing_images (listing_id, image_url) VALUES (?,?)').run(id, imageUrl);
      urls.push(imageUrl);
    }

    return NextResponse.json({ image_urls: urls });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
