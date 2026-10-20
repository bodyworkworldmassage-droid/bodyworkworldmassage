import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Strip parameters unsupported by the Neon HTTP driver
const dbUrl = process.env.DATABASE_URL
  .replace(/[?&]channel_binding=[^&]*/g, '')
  .replace(/\?&/, '?')
  .replace(/[?&]$/, '');

export const sql = neon(dbUrl);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      date_of_birth TEXT,
      instagram_url TEXT,
      website TEXT,
      profile_image TEXT,
      bio TEXT,
      account_type TEXT DEFAULT 'default',
      account_status TEXT DEFAULT 'pending',
      terms_accepted INTEGER DEFAULT 0,
      gdpr_accepted INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      approved_at TIMESTAMPTZ,
      state TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      tags TEXT,
      category TEXT,
      default_category TEXT,
      address TEXT,
      country TEXT,
      region TEXT,
      city TEXT,
      postal_code TEXT,
      latitude REAL,
      longitude REAL,
      map_view TEXT,
      services_offered TEXT,
      pricing TEXT,
      service_areas TEXT,
      availability TEXT,
      status TEXT DEFAULT 'pending_review',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      approved_at TIMESTAMPTZ
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS listing_images (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS approval_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

initDb().catch(console.error);
