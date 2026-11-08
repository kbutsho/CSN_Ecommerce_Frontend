'use client';
import { useEffect, useState } from 'react';
import { api, money, toFormData } from '@/lib/api';
import { useList } from '@/lib/list';
import { useToast } from '@/components/ToastProvider';
import { useSettings } from '@/components/SettingsProvider';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toolbar from '@/components/Toolbar';
import Pagination from '@/components/Pagination';
import RowActions from '@/components/RowActions';
import EmptyState from '@/components/EmptyState';
import Thumb from '@/components/Thumb';
import { Loader, TableSkeleton } from '@/components/Loader';

const emptyForm = { name: '', description: '', thumbnail: null };

export default function AdminProducts() {
  const toast = useToast();
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setProducts(await api('/admin/products'));
    setLoading(false);
  }

  useEffect(() => {
    load().catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const list = useList(products, {
    text: (p) => p.name + ' ' + (p.description || ''),
    filter: (p, v) => (v === 'listed' ? p.shops_count > 0 : p.shops_count === 0),
    sorts: { new: (a, b) => b.id - a.id, name: (a, b) => a.name.localeCompare(b.name) },
    pageSize: 6,
  });

  function openForm(p) {
    setForm(p ? { name: p.name, description: p.description || '', thumbnail: null } : emptyForm);
    setEditId(p ? p.id : null);
    setError('');
    setFormOpen(true);
  }

  async function openDetails(p) {
    setDetails({ ...p, shops: null });
    try {
      setDetails(await api('/admin/products/' + p.id));
    } catch (e) {
      setDetails(null);
      toast.error(e.message);
    }
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editId) await api('/admin/products/' + editId, 'POST', toFormData(form, true));
      else await api('/admin/products', 'POST', toFormData(form));
      setFormOpen(false);
      toast.success(editId ? 'Product updated successfully.' : 'Product created successfully.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    try {
      await api('/admin/products/' + deleting.id, 'DELETE');
      setDeleting(null);
      toast.success('Product deleted.');
      await load();
    } catch (err) {
      toast.error(err.message);
      setDeleting(null);
    }
    setBusy(false);
  }

  return (
    <div className="card-box">
      <Toolbar
        q={list.q}
        onSearch={list.setQ}
        placeholder="Search products..."
        selects={[
          { value: list.f, onChange: list.setF, options: [{ value: 'all', label: 'All products' }, { value: 'listed', label: 'Listed in a shop' }, { value: 'hidden', label: 'Hidden from customers' }] },
          { value: list.s, onChange: list.setS, options: [{ value: 'new', label: 'Newest first' }, { value: 'name', label: 'Name: A to Z' }] },
        ]}
      >
        <button className="btn btn-brand" onClick={() => openForm(null)}><i className="bi bi-plus-lg me-2"></i>Add product</button>
      </Toolbar>

      {error && <div className="alert alert-danger py-2">{error}</div>}

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
                      <div className="cell-sub">{p.description || 'No description'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {p.shops_count > 0
                    ? <span className="badge-soft green"><i className="bi bi-check-circle"></i>In {p.shops_count} {p.shops_count === 1 ? 'shop' : 'shops'}</span>
                    : <span className="badge-soft amber"><i className="bi bi-eye-slash"></i>Hidden</span>}
                </td>
                <td><RowActions onView={() => openDetails(p)} onEdit={() => openForm(p)} onDelete={() => setDeleting(p)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && list.total === 0 && <EmptyState icon="bi-box-seam" title="No products found" text="Add a product or change your search." />}
      </div>

      <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />

      <Modal show={formOpen} title={editId ? 'Edit product' : 'Add product'} onClose={() => setFormOpen(false)}>
        <form onSubmit={save}>
          <div className="mb-3">
            <label className="form-label">Product name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
          </div>
          <div className="mb-4">
            <label className="form-label">Thumbnail</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })} />
            <div className="form-text">Without a picture a demo image is shown.</div>
          </div>
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Save product
          </button>
        </form>
      </Modal>

      <Modal show={!!details} title="Product details" onClose={() => setDetails(null)}>
        {details && (
          <>
            <div className="detail-img mb-3"><Thumb src={details.thumbnail} alt={details.name} /></div>
            <h5 className="fw-bold">{details.name}</h5>
            <p className="text-muted">{details.description || 'No description.'}</p>
            <h6 className="fw-bold mt-4 mb-2">Sold in</h6>
            {!details.shops && <Loader text="Loading..." />}
            {details.shops && details.shops.length === 0 && <div className="text-muted small">Not in any shop. Customers cannot see this product.</div>}
            {details.shops && details.shops.map((s) => (
              <div className="detail-row" key={s.id}>
                <span className="fw-semibold">{s.name}</span>
                <span className="price fs-6">{money(s.price, settings.currency)}</span>
              </div>
            ))}
          </>
        )}
      </Modal>

      <ConfirmModal
        show={!!deleting}
        title="Delete product?"
        text={deleting ? '"' + deleting.name + '" will be removed from the catalog and from every shop.' : ''}
        busy={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
