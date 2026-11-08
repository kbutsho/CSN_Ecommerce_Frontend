'use client';
import { useEffect, useState } from 'react';
import { api, money } from '@/lib/api';
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

const emptyForm = { name: '', description: '', user_id: '' };

export default function AdminShops() {
  const toast = useToast();
  const { settings } = useSettings();
  const [shops, setShops] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const [s, o] = await Promise.all([api('/admin/shops'), api('/admin/owners')]);
    setShops(s);
    setOwners(o);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const list = useList(shops, {
    text: (s) => s.name + ' ' + (s.description || '') + ' ' + (s.owner ? s.owner.name : ''),
    filter: (s, v) => (v === 'owner' ? !!s.owner : !s.owner),
    sorts: { new: (a, b) => b.id - a.id, name: (a, b) => a.name.localeCompare(b.name) },
    pageSize: 6,
  });

  function openForm(shop) {
    setForm(shop ? { name: shop.name, description: shop.description || '', user_id: shop.user_id || '' } : emptyForm);
    setEditId(shop ? shop.id : null);
    setError('');
    setFormOpen(true);
  }

  async function openDetails(shop) {
    setDetails({ ...shop, products: null });
    try {
      setDetails(await api('/admin/shops/' + shop.id));
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
      const body = { ...form, user_id: form.user_id || null };
      if (editId) await api('/admin/shops/' + editId, 'PUT', body);
      else await api('/admin/shops', 'POST', body);
      setFormOpen(false);
      toast.success(editId ? 'Shop updated successfully.' : 'Shop created successfully.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    try {
      await api('/admin/shops/' + deleting.id, 'DELETE');
      setDeleting(null);
      toast.success('Shop deleted.');
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
        placeholder="Search shops or owners..."
        selects={[
          { value: list.f, onChange: list.setF, options: [{ value: 'all', label: 'All shops' }, { value: 'owner', label: 'With owner' }, { value: 'none', label: 'No owner' }] },
          { value: list.s, onChange: list.setS, options: [{ value: 'new', label: 'Newest first' }, { value: 'name', label: 'Name: A to Z' }] },
        ]}
      >
        <button className="btn btn-brand" onClick={() => openForm(null)}><i className="bi bi-plus-lg me-2"></i>Add shop</button>
      </Toolbar>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="table-wrap">
        <table className="table-modern">
          <thead>
            <tr><th>Shop</th><th>Owner</th><th>Products</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton cols={4} />}
            {list.rows.map((shop) => (
              <tr key={shop.id}>
                <td>
                  <div className="cell-main">
                    <div className="avatar-sm"><i className="bi bi-shop"></i></div>
                    <div className="min-w-0">
                      <div className="cell-title">{shop.name}</div>
                      <div className="cell-sub">{shop.description || 'No description'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {shop.owner
                    ? <div><div className="fw-semibold">{shop.owner.name}</div><div className="small text-muted">{shop.owner.email}</div></div>
                    : <span className="badge-soft gray">No owner</span>}
                </td>
                <td><span className="badge-soft green">{shop.products_count} products</span></td>
                <td><RowActions onView={() => openDetails(shop)} onEdit={() => openForm(shop)} onDelete={() => setDeleting(shop)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && list.total === 0 && <EmptyState icon="bi-shop" title="No shops found" text="Add a shop or change your search." />}
      </div>

      <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />

      <Modal show={formOpen} title={editId ? 'Edit shop' : 'Add shop'} onClose={() => setFormOpen(false)}>
        <form onSubmit={save}>
          <div className="mb-3">
            <label className="form-label">Shop name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
          </div>
          <div className="mb-4">
            <label className="form-label">Shop owner</label>
            <select className="form-select" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })}>
              <option value="">No owner</option>
              {owners.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
            </select>
          </div>
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Save shop
          </button>
        </form>
      </Modal>

      <Modal show={!!details} title={details ? details.name : ''} onClose={() => setDetails(null)}>
        {details && (
          <>
            <p className="text-muted">{details.description || 'No description.'}</p>
            <div className="detail-row"><span className="text-muted">Owner</span><span className="fw-semibold">{details.owner ? details.owner.name : 'No owner'}</span></div>
            <h6 className="fw-bold mt-4 mb-3">Products in this shop</h6>
            {!details.products && <Loader text="Loading..." />}
            {details.products && details.products.length === 0 && <div className="text-muted small">No products yet.</div>}
            {details.products && details.products.map((p) => (
              <div className="d-flex align-items-center gap-3 py-2" key={p.id}>
                <div className="table-thumb"><Thumb src={p.thumbnail} alt={p.name} /></div>
                <div className="flex-grow-1 fw-semibold">{p.name}</div>
                <div className="price fs-6">{money(p.price, settings.currency)}</div>
              </div>
            ))}
          </>
        )}
      </Modal>

      <ConfirmModal
        show={!!deleting}
        title="Delete shop?"
        text={deleting ? '"' + deleting.name + '" will be removed. Its products stay in the catalog.' : ''}
        busy={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
