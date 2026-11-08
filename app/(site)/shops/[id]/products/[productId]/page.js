'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, money } from '@/lib/api';
import { useSettings } from '@/components/SettingsProvider';
import Thumb from '@/components/Thumb';
import ProductCard from '@/components/ProductCard';
import { Loader } from '@/components/Loader';

export default function ProductPage() {
  const { id, productId } = useParams();
  const { settings } = useSettings();
  const [product, setProduct] = useState(null);
  const [others, setOthers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setProduct(null);
    api('/shops/' + id + '/products/' + productId).then(setProduct).catch((e) => setError(e.message));
    api('/shops/' + id).then((shop) => setOthers(shop.products.filter((p) => String(p.id) !== String(productId)).slice(0, 4))).catch(() => { });
  }, [id, productId]);

  if (error) return <div className="container py-5"><div className="alert alert-danger">Product not found in this shop.</div></div>;
  if (!product) return <Loader text="Loading product..." />;

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="crumbs">
            <Link href="/shops">Shops</Link> / <Link href={'/shops/' + product.shop.id}>{product.shop.name}</Link> / {product.name}
          </div>
        </div>
      </div>

      <div className="container pt-4">
        <div className="row g-4 g-lg-5">
          <div className="col-md-6">
            <div className="detail-img"><Thumb src={product.thumbnail} alt={product.name} /></div>
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-2">{product.name}</h2>
            <div className="detail-price mb-3">{money(product.price, settings.currency)}</div>
            <p className="text-muted" style={{ lineHeight: 1.7 }}>{product.details || 'No details added yet.'}</p>

            <div className="mt-4">
              <div className="small text-muted fw-semibold mb-2">Sold by</div>
              <Link href={'/shops/' + product.shop.id} className="seller-box">
                <span className="brand-mark"><i className="bi bi-shop"></i></span>
                <span className="flex-grow-1 fw-bold">{product.shop.name}</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <>
            <div className="section-head"><h4 className="fw-bold m-0">More from {product.shop.name}</h4></div>
            <div className="row g-4">
              {others.map((p) => (
                <div className="col-6 col-lg-3" key={p.id}>
                  <ProductCard shopId={product.shop.id} product={p} currency={settings.currency} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
