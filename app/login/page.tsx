'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

function LoginContent() {
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get('error');
  const callbackUrl = params.get('callbackUrl') ?? '/pengawas';
  const [loading, setLoading] = useState(false);

  const errorMessages: Record<string, string> = {
    unregistered: 'Akun kamu belum terdaftar di sistem. Hubungi Master Admin untuk didaftarkan.',
    AccessDenied: 'Akun ini tidak memiliki izin masuk. Pastikan akunmu sudah didaftarkan oleh Master Admin.',
    OAuthSignin: 'Gagal memulai proses login Google. Coba lagi.',
    OAuthCallback: 'Terjadi kesalahan saat autentikasi. Coba lagi.',
    OAuthAccountNotLinked: 'Akun ini sudah terhubung dengan metode lain. Gunakan metode login yang sama.',
    default: 'Terjadi kesalahan. Silakan coba lagi.',
  };

  const errorMsg = error ? (errorMessages[error] ?? errorMessages.default) : null;

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🖼️', title: 'Upload Foto Bukti', desc: 'Unggah foto kegiatan terstruktur per Departemen & Divisi' },
    { icon: '📄', title: 'Laporan BAP', desc: 'Lengkapi dengan file PDF Laporan BAP dalam 3 hari' },
    { icon: '✅', title: 'Verifikasi Admin', desc: 'Status pengawasan dipantau & diverifikasi Master Admin' },
  ];

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* ─── Left panel — brand ──────────────────────────────── */}
      <div className="hidden md:flex flex-col justify-between w-5/12 xl:w-1/2 bg-navy-900 p-12 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-md h-112 rounded-full bg-white/4 blur-3xl" />
          <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-72 h-72 rounded-full bg-gold-500/8 blur-2xl" />
          <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-sky-500/8 blur-2xl" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-pattern" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-sky-50 rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-black/30 border border-sky-100/20">
            <img src="/logo_baleg.png" alt="Logo Badan Legislatif HMSD" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-white font-extrabold text-xl leading-none tracking-tight">HMSD ITERA</p>
            <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mt-0.5">Badan Legislatif</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
              <span className="text-gold-400 text-xs font-semibold tracking-wider uppercase">Sistem Aktif</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Pengumpulan<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-gold-400 to-gold-200">
                Bukti Pengawasan
              </span>
            </h1>
            <p className="text-sky-200/70 text-base leading-relaxed max-w-sm">
              Platform terpusat untuk pengawas mengunggah bukti kegiatan — tersimpan otomatis di Google Drive dan tercatat di Google Sheets.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 text-base group-hover:bg-white/10 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-sky-200/50 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/25 text-xs">© 2026 HMSD ITERA — Sains Data</p>
        </div>
      </div>

      {/* ─── Right panel — login form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-linear-to-br from-gray-50 to-sky-50/30 min-h-screen md:min-h-0">
        <div className="w-full max-w-sm space-y-7">

          {/* Mobile logo */}
          <div className="md:hidden text-center space-y-3">
            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center p-2.5 border border-sky-100 shadow-md mx-auto">
              <img src="/logo_baleg.png" alt="Logo Badan Legislatif HMSD" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-navy-900">HMSD ITERA</h1>
              <p className="text-gold-600 text-xs font-semibold tracking-widest uppercase">Badan Legislatif</p>
              <p className="text-gray-400 text-sm mt-1">Sistem Pengumpulan Bukti Pengawasan</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-navy-900">Masuk ke Sistem</h2>
              <p className="text-gray-400 text-sm mt-1">
                Gunakan akun Google yang terdaftar untuk melanjutkan
              </p>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <span className="text-red-500 text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 text-sm leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Google login button */}
            <button
              id="btn-login-google"
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-200 hover:border-gold-400 hover:bg-gold-50/50 hover:shadow-md hover:shadow-gold-100 rounded-xl font-semibold text-navy-900 transition-all duration-200 active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  {/* Spinner */}
                  <svg className="animate-spin w-5 h-5 text-navy-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  {/* Google logo */}
                  <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Masuk dengan Google</span>
                  <span className="ml-auto text-gray-200 group-hover:text-gold-400 transition-colors duration-200 text-lg">→</span>
                </>
              )}
            </button>

            <div className="border-t border-gray-100 pt-4 space-y-1.5">
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Hanya akun yang terdaftar oleh Master Admin yang dapat masuk.
              </p>
              <p className="text-xs text-center">
                <a
                  href="mailto:balegmsdadyatama@gmail.com"
                  className="text-gold-500 hover:text-gold-600 font-medium transition-colors"
                >
                  Hubungi Admin jika belum terdaftar →
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-300">
            © 2026 HMSD ITERA — Sains Data
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
