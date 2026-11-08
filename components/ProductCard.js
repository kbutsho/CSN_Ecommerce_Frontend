import Link from 'next/link';
import Thumb from '@/components/Thumb';
import { money } from '@/lib/api';

export default function ProductCard({ shopId, product, currency, showShop = false }) {
  return (
    <Link href={'/shops/' + shopId + '/products/' + product.id} className="pcard">
      <div className="pcard-img"><Thumb src={product.thumbnail} alt={product.name} /></div>
      <div className="pcard-body">
        {showShop && product.shop && <div className="pcard-shop"><i className="bi bi-shop me-1"></i>{product.shop.name}</div>}
        <h6 className="pcard-title">{product.name}</h6>
        <p className="pcard-text">{product.details}</p>
        <div className="pcard-foot">
          <span className="price">{money(product.price, currency)}</span>
          <span className="pcard-go"><i className="bi bi-arrow-right"></i></span>
        </div>
      </div>
    </Link>
  );
}
