'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useList } from '@/lib/list';
import { useSettings } from '@/components/SettingsProvider';
import ProductCard from '@/components/ProductCard';
import Toolbar from '@/components/Toolbar';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { CardSkeletons } from '@/components/Loader';

const sorts = {
  name: (a, b) => a.name.localeCompare(b.name),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

export default function ShopPage() {
  const { id } = useParams();
  const { settings } = useSettings();
  const [shop, setShop] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/shops/' + id).then(setShop).catch((e) => setError(e.message));
  }, [id]);

  const list = useList(shop ? shop.products : [], {
    text: (p) => p.name + ' ' + (p.details || ''),
    sorts,
    pageSize: 8,
  });

  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="crumbs"><Link href="/shops">Shops</Link> / {shop ? shop.name : '...'}</div>
          <h1>{shop ? shop.name : 'Loading...'}</h1>
          <p className="text-muted mb-0">{shop && shop.description}</p>
        </div>
      </div>

      <div className="container pt-4">
        <Toolbar
          q={list.q}
          onSearch={list.setQ}
          placeholder="Search products in this shop..."
          selects={[{
            value: list.s,
            onChange: list.setS,
            options: [
              { value: 'name', label: 'Name: A to Z' },
              { value: 'low', label: 'Price: low to high' },
              { value: 'high', label: 'Price: high to low' },
            ],
          }]}
        />

        {!shop && <CardSkeletons count={8} />}
        {shop && list.total === 0 && <EmptyState icon="bi-box-seam" title="No products found" text="This shop has nothing to show right now." />}

        <div className="row g-4">
          {list.rows.map((p) => (
            <div className="col-6 col-lg-3" key={p.id}>
              <ProductCard shopId={shop.id} product={p} currency={settings.currency} />
            </div>
          ))}
        </div>

        <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />
      </div>
    </>
  );
}
