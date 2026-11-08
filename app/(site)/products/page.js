'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useList } from '@/lib/list';
import { useSettings } from '@/components/SettingsProvider';
import ProductCard from '@/components/ProductCard';
import Toolbar from '@/components/Toolbar';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { CardSkeletons } from '@/components/Loader';

const sorts = {
  new: (a, b) => b.id - a.id,
  name: (a, b) => a.name.localeCompare(b.name),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

export default function ProductsPage() {
  const { settings } = useSettings();
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/products').then(setProducts).catch((e) => { setError(e.message); setProducts([]); });
  }, []);

  const list = useList(products || [], {
    text: (p) => p.name + ' ' + (p.details || '') + ' ' + p.shop.name,
    filter: (p, v) => String(p.shop.id) === v,
    sorts,
    pageSize: 12,
  });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) list.setQ(q);
  }, []);

  const shops = useMemo(() => {
    const seen = {};
    (products || []).forEach((p) => { seen[p.shop.id] = p.shop.name; });
    return Object.keys(seen).map((id) => ({ value: id, label: seen[id] }));
  }, [products]);

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Products</h1>
          <p className="text-muted mb-0">Everything the shops sell, with each shop's own price.</p>
        </div>
      </div>

      <div className="container py-4">
        <Toolbar
          q={list.q}
          onSearch={list.setQ}
          placeholder="Search products or shops..."
          selects={[
            { value: list.f, onChange: list.setF, options: [{ value: 'all', label: 'All shops' }, ...shops] },
            {
              value: list.s,
              onChange: list.setS,
              options: [
                { value: 'new', label: 'Newest first' },
                { value: 'name', label: 'Name: A to Z' },
                { value: 'low', label: 'Price: low to high' },
                { value: 'high', label: 'Price: high to low' },
              ],
            },
          ]}
        />

        {error && <div className="alert alert-danger">{error}</div>}
        {!products && <CardSkeletons count={8} />}
        {products && !error && list.total === 0 && <EmptyState icon="bi-box-seam" title="No products found" text="Try a different search or shop." />}

        <div className="row g-4">
          {list.rows.map((p) => (
            <div className="col-6 col-lg-3" key={p.shop.id + '-' + p.id}>
              <ProductCard shopId={p.shop.id} product={p} currency={settings.currency} showShop />
            </div>
          ))}
        </div>

        <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />
      </div>
    </>
  );
}
