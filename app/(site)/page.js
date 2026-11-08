'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useSettings } from '@/components/SettingsProvider';
import ProductCard from '@/components/ProductCard';
import ShopCard from '@/components/ShopCard';
import ContactSection from '@/components/ContactSection';
import EmptyState from '@/components/EmptyState';
import { CardSkeletons, Loader } from '@/components/Loader';

export default function HomePage() {
  const { settings } = useSettings();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [shops, setShops] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/shops').then(setShops).catch((e) => { setError(e.message); setShops([]); });
    api('/products?limit=8').then(setProducts).catch(() => setProducts([]));
  }, []);

  function search(e) {
    e.preventDefault();
    router.push('/products' + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : ''));
  }

  return (
    <>
      <section className="hero">
        <div className="container position-relative">
          <h1>{settings.hero_title}</h1>
          <p>{settings.hero_subtitle}</p>
          <form className="hero-search" onSubmit={search}>
            <i className="bi bi-search"></i>
            <input className="form-control" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
          </form>
        </div>
      </section>

      <div className="container">
        {error && <div className="alert alert-danger mt-4">{error}</div>}

        <div className="section-head">
          <h3>Latest products</h3>
          <Link href="/products" className="section-link">View all products <i className="bi bi-arrow-right ms-1"></i></Link>
        </div>
        {!products && <CardSkeletons count={4} />}
        {products && products.length === 0 && <EmptyState icon="bi-box-seam" title="No products yet" text="Shops have not listed anything so far." />}
        <div className="row g-4">
          {products && products.map((p) => (
            <div className="col-6 col-lg-3" key={p.shop.id + '-' + p.id}>
              <ProductCard shopId={p.shop.id} product={p} currency={settings.currency} showShop />
            </div>
          ))}
        </div>

        <div className="section-head">
          <h3>Shops</h3>
          <Link href="/shops" className="section-link">View all shops <i className="bi bi-arrow-right ms-1"></i></Link>
        </div>
        {!shops && <Loader text="Loading shops..." />}
        {shops && shops.length === 0 && !error && <EmptyState icon="bi-shop" title="No shops yet" text="Check back soon." />}
        <div className="row g-4">
          {shops && shops.slice(0, 3).map((shop) => (
            <div className="col-md-6 col-lg-4" key={shop.id}>
              <ShopCard shop={shop} />
            </div>
          ))}
        </div>
      </div>

      <ContactSection />
    </>
  );
}
