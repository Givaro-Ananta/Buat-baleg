import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SessionWrapper from '@/components/SessionWrapper';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Sistem Pengawasan | HMSD ITERA',
  description:
    'Sistem internal pengumpulan berkas bukti pengawasan HMSD ITERA — unggah, kelola, dan verifikasi laporan pengawasan secara terpusat.',
  keywords: ['HMSD ITERA', 'pengawasan', 'bukti pengawasan', 'Sains Data'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
