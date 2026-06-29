import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDepartmentRows } from '@/lib/sheets';
import { groupDepartments } from '@/lib/departments';
import { DEPARTMENTS_SEED } from '@/lib/departments';

// Simple in-memory cache (resets on cold start)
let cache: { data: ReturnType<typeof groupDepartments>; ts: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return from cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    return NextResponse.json({ success: true, data: cache.data });
  }

  try {
    if (!process.env.SPREADSHEET_ID) {
      // Dev mode: return seed data
      const grouped = groupDepartments(DEPARTMENTS_SEED);
      cache = { data: grouped, ts: Date.now() };
      return NextResponse.json({ success: true, data: grouped });
    }

    const rows = await getDepartmentRows();
    const grouped = groupDepartments(rows.length > 0 ? rows : DEPARTMENTS_SEED);
    cache = { data: grouped, ts: Date.now() };
    return NextResponse.json({ success: true, data: grouped });
  } catch (err) {
    console.error('[API/departments] Error:', err);
    // Fallback to seed data on error
    const grouped = groupDepartments(DEPARTMENTS_SEED);
    return NextResponse.json({ success: true, data: grouped });
  }
}
