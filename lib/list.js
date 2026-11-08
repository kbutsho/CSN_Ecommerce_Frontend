import { useMemo, useState } from 'react';

export function useList(items, { text, filter, sorts, pageSize = 8 }) {
  const [q, setQ] = useState('');
  const [f, setF] = useState('all');
  const [s, setS] = useState(sorts ? Object.keys(sorts)[0] : '');
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    let list = items;
    const term = q.trim().toLowerCase();
    if (term) list = list.filter((item) => text(item).toLowerCase().includes(term));
    if (filter && f !== 'all') list = list.filter((item) => filter(item, f));
    if (sorts && s) list = [...list].sort(sorts[s]);
    return list;
  }, [items, q, f, s]);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages);

  return {
    rows: rows.slice((current - 1) * pageSize, current * pageSize),
    total: rows.length,
    page: current,
    pages,
    pageSize,
    setPage,
    q,
    f,
    s,
    setQ: (v) => { setQ(v); setPage(1); },
    setF: (v) => { setF(v); setPage(1); },
    setS: (v) => { setS(v); setPage(1); },
  };
}
