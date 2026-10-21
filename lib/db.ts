import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

function getDb() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  const cleanUrl = url
    .replace(/[?&]channel_binding=[^&]*/g, '')
    .replace(/\?&/, '?')
    .replace(/[?&]$/, '');
  _sql = neon(cleanUrl);
  return _sql;
}

export function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<any[]> {
  return getDb()(strings, ...values) as Promise<any[]>;
}

export async function initDb() {
  const db = getDb();
  await db`
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
  await db`
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
  await db`
    CREATE TABLE IF NOT EXISTS listing_images (
      id SERIAL PRIMARY KEY,
      listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await db`
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
