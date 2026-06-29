import { Department, DepartmentRow } from '@/types';

// ─── Seed data (fallback jika Google Sheets belum dikonfigurasi) ─────────────

export const DEPARTMENTS_SEED: DepartmentRow[] = [
  // Akademik dan Keprofesian
  { kodeDepartemen: 'AKP', namaDepartemen: 'Akademik dan Keprofesian', kodeDivisi: 'AKP-PSD', namaDivisi: 'Professional Skill Development', statusAktif: 'Aktif' },
  { kodeDepartemen: 'AKP', namaDepartemen: 'Akademik dan Keprofesian', kodeDivisi: 'AKP-PIKA', namaDivisi: 'Pusat Inovasi dan Kajian Akademik', statusAktif: 'Aktif' },
  { kodeDepartemen: 'AKP', namaDepartemen: 'Akademik dan Keprofesian', kodeDivisi: 'AKP-RND', namaDivisi: 'Research & Development', statusAktif: 'Aktif' },
  // Internal
  { kodeDepartemen: 'INT', namaDepartemen: 'Internal', kodeDivisi: 'INT-KEH', namaDivisi: 'Keharmonisasian', statusAktif: 'Aktif' },
  { kodeDepartemen: 'INT', namaDepartemen: 'Internal', kodeDivisi: 'INT-KRH', namaDivisi: 'Kerohanian', statusAktif: 'Aktif' },
  // Manajemen Minat Bakat
  { kodeDepartemen: 'MMB', namaDepartemen: 'Manajemen Minat Bakat', kodeDivisi: 'MMB-MB', namaDivisi: 'Manajemen Minat dan Bakat', statusAktif: 'Aktif' },
  { kodeDepartemen: 'MMB', namaDepartemen: 'Manajemen Minat Bakat', kodeDivisi: 'MMB-MK', namaDivisi: 'Manajemen Kompetisi', statusAktif: 'Aktif' },
  // Eksternal
  { kodeDepartemen: 'EKS', namaDepartemen: 'Eksternal', kodeDivisi: 'EKS-HL', namaDivisi: 'Hubungan Luar', statusAktif: 'Aktif' },
  { kodeDepartemen: 'EKS', namaDepartemen: 'Eksternal', kodeDivisi: 'EKS-PM', namaDivisi: 'Pengabdian Masyarakat', statusAktif: 'Aktif' },
  // Storage Sains Data
  { kodeDepartemen: 'SSD', namaDepartemen: 'Storage Sains Data', kodeDivisi: 'SSD-KWU', namaDivisi: 'Kewirausahaan', statusAktif: 'Aktif' },
  { kodeDepartemen: 'SSD', namaDepartemen: 'Storage Sains Data', kodeDivisi: 'SSD-KMT', namaDivisi: 'Kemitraan', statusAktif: 'Aktif' },
  // Media Kreatif
  { kodeDepartemen: 'MKR', namaDepartemen: 'Media Kreatif', kodeDivisi: 'MKR-VD', namaDivisi: 'Visual Desain', statusAktif: 'Aktif' },
  { kodeDepartemen: 'MKR', namaDepartemen: 'Media Kreatif', kodeDivisi: 'MKR-DOK', namaDivisi: 'Dokumentasi', statusAktif: 'Aktif' },
  { kodeDepartemen: 'MKR', namaDepartemen: 'Media Kreatif', kodeDivisi: 'MKR-MK', namaDivisi: 'Media dan Konten', statusAktif: 'Aktif' },
  // Pengembangan Sumber Daya Anggota
  { kodeDepartemen: 'PSDA', namaDepartemen: 'Pengembangan Sumber Daya Anggota', kodeDivisi: 'PSDA-PMA', namaDivisi: 'Peningkatan Mutu Anggota', statusAktif: 'Aktif' },
  { kodeDepartemen: 'PSDA', namaDepartemen: 'Pengembangan Sumber Daya Anggota', kodeDivisi: 'PSDA-KAD', namaDivisi: 'Kaderisasi', statusAktif: 'Aktif' },
  // Kesekjenan (berdiri sendiri — auto-select "Umum")
  { kodeDepartemen: 'KSJ', namaDepartemen: 'Kesekjenan', kodeDivisi: 'KSJ-UMUM', namaDivisi: 'Umum', statusAktif: 'Aktif' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert flat DepartmentRow[] to grouped Department[]
 */
export function groupDepartments(rows: DepartmentRow[]): Department[] {
  const map = new Map<string, Department>();

  for (const row of rows) {
    if (row.statusAktif !== 'Aktif') continue;

    if (!map.has(row.kodeDepartemen)) {
      map.set(row.kodeDepartemen, {
        kodeDepartemen: row.kodeDepartemen,
        namaDepartemen: row.namaDepartemen,
        divisi: [],
      });
    }

    const dept = map.get(row.kodeDepartemen)!;
    if (row.statusAktif === 'Aktif') {
      dept.divisi.push({
        kodeDivisi: row.kodeDivisi,
        namaDivisi: row.namaDivisi,
        statusAktif: row.statusAktif,
      });
    }
  }

  return Array.from(map.values());
}

/**
 * Validate that a given department+division combination is valid
 */
export function isValidDeptDivision(
  departments: Department[],
  kodeDepartemen: string,
  kodeDivisi: string,
): boolean {
  const dept = departments.find((d) => d.kodeDepartemen === kodeDepartemen);
  if (!dept) return false;
  return dept.divisi.some((div) => div.kodeDivisi === kodeDivisi);
}
