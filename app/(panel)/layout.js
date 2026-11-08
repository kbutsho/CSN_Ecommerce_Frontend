import Guard from '@/components/Guard';
import PanelShell from '@/components/PanelShell';

export default function PanelLayout({ children }) {
  return (
    <Guard>
      <PanelShell>{children}</PanelShell>
    </Guard>
  );
}
