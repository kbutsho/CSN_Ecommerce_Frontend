'use client';
import Link from 'next/link';
import { useSettings } from '@/components/SettingsProvider';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4 footer-top">
          <div className="col-lg-5">
            <Link href="/" className="brand brand-light mb-3">
              <span className="brand-mark"><i className="bi bi-bag-heart-fill"></i></span>
              {settings.site_name}
            </Link>
            <p className="footer-about">Browse local shops, compare their own prices and find the products you like, all in one place.</p>
          </div>

          <div className="col-6 col-lg-3 offset-lg-1">
            <div className="footer-head">Explore</div>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/shops">Shops</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
              <li><Link href="/login">Login</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-3">
            <div className="footer-head">Contact</div>
            <ul className="footer-links footer-contact">
              {settings.contact_email && <li><i className="bi bi-envelope"></i><a href={'mailto:' + settings.contact_email}>{settings.contact_email}</a></li>}
              {settings.contact_phone && <li><i className="bi bi-telephone"></i><span>{settings.contact_phone}</span></li>}
              {settings.contact_address && <li><i className="bi bi-geo-alt"></i><span>{settings.contact_address}</span></li>}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span><span suppressHydrationWarning>© {new Date().getFullYear()}</span> {settings.site_name}. All rights reserved.</span>
          <span>Developed by <a className='ms-2' href="https://kbutsho-v2.vercel.app/" target="_blank" rel="noreferrer">kbutsho</a></span>
        </div>
      </div>
    </footer>
  );
}
