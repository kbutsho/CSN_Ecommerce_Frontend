'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, clearLogin, flash, getUser } from '@/lib/api';
import { useSettings } from '@/components/SettingsProvider';
import Avatar from '@/components/Avatar';

const adminMenu = [
  { href: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2' },
  { href: '/admin/shops', label: 'Shops', icon: 'bi-shop' },
  { href: '/admin/products', label: 'Products', icon: 'bi-box-seam' },
  { href: '/admin/owners', label: 'Shop owners', icon: 'bi-people' },
  { href: '/profile', label: 'My profile', icon: 'bi-person-circle' },
  { href: '/admin/settings', label: 'Site settings', icon: 'bi-gear' },
];

const ownerMenu = [
  { href: '/owner', label: 'Dashboard', icon: 'bi-grid-1x2' },
  { href: '/owner/products', label: 'My products', icon: 'bi-box-seam' },
  { href: '/owner/catalog', label: 'Product catalog', icon: 'bi-collection' },
  { href: '/profile', label: 'My profile', icon: 'bi-person-circle' },
];

export default function PanelShell({ children }) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setCollapsed(localStorage.getItem('sidebar-hidden') === '1');
    const refresh = () => setUser(getUser());
    window.addEventListener('user-updated', refresh);
    return () => window.removeEventListener('user-updated', refresh);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function toggleSidebar() {
    if (window.innerWidth < 992) {
      setOpen(!open);
    } else {
      const next = !collapsed;
      setCollapsed(next);
      localStorage.setItem('sidebar-hidden', next ? '1' : '0');
    }
  }

  async function logout() {
    setLeaving(true);
    try {
      await api('/logout', 'POST');
    } catch (e) { }
    clearLogin();
    flash('success', 'You have been logged out.');
    router.replace('/login');
  }

  if (!user) return null;

  const menu = user.role === 'admin' ? adminMenu : ownerMenu;
  const current = menu.find((m) => m.href === pathname) || menu.find((m) => m.href !== '/admin' && m.href !== '/owner' && pathname.startsWith(m.href));

  return (
    <div className={'panel-shell' + (collapsed ? ' collapsed' : '')}>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>}

      <aside className={'sidebar' + (open ? ' open' : '')}>
        <Link href="/" className="brand brand-light">
          <span className="brand-mark"><i className="bi bi-bag-heart-fill"></i></span>
          {settings.site_name}
        </Link>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className={'side-link' + (item === current ? ' active' : '')}>
              <i className={'bi ' + item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="side-link side-logout" onClick={logout} disabled={leaving}>
            {leaving ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-box-arrow-right"></i>}
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="panel-main">
        <header className="topbar">
          <button className="menu-btn" onClick={toggleSidebar} title="Show or hide the sidebar" aria-label="Show or hide the sidebar">
            <i className="bi bi-list"></i>
          </button>
          <h5 className="mb-0 fw-bold">{current ? current.label : 'Dashboard'}</h5>
          <Link href="/" className="topbar-link" target="_blank"><i className="bi bi-box-arrow-up-right me-2"></i>View store</Link>
          <Link href="/profile" className="topbar-user" title="My profile">
            <Avatar user={user} size={38} />
            <span className="topbar-user-text">
              <span className="topbar-user-name">{user.name}</span>
              <span className="topbar-user-role">{user.role === 'admin' ? 'Administrator' : 'Shop owner'}</span>
            </span>
          </Link>
        </header>
        <div className="panel-content">{children}</div>
      </div>
    </div>
  );
}
