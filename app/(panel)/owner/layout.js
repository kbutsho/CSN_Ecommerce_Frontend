import Guard from '@/components/Guard';

export default function OwnerLayout({ children }) {
  return <Guard role="owner">{children}</Guard>;
}
