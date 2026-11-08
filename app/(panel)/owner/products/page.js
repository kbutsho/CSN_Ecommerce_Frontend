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
import { TableSkeleton } from '@/components/Loader';

const emptyNew = { name: '', description: '', price: '', thumbnail: null };

export default function OwnerProducts() {
  const toast = useToast();
  const { settings } = useSettings();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [details, setDetails] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', details: '', thumbnail: null });
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState(emptyNew);
  const [removing, setRemoving] = useState(null);

  async function load() {
    setShop(await api('/owner/shop'));
    setLoading(false);
  }

  useEffect(() => {
    load().catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const list = useList(shop ? shop.products : [], {
    text: (p) => p.name + ' ' + (p.details || ''),
    sorts: {
      name: (a, b) => a.name.localeCompare(b.name),
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
    },
    pageSize: 6,
  });

  function openEdit(p) {
    setEditForm({ price: p.price, details: p.details || '', thumbnail: null });
    setEditing(p);
    setError('');
  }

  async function saveEdit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/owner/shop-products/' + editing.id, 'POST', toFormData(editForm, true));
      setEditing(null);
      toast.success('Product updated successfully.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  async function saveNew(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/owner/products', 'POST', toFormData(newForm));
      setCreating(false);
      setNewForm(emptyNew);
      toast.success('Product created. It is in your shop and in the shared catalog now.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    try {
      await api('/owner/shop-products/' + removing.id, 'DELETE');
      setRemoving(null);
      toast.success('Product removed from your shop.');
      await load();
    } catch (err) {
      toast.error(err.message);
      setRemoving(null);
    }
    setBusy(false);
  }

  if (!loading && !shop) return <div className="alert alert-warning">{error}</div>;

  return (
    <div className="card-box">
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <Toolbar
        q={list.q}
        onSearch={list.setQ}
        placeholder="Search my products..."
        selects={[{
          value: list.s,
          onChange: list.setS,
          options: [
            { value: 'name', label: 'Name: A to Z' },
            { value: 'low', label: 'Price: low to high' },
            { value: 'high', label: 'Price: high to low' },
          ],
        }]}
      >
        <button className="btn btn-brand" onClick={() => { setNewForm(emptyNew); setError(''); setCreating(true); }}>
          <i className="bi bi-plus-lg me-2"></i>Create product
        </button>
      </Toolbar>

      <div className="table-wrap">
        <table className="table-modern">
          <thead>
            <tr><th>Product</th><th>My price</th><th className="text-end">Actions</th></tr>
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
                      <div className="cell-sub">{p.details}</div>
                    </div>
                  </div>
                </td>
                <td className="price fs-6">{money(p.price, settings.currency)}</td>
                <td><RowActions onView={() => setDetails(p)} onEdit={() => openEdit(p)} onDelete={() => setRemoving(p)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && list.total === 0 && <EmptyState icon="bi-box-seam" title="No products found" text="Add products from the catalog or create your own." />}
      </div>

      <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />

      <Modal show={!!details} title="Product details" onClose={() => setDetails(null)}>
        {details && (
          <>
            <div className="detail-img mb-3"><Thumb src={details.thumbnail} alt={details.name} /></div>
            <div className="d-flex justify-content-between align-items-start gap-3">
              <h5 className="fw-bold">{details.name}</h5>
              <div className="price fs-5">{money(details.price, settings.currency)}</div>
            </div>
            <p className="text-muted">{details.details || 'No details added.'}</p>
          </>
        )}
      </Modal>

      <Modal show={!!editing} title={editing ? 'Edit ' + editing.name : ''} onClose={() => setEditing(null)}>
        <form onSubmit={saveEdit}>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" step="0.01" min="0" className="form-control" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Details</label>
            <textarea className="form-control" rows="3" value={editForm.details} onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}></textarea>
          </div>
          <div className="mb-4">
            <label className="form-label">Thumbnail for my shop</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.files[0] })} />
            <div className="form-text">Leave empty to keep the current picture.</div>
          </div>
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Save changes
          </button>
        </form>
      </Modal>

      <Modal show={creating} title="Create product" onClose={() => setCreating(false)}>
        <form onSubmit={saveNew}>
          <div className="mb-3">
            <label className="form-label">Product name</label>
            <input className="form-control" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Price in my shop</label>
            <input type="number" step="0.01" min="0" className="form-control" value={newForm.price} onChange={(e) => setNewForm({ ...newForm, price: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Thumbnail</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setNewForm({ ...newForm, thumbnail: e.target.files[0] })} />
          </div>
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Create product
          </button>
        </form>
      </Modal>

      <ConfirmModal
        show={!!removing}
        title="Remove from my shop?"
        text={removing ? '"' + removing.name + '" will not be shown in your shop any more. It stays in the catalog.' : ''}
        confirmText="Remove" icon="bi-x-circle"
        busy={busy}
        onConfirm={remove}
        onClose={() => setRemoving(null)}
      />
    </div>
  );
}
