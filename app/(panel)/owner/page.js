'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, getUser } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { Loader } from '@/components/Loader';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    api('/dashboard').then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <Loader text="Loading dashboard..." />;

  return (
    <>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Hello, {user ? user.name : 'there'}</h4>
        <div className="text-muted">{data.shop ? 'Your shop: ' + data.shop.name : 'No shop is assigned to your account yet.'}</div>
      </div>

      {!data.shop && (
        <div className="alert alert-warning">Please ask the admin to assign a shop to your account. Then you can add products.</div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-4"><StatCard icon="bi-bag-check" label="Products in my shop" value={data.stats.listed} /></div>
        <div className="col-sm-6 col-xl-4"><StatCard icon="bi-collection" label="Products in catalog" value={data.stats.catalog} tone="blue" /></div>
        <div className="col-sm-6 col-xl-4"><StatCard icon="bi-plus-square" label="Products I created" value={data.stats.created} tone="amber" /></div>
      </div>

      <h6 className="fw-bold mb-3">Quick actions</h6>
      <div className="row g-3">
        <div className="col-md-6">
          <Link href="/owner/catalog" className="quick-link">
            <i className="bi main bi-collection"></i>
            <div><div className="fw-bold">Browse the catalog</div><div className="small text-muted">Add products from other shops and the admin</div></div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link href="/owner/products" className="quick-link">
            <i className="bi main bi-box-seam"></i>
            <div><div className="fw-bold">My products</div><div className="small text-muted">Change prices and pictures or create a product</div></div>
          </Link>
        </div>
      </div>
    </>
  );
}
