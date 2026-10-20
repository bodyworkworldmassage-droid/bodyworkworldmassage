import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const location = (searchParams.get('location') || '').trim();

    const qParam = q ? `%${q.toLowerCase()}%` : '%';
    const locParam = location ? `%${location.toLowerCase()}%` : '%';

    const results = await sql`
      SELECT l.*, u.first_name, u.last_name, u.username, u.profile_image, u.phone, u.website, u.instagram_url
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.status = 'approved'
      AND (
        ${q} = '' OR
        LOWER(l.title) LIKE ${qParam} OR
        LOWER(COALESCE(l.tags,'')) LIKE ${qParam} OR
        LOWER(COALESCE(l.services_offered,'')) LIKE ${qParam} OR
        LOWER(COALESCE(l.category,'')) LIKE ${qParam} OR
        LOWER(u.first_name || ' ' || u.last_name) LIKE ${qParam}
      )
      AND (
        ${location} = '' OR
        LOWER(COALESCE(l.city,'')) LIKE ${locParam} OR
        LOWER(COALESCE(l.region,'')) LIKE ${locParam} OR
        LOWER(COALESCE(l.postal_code,'')) LIKE ${locParam} OR
        LOWER(COALESCE(l.address,'')) LIKE ${locParam}
      )
      ORDER BY l.created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ results, total: results.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
