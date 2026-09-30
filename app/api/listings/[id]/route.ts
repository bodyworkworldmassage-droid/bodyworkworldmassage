import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  try {
    const listing = db.prepare(`
      SELECT l.*, u.first_name, u.last_name, u.username, u.email, u.phone, u.profile_image, u.website
      FROM listings l JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `).get(id) as Record<string, unknown> | undefined;

    if (!listing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    // Public can only see approved; owner can see their own
    if (listing.status !== 'approved' && (!sessionUser || sessionUser.id !== listing.user_id)) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    const images = db.prepare('SELECT * FROM listing_images WHERE listing_id = ? ORDER BY sort_order').all(id);
    return NextResponse.json({ listing, images });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const listing = db.prepare('SELECT user_id FROM listings WHERE id = ?').get(id) as { user_id: number } | undefined;
    if (!listing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (listing.user_id !== sessionUser.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const {
      title, description, tags, category, default_category,
      address, country, region, city, postal_code,
      latitude, longitude, map_view,
      services_offered, pricing, service_areas, availability,
    } = body;

    db.prepare(`
      UPDATE listings SET title=?, description=?, tags=?, category=?, default_category=?, address=?, country=?, region=?, city=?, postal_code=?, latitude=?, longitude=?, map_view=?, services_offered=?, pricing=?, service_areas=?, availability=?, updated_at=datetime('now')
      WHERE id=?
    `).run(title, description||null, tags||null, category||null, default_category||null, address||null, country||null, region||null, city||null, postal_code||null, latitude||null, longitude||null, map_view||null, services_offered||null, pricing||null, service_areas||null, availability||null, id);

    const updated = db.prepare('SELECT * FROM listings WHERE id=?').get(id);
    return NextResponse.json({ listing: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
