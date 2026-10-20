import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      title, description, tags, category, default_category,
      address, country, region, city, postal_code,
      latitude, longitude, map_view,
      services_offered, pricing, service_areas, availability,
    } = body;

    if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

    const rows = await sql`
      INSERT INTO listings (user_id, title, description, tags, category, default_category, address, country, region, city, postal_code, latitude, longitude, map_view, services_offered, pricing, service_areas, availability, status)
      VALUES (${sessionUser.id}, ${title}, ${description || null}, ${tags || null}, ${category || null}, ${default_category || null},
              ${address || null}, ${country || null}, ${region || null}, ${city || null}, ${postal_code || null},
              ${latitude || null}, ${longitude || null}, ${map_view || null},
              ${services_offered || null}, ${pricing || null}, ${service_areas || null}, ${availability || null}, 'approved')
      RETURNING id
    `;

    return NextResponse.json({ success: true, listing_id: rows[0].id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const listings = await sql`
      SELECT l.*, u.first_name, u.last_name, u.username, u.profile_image
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.status = 'approved'
      ORDER BY l.created_at DESC
    `;
    return NextResponse.json({ listings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
