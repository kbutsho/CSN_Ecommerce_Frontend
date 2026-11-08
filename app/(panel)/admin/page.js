'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, getUser } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { Loader } from '@/components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    api('/dashboard').then((d) => setStats(d.stats)).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <Loader text="Loading dashboard..." />;

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Hello, {user ? user.name : 'Admin'}</h4>
        <div className="text-muted">Here is what is happening in your store.</div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon="bi-shop" label="Shops" value={stats.shops} /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-box-seam" label="Products" value={stats.products} tone="blue" /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-people" label="Shop owners" value={stats.owners} tone="amber" /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-eye-slash" label="Hidden products" value={stats.unlisted} tone="rose" note="Not in any shop" /></div>
      </div>

      <h6 className="fw-bold mb-3">Quick actions</h6>
      <div className="row g-3">
        {[
          { href: '/admin/shops', icon: 'bi-shop', title: 'Manage shops', text: 'Add shops and assign owners' },
          { href: '/admin/products', icon: 'bi-box-seam', title: 'Manage products', text: 'Build the shared catalog' },
          { href: '/admin/owners', icon: 'bi-people', title: 'Shop owners', text: 'Create owner accounts' },
          { href: '/admin/settings', icon: 'bi-gear', title: 'Site settings', text: 'Name, texts and currency' },
        ].map((q) => (
          <div className="col-sm-6 col-xl-3" key={q.href}>
            <Link href={q.href} className="quick-link">
              <i className={'bi main ' + q.icon}></i>
              <div>
                <div className="fw-bold">{q.title}</div>
                <div className="small text-muted">{q.text}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
