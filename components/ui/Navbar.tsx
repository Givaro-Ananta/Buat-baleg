'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, Upload, LayoutDashboard, Users, Building2, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const HMSD_LOGO = (
  <div className="flex items-center gap-2">
    <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center p-1 border border-sky-100/30">
      <img
        src="/logo_baleg.png"
        alt="Logo Badan Legislatif HMSD"
        className="w-full h-full object-contain"
      />
    </div>
    <div className="leading-none">
      <p className="font-extrabold text-navy-900 text-base leading-none">BALEG</p>
      <p className="text-gold-500 text-[10px] font-semibold tracking-wide">HMSD ADYATAMA ITERA</p>
    </div>
  </div>
);

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  onClick?: () => void;
}

function NavLink({ href, icon, label, pathname, onClick }: NavLinkProps) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors rounded-lg',
        isActive
          ? 'text-gold-500 bg-gold-100'
          : 'text-gray-600 hover:text-navy-900 hover:bg-gray-100',
      )}
    >
      {icon}
      {label}
      {isActive && (
        <span className="ml-auto w-1 h-4 bg-gold-500 rounded-full hidden md:block" />
      )}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isAdmin = session?.user?.role === 'Master Admin';
  const isLoggedIn = status === 'authenticated';

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuButtonRef.current) {
      menuButtonRef.current.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
    }
  }, [menuOpen]);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isLoggedIn ? (isAdmin ? '/admin' : '/pengawas') : '/'} className="shrink-0">
            {HMSD_LOGO}
          </Link>

          {/* Desktop nav */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink
                href="/pengawas"
                icon={<Upload className="w-4 h-4" />}
                label="Upload Bukti"
                pathname={pathname}
              />
              <NavLink
                href="/pengawas/riwayat"
                icon={<ClipboardList className="w-4 h-4" />}
                label="Riwayat"
                pathname={pathname}
              />
              {isAdmin && (
                <>
                  <NavLink
                    href="/admin"
                    icon={<LayoutDashboard className="w-4 h-4" />}
                    label="Dashboard"
                    pathname={pathname}
                  />
                  <NavLink
                    href="/admin/pengguna"
                    icon={<Users className="w-4 h-4" />}
                    label="Pengguna"
                    pathname={pathname}
                  />
                  <NavLink
                    href="/admin/departemen"
                    icon={<Building2 className="w-4 h-4" />}
                    label="Departemen"
                    pathname={pathname}
                  />
                </>
              )}
            </div>
          )}

          {/* Right side: user info + logout */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* User avatar */}
                <div className="hidden md:flex items-center gap-2">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? ''}
                      className="w-8 h-8 rounded-full border-2 border-gold-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-bold">
                      {(session?.user?.name ?? 'U').charAt(0)}
                    </div>
                  )}
                  <div className="text-xs leading-none">
                    <p className="font-semibold text-navy-900 truncate max-w-[120px]">
                      {session?.user?.name}
                    </p>
                    <p className="text-gold-500 font-medium">{session?.user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-navy-900 border-2 border-navy-900 rounded-xl hover:bg-navy-900 hover:text-white transition-all duration-200"
                  aria-label="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Keluar</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-5 py-2.5 text-sm font-bold bg-navy-900 text-white rounded-xl hover:bg-navy-700 transition-all duration-200 active:scale-95"
              >
                Masuk
              </button>
            )}

            {/* Mobile menu toggle */}
            {isLoggedIn && (
              <button
                ref={menuButtonRef}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isLoggedIn && menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {/* Mobile user info */}
          <div className="flex items-center gap-3 pb-3 mb-2 border-b border-gray-100">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-9 h-9 rounded-full border-2 border-gold-500" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold">
                {(session?.user?.name ?? 'U').charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-navy-900 text-sm">{session?.user?.name}</p>
              <p className="text-gold-500 text-xs font-medium">{session?.user?.role}</p>
            </div>
          </div>

          <NavLink href="/pengawas" icon={<Upload className="w-4 h-4" />} label="Upload Bukti" pathname={pathname} onClick={closeMenu} />
          <NavLink href="/pengawas/riwayat" icon={<ClipboardList className="w-4 h-4" />} label="Riwayat" pathname={pathname} onClick={closeMenu} />
          {isAdmin && (
            <>
              <NavLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard Verifikasi" pathname={pathname} onClick={closeMenu} />
              <NavLink href="/admin/pengguna" icon={<Users className="w-4 h-4" />} label="Kelola Pengguna" pathname={pathname} onClick={closeMenu} />
              <NavLink href="/admin/departemen" icon={<Building2 className="w-4 h-4" />} label="Kelola Departemen" pathname={pathname} onClick={closeMenu} />
            </>
          )}
        </div>
      )}
    </nav>
  );
}
