import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateVerificationStatus } from '@/lib/sheets';
import { VerifyPayload } from '@/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'Master Admin') {
    return NextResponse.json({ error: 'Forbidden — khusus Master Admin' }, { status: 403 });
  }

  const { id } = await params;
  const rowIndex = parseInt(id, 10);

  if (isNaN(rowIndex) || rowIndex < 2) {
    return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
  }

  let body: VerifyPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid' }, { status: 400 });
  }

  const { statusVerifikasi, catatanAdmin } = body;
  const validStatuses = ['Belum Diperiksa', 'Sesuai', 'Perlu Revisi'];
  if (!validStatuses.includes(statusVerifikasi)) {
    return NextResponse.json({ error: 'Status verifikasi tidak valid' }, { status: 400 });
  }

  try {
    if (!process.env.SPREADSHEET_ID) {
      return NextResponse.json({ success: true });
    }

    await updateVerificationStatus({
      rowIndex,
      statusVerifikasi,
      catatanAdmin: catatanAdmin ?? '',
      diverifikasiOleh: session.user.email ?? '',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API/submission/verify] Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
