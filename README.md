# Sistem Pengumpulan Berkas Bukti Pengawasan — HMSD ITERA

Aplikasi web internal untuk pengumpulan, penyimpanan, dan verifikasi berkas bukti pengawasan HMSD ITERA.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **TailwindCSS v4** (utility-first, token brand HMSD ITERA)
- **NextAuth.js v5** (Google OAuth)
- **Google Drive API v3** — penyimpanan berkas terstruktur
- **Google Sheets API v4** — log submission & master data

---

## Panduan Setup Google Cloud (Wajib sebelum deploy)

### 1. Buat Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru
3. Aktifkan API berikut:
   - **Google Drive API**
   - **Google Sheets API**

### 2. Buat Service Account

1. Di Google Cloud Console → IAM & Admin → Service Accounts
2. Buat service account baru
3. Download file JSON credentials
4. Salin isi file JSON ke environment variable `GOOGLE_SERVICE_ACCOUNT_KEY` (lihat `.env.example`)

### 3. Setup Google Sheets

Buat satu Google Spreadsheet dengan **3 sheet** (nama harus persis):

**Sheet 1: `Log Submission`** — Header baris 1:
```
Timestamp Input | Email/Nama Pengirim | Role Pengirim | Departemen | Divisi | Nama Acara Pengawasan | Tanggal Pelaksanaan Acara | Deadline Pengumpulan | Lokasi | Jenis Berkas | Jumlah File | Link Folder Drive | Status Waktu | Status Verifikasi | Catatan Admin | Diverifikasi Oleh | Waktu Verifikasi
```

**Sheet 2: `Daftar Pengguna`** — Header baris 1:
```
Email | Nama Lengkap | Role | Departemen & Divisi Bertugas | Status Aktif | Tanggal Terdaftar
```
Isi data awal: tambahkan minimal 1 baris dengan role `Master Admin`.

**Sheet 3: `Daftar Departemen & Divisi`** — Header baris 1:
```
Kode Departemen | Nama Departemen | Kode Divisi | Nama Divisi | Status Aktif
```
Data sudah tersedia di `lib/departments.ts` (DEPARTMENTS_SEED) — salin ke sheet ini.

**Bagikan Spreadsheet ke Service Account:**
- Klik "Share" → masukkan email service account (format: `nama@project.iam.gserviceaccount.com`)
- Beri akses **Editor**

### 4. Setup Google Drive

1. Buat folder di Google Drive dengan nama `Bukti Pengawasan`
2. Bagikan folder ke service account email dengan akses **Editor**
3. Salin ID folder dari URL: `https://drive.google.com/drive/folders/**FOLDER_ID**`

### 5. Setup OAuth 2.0 (NextAuth)

1. Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
2. Application type: **Web application**
3. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

---

## Setup Development

```bash
# 1. Clone & install
cd pengawasan-hmsd
npm install

# 2. Salin .env.example ke .env.local dan isi semua variable
cp .env.example .env.local

# 3. Generate NEXTAUTH_SECRET
npx auth secret

# 4. Jalankan dev server
npm run dev
```

> **Dev Mode**: Jika `SPREADSHEET_ID` tidak diisi di `.env.local`, aplikasi otomatis berjalan dalam mode development:
> - Login tetap berjalan (semua email Google bisa masuk)
> - Role otomatis jadi **Master Admin**
> - Data departemen diambil dari seed data lokal
> - Upload file & log submission di-skip (tidak ada Drive/Sheets request)

---

## Struktur Folder

```
app/
├── login/            → Halaman login (Google OAuth)
├── pengawas/
│   ├── page.tsx      → Form upload bukti (Pengawas & Master Admin)
│   └── riwayat/      → Riwayat submission pribadi
├── admin/
│   ├── page.tsx      → Dashboard verifikasi (Master Admin)
│   ├── pengguna/     → Kelola daftar pengguna
│   └── departemen/   → Kelola daftar departemen & divisi
└── api/
    ├── auth/         → NextAuth route handler
    ├── departments/  → GET daftar departemen
    ├── submission/   → POST submit, GET list
    └── submission/[id]/verify/ → PATCH status verifikasi

components/ui/        → Komponen reusable (Navbar, Button, Badge, dll)
lib/                  → Utilities (google.ts, sheets.ts, drive.ts, auth.ts)
types/                → TypeScript type definitions
```

---

## Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel Dashboard
# (sama seperti .env.local, tapi tanpa NEXTAUTH_URL — Vercel mengatur otomatis)
```

---

## Hak Akses

| Halaman/Fitur | Pengawas | Master Admin |
|---|---|---|
| Upload Bukti Pengawasan | ✅ | ✅ |
| Riwayat Submission Pribadi | ✅ | ✅ |
| Dashboard Verifikasi | ❌ | ✅ |
| Kelola Pengguna | ❌ | ✅ |
| Kelola Departemen | ❌ | ✅ |

---

*Dikembangkan untuk HMSD ITERA — Sains Data 2026*
