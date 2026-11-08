'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useList } from '@/lib/list';
import ShopCard from '@/components/ShopCard';
import Toolbar from '@/components/Toolbar';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { Loader } from '@/components/Loader';

export default function ShopsPage() {
  const [shops, setShops] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/shops').then(setShops).catch((e) => { setError(e.message); setShops([]); });
  }, []);

  const list = useList(shops || [], {
    text: (s) => s.name + ' ' + (s.description || ''),
    sorts: { name: (a, b) => a.name.localeCompare(b.name) },
    pageSize: 6,
  });

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Shops</h1>
          <p className="text-muted mb-0">Pick a shop and see what it sells.</p>
        </div>
      </div>

      <div className="container py-4">
        <Toolbar q={list.q} onSearch={list.setQ} placeholder="Search shops..." />

        {error && <div className="alert alert-danger">{error}</div>}
        {!shops && <Loader text="Loading shops..." />}
        {shops && !error && list.total === 0 && <EmptyState icon="bi-shop" title="No shops found" text="Try a different search." />}

        <div className="row g-4">
          {list.rows.map((shop) => (
            <div className="col-md-6 col-lg-4" key={shop.id}>
              <ShopCard shop={shop} />
            </div>
          ))}
        </div>

        <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />
      </div>
    </>
  );
}
