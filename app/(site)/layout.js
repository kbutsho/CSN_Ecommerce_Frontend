import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';

export default function SiteLayout({ children }) {
  return (
    <div className="site-wrap">
      <PublicNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
