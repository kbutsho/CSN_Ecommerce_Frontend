'use client';
import { useEffect, useState } from 'react';
import { api, toFormData } from '@/lib/api';
import { useList } from '@/lib/list';
import { useToast } from '@/components/ToastProvider';
import Modal from '@/components/Modal';
import Toolbar from '@/components/Toolbar';
import Pagination from '@/components/Pagination';
import RowActions from '@/components/RowActions';
import EmptyState from '@/components/EmptyState';
import Thumb from '@/components/Thumb';
import { TableSkeleton } from '@/components/Loader';

export default function OwnerCatalog() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [adding, setAdding] = useState(null);
  const [form, setForm] = useState({ price: '', details: '', thumbnail: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setProducts(await api('/owner/catalog'));
    setLoading(false);
  }

  useEffect(() => {
    load().catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const list = useList(products, {
    text: (p) => p.name + ' ' + (p.description || ''),
    filter: (p, v) => (v === 'in' ? p.in_shop : !p.in_shop),
    sorts: { name: (a, b) => a.name.localeCompare(b.name), new: (a, b) => b.id - a.id },
    pageSize: 6,
  });

  function openAdd(p) {
    setForm({ price: '', details: p.description || '', thumbnail: null });
    setAdding(p);
    setError('');
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/owner/shop-products', 'POST', toFormData({ ...form, product_id: adding.id }));
      setAdding(null);
      setDetails(null);
      toast.success('Product added to your shop.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  if (!loading && error && products.length === 0) return <div className="alert alert-warning">{error}</div>;

  return (
    <div className="card-box">

      <div className="mb-3">
        <h5 className="mb-1">Product catalog</h5>
        <div className="text-muted small">Products from the admin and all shops. Add them to your shop with your own price.</div>
      </div>

      <Toolbar
        q={list.q}
        onSearch={list.setQ}
        placeholder="Search the catalog..."
        selects={[
          { value: list.f, onChange: list.setF, options: [{ value: 'all', label: 'All products' }, { value: 'in', label: 'In my shop' }, { value: 'out', label: 'Not in my shop' }] },
          { value: list.s, onChange: list.setS, options: [{ value: 'name', label: 'Name: A to Z' }, { value: 'new', label: 'Newest first' }] },
        ]}
      />

      <div className="table-wrap">
        <table className="table-modern">
          <thead>
            <tr><th>Product</th><th>Status</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton cols={3} />}
            {list.rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="cell-main">
                    <div className="table-thumb"><Thumb src={p.thumbnail} alt={p.name} /></div>
                    <div className="min-w-0">
                      <div className="cell-title">{p.name}</div>
                      <div className="cell-sub">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td>{p.in_shop ? <span className="badge-soft green"><i className="bi bi-check-circle"></i>In my shop</span> : <span className="badge-soft gray">Not added</span>}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-btn view" title="View details" onClick={() => setDetails(p)}><i className="bi bi-eye"></i></button>
                    {!p.in_shop && <button className="btn btn-brand btn-sm" onClick={() => openAdd(p)}><i className="bi bi-plus-lg me-1"></i>Add</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && list.total === 0 && <EmptyState icon="bi-collection" title="No products found" text="Try a different search or filter." />}
      </div>

      <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />

      <Modal show={!!details} title="Product details" onClose={() => setDetails(null)}>
        {details && (
          <>
            <div className="detail-img mb-3"><Thumb src={details.thumbnail} alt={details.name} /></div>
            <h5 className="fw-bold">{details.name}</h5>
            <p className="text-muted">{details.description || 'No description.'}</p>
            {details.in_shop
              ? <span className="badge-soft green"><i className="bi bi-check-circle"></i>Already in your shop</span>
              : <button className="btn btn-brand w-100" onClick={() => { openAdd(details); setDetails(null); }}>Add to my shop</button>}
          </>
        )}
      </Modal>

      <Modal show={!!adding} title={adding ? 'Add ' + adding.name : ''} onClose={() => setAdding(null)}>
        <form onSubmit={save}>
          <div className="mb-3">
            <label className="form-label">Price in my shop</label>
            <input type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Details</label>
            <textarea className="form-control" rows="3" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })}></textarea>
          </div>
          <div className="mb-4">
            <label className="form-label">Thumbnail for my shop (optional)</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })} />
            <div className="form-text">Leave empty to use the catalog picture.</div>
          </div>
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Add to my shop
          </button>
        </form>
      </Modal>
    </div>
  );
}
