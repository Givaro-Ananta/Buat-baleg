// ─── Auth & User ─────────────────────────────────────────────────────────────

export type UserRole = 'Pengawas' | 'Master Admin';
export type UserStatus = 'Aktif' | 'Nonaktif';

export interface AppUser {
  email: string;
  namaLengkap: string;
  role: UserRole;
  departemenDivisi?: string; // opsional, untuk pembatasan di masa depan
  statusAktif: UserStatus;
  tanggalTerdaftar: string;
}

// ─── Departments ─────────────────────────────────────────────────────────────

export interface Division {
  kodeDivisi: string;
  namaDivisi: string;
  statusAktif: 'Aktif' | 'Nonaktif';
}

export interface Department {
  kodeDepartemen: string;
  namaDepartemen: string;
  divisi: Division[];
}

export interface DepartmentRow {
  kodeDepartemen: string;
  namaDepartemen: string;
  kodeDivisi: string;
  namaDivisi: string;
  statusAktif: 'Aktif' | 'Nonaktif';
}

// ─── Submission ───────────────────────────────────────────────────────────────

export type VerificationStatus = 'Belum Diperiksa' | 'Sesuai' | 'Perlu Revisi';
export type TimeStatus = 'Tepat Waktu' | 'Terlambat';
export type FileType = 'Foto' | 'Video' | 'Dokumen' | 'Lainnya';

export interface Submission {
  id: string; // row index in sheet (stringified)
  timestampInput: string;
  emailPengirim: string;
  namaPengirim: string;
  rolePengirim: UserRole;
  departemen: string;
  divisi: string;
  namaAcara: string;
  tanggalPelaksanaan: string;
  deadlinePengumpulan: string;
  lokasi: string;
  jenisBerkas: FileType;
  jumlahFile: number;
  linkFolderDrive: string;
  statusWaktu: TimeStatus;
  statusVerifikasi: VerificationStatus;
  catatanAdmin: string;
  diverifikasiOleh: string;
  waktuVerifikasi: string;
}

export interface SubmissionFormData {
  departemen: string;
  kodeDepartemen: string;
  divisi: string;
  kodeDivisi: string;
  namaAcara: string;
  tanggalPelaksanaan: string;
  deadlinePengumpulan: string;
  lokasi: string;
  jenisBerkas: FileType;
  files: File[];
}

export interface VerifyPayload {
  statusVerifikasi: VerificationStatus;
  catatanAdmin: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'done' | 'error';
}

// ─── NextAuth Session Augmentation ───────────────────────────────────────────
// Augmented in auth.ts via next-auth module augmentation
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}
