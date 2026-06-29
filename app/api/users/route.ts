import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllUsers, addUser, updateUserStatus } from '@/lib/sheets';
import { AppUser } from '@/types';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'Master Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    if (!process.env.SPREADSHEET_ID) {
      return NextResponse.json({ success: true, data: [] });
    }
    const users = await getAllUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    console.error('[API/users GET] Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'Master Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Omit<AppUser, 'tanggalTerdaftar'>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid' }, { status: 400 });
  }

  if (!body.email || !body.namaLengkap || !body.role) {
    return NextResponse.json({ error: 'email, namaLengkap, dan role wajib diisi' }, { status: 400 });
  }

  try {
    if (!process.env.SPREADSHEET_ID) {
      return NextResponse.json({ success: true });
    }
    await addUser({ ...body, statusAktif: body.statusAktif ?? 'Aktif' });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API/users POST] Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'Master Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { email: string } & Partial<Pick<AppUser, 'role' | 'statusAktif' | 'namaLengkap'>>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid' }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ error: 'email wajib diisi' }, { status: 400 });
  }

  try {
    if (!process.env.SPREADSHEET_ID) {
      return NextResponse.json({ success: true });
    }
    const updated = await updateUserStatus(body.email, body);
    if (!updated) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API/users PATCH] Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
