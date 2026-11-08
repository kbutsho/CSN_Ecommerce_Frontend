import Guard from '@/components/Guard';

export default function AdminLayout({ children }) {
  return <Guard role="admin">{children}</Guard>;
}
