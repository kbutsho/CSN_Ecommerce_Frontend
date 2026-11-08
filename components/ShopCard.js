import Link from 'next/link';
import Thumb from '@/components/Thumb';

export default function ShopCard({ shop }) {
  return (
    <Link href={'/shops/' + shop.id} className="shop-card">
      <div className="shop-strip">
        {[0, 1, 2].map((i) => (
          <div className="cell" key={i}>
            <Thumb src={shop.previews[i]} alt="" />
          </div>
        ))}
      </div>
      <div className="shop-body">
        <h5>{shop.name}</h5>
        <p>{shop.description || 'Welcome to our shop.'}</p>
        <div className="shop-meta">
          <span><i className="bi bi-box-seam me-2"></i>{shop.products_count} products</span>
          <span className="visit">Visit shop <i className="bi bi-arrow-right ms-1"></i></span>
        </div>
      </div>
    </Link>
  );
}
