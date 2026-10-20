import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionUser = await getSessionUser();

  try {
    const rows = await sql`
      SELECT l.*, u.first_name, u.last_name, u.username, u.email, u.phone, u.profile_image, u.website
      FROM listings l JOIN users u ON l.user_id = u.id
      WHERE l.id = ${id}
    `;
    const listing = rows[0] as Record<string, unknown> | undefined;
    if (!listing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    if (listing.status !== 'approved' && (!sessionUser || sessionUser.id !== listing.user_id)) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    const images = await sql`SELECT * FROM listing_images WHERE listing_id = ${id} ORDER BY sort_order`;
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
    const rows = await sql`SELECT user_id FROM listings WHERE id = ${id}`;
    const listing = rows[0] as { user_id: number } | undefined;
    if (!listing) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (listing.user_id !== sessionUser.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const {
      title, description, tags, category, default_category,
      address, country, region, city, postal_code,
      latitude, longitude, map_view,
      services_offered, pricing, service_areas, availability,
    } = body;

    await sql`
      UPDATE listings SET
        title=${title}, description=${description||null}, tags=${tags||null},
        category=${category||null}, default_category=${default_category||null},
        address=${address||null}, country=${country||null}, region=${region||null},
        city=${city||null}, postal_code=${postal_code||null},
        latitude=${latitude||null}, longitude=${longitude||null}, map_view=${map_view||null},
        services_offered=${services_offered||null}, pricing=${pricing||null},
        service_areas=${service_areas||null}, availability=${availability||null},
        updated_at=NOW()
      WHERE id=${id}
    `;

    const updated = await sql`SELECT * FROM listings WHERE id=${id}`;
    return NextResponse.json({ listing: updated[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
