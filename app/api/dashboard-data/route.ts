import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('dashboard_auth');
  if (auth?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [
    totalUsersRows, totalProvidersRows, pendingUsersRows, approvedUsersRows, defaultUsersRows,
    totalListingsRows, approvedListingsRows, pendingListingsRows, totalImagesRows,
    regByDay, listingsByDay, usersByState, listingsByCategory,
    recentUsers, recentListings, pendingProviders, pendingListingsDetail, providersWithListings,
  ] = await Promise.all([
    sql`SELECT COUNT(*)::int as n FROM users`,
    sql`SELECT COUNT(*)::int as n FROM users WHERE account_type='provider'`,
    sql`SELECT COUNT(*)::int as n FROM users WHERE account_status='pending'`,
    sql`SELECT COUNT(*)::int as n FROM users WHERE account_status='approved'`,
    sql`SELECT COUNT(*)::int as n FROM users WHERE account_type='default'`,

    sql`SELECT COUNT(*)::int as n FROM listings`,
    sql`SELECT COUNT(*)::int as n FROM listings WHERE status='approved'`,
    sql`SELECT COUNT(*)::int as n FROM listings WHERE status='pending_review'`,
    sql`SELECT COUNT(*)::int as n FROM listing_images`,

    sql`
      SELECT DATE(created_at) as day, COUNT(*)::int as n
      FROM users
      WHERE created_at >= NOW() - INTERVAL '29 days'
      GROUP BY day ORDER BY day
    `,
    sql`
      SELECT DATE(created_at) as day, COUNT(*)::int as n
      FROM listings
      WHERE created_at >= NOW() - INTERVAL '29 days'
      GROUP BY day ORDER BY day
    `,
    sql`
      SELECT state, COUNT(*)::int as n FROM users
      WHERE state IS NOT NULL AND state != ''
      GROUP BY state ORDER BY n DESC LIMIT 15
    `,
    sql`
      SELECT category, COUNT(*)::int as n FROM listings
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category ORDER BY n DESC LIMIT 10
    `,

    sql`
      SELECT id, first_name, last_name, email, account_type, account_status, state, created_at
      FROM users ORDER BY created_at DESC LIMIT 20
    `,
    sql`
      SELECT l.id, l.title, l.category, l.city, l.region, l.status, l.created_at,
             u.first_name || ' ' || u.last_name as provider_name
      FROM listings l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC LIMIT 20
    `,
    sql`
      SELECT id, first_name, last_name, email, state, created_at
      FROM users WHERE account_status='pending' ORDER BY created_at DESC LIMIT 20
    `,
    sql`
      SELECT l.id, l.title, l.category, l.city, l.region, l.created_at,
             u.first_name || ' ' || u.last_name as provider_name, u.email as provider_email
      FROM listings l JOIN users u ON l.user_id = u.id
      WHERE l.status='pending_review' ORDER BY l.created_at DESC LIMIT 20
    `,
    sql`
      SELECT u.id, u.first_name || ' ' || u.last_name as name, u.email, u.state,
             u.account_status, u.created_at,
             COUNT(l.id)::int as listing_count
      FROM users u LEFT JOIN listings l ON l.user_id = u.id
      WHERE u.account_type='provider'
      GROUP BY u.id ORDER BY u.created_at DESC LIMIT 30
    `,
  ]);

  return NextResponse.json({
    kpis: {
      totalUsers: totalUsersRows[0].n,
      totalProviders: totalProvidersRows[0].n,
      defaultUsers: defaultUsersRows[0].n,
      pendingUsers: pendingUsersRows[0].n,
      approvedUsers: approvedUsersRows[0].n,
      totalListings: totalListingsRows[0].n,
      approvedListings: approvedListingsRows[0].n,
      pendingListings: pendingListingsRows[0].n,
      totalImages: totalImagesRows[0].n,
    },
    regByDay,
    listingsByDay,
    usersByState,
    listingsByCategory,
    recentUsers,
    recentListings,
    pendingProviders,
    pendingListingsDetail,
    providersWithListings,
  });
}
