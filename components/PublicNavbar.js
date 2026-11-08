'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getUser } from '@/lib/api';
import { useSettings } from '@/components/SettingsProvider';

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/shops', label: 'Shops' },
  { href: '/#contact', label: 'Contact' },
];

export default function PublicNavbar() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href) {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <nav className="public-nav">
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/" className="brand">
          <span className="brand-mark"><i className="bi bi-bag-heart-fill"></i></span>
          {settings.site_name}
        </Link>

        <div className={'nav-menu' + (open ? ' open' : '')}>
          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={'nav-link-item' + (isActive(l.href) ? ' active' : '')}>{l.label}</Link>
            ))}
          </div>
          {user ? (
            <Link href={user.role === 'admin' ? '/admin' : '/owner'} className="btn btn-brand btn-sm px-3">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn btn-outline-brand btn-sm px-3">
              <i className="bi bi-box-arrow-in-right me-2"></i>Login
            </Link>
          )}
        </div>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          <i className={'bi ' + (open ? 'bi-x-lg' : 'bi-list')}></i>
        </button>
      </div>
    </nav>
  );
}
