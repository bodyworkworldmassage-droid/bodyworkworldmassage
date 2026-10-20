import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const result = await sql`SELECT NOW() as time, current_database() as db`;
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `;
    return NextResponse.json({
      success: true,
      time: result[0].time,
      database: result[0].db,
      tables: tables.map((t: any) => t.table_name),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 500 });
  }
}
