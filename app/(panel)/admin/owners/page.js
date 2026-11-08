'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Avatar from '@/components/Avatar';
import { useList } from '@/lib/list';
import { useToast } from '@/components/ToastProvider';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import Toolbar from '@/components/Toolbar';
import Pagination from '@/components/Pagination';
import RowActions from '@/components/RowActions';
import EmptyState from '@/components/EmptyState';
import { TableSkeleton } from '@/components/Loader';

const emptyForm = { name: '', email: '', password: '' };

export default function AdminOwners() {
  const toast = useToast();
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
    setOwners(await api('/admin/owners'));
    setLoading(false);
  }

  useEffect(() => {
    load().catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const list = useList(owners, {
    text: (o) => o.name + ' ' + o.email + ' ' + (o.shop ? o.shop.name : ''),
    filter: (o, v) => (v === 'shop' ? !!o.shop : !o.shop),
    sorts: { new: (a, b) => b.id - a.id, name: (a, b) => a.name.localeCompare(b.name) },
    pageSize: 6,
  });

  function openForm(owner) {
    setForm(owner ? { name: owner.name, email: owner.email, password: '' } : emptyForm);
    setEditId(owner ? owner.id : null);
    setError('');
    setFormOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editId) await api('/admin/owners/' + editId, 'PUT', form);
      else await api('/admin/owners', 'POST', form);
      setFormOpen(false);
      toast.success(editId ? 'Owner updated successfully.' : 'Owner created successfully.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    try {
      await api('/admin/owners/' + deleting.id, 'DELETE');
      setDeleting(null);
      toast.success('Owner deleted.');
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
        placeholder="Search owners..."
        selects={[
          { value: list.f, onChange: list.setF, options: [{ value: 'all', label: 'All owners' }, { value: 'shop', label: 'With shop' }, { value: 'none', label: 'Without shop' }] },
          { value: list.s, onChange: list.setS, options: [{ value: 'new', label: 'Newest first' }, { value: 'name', label: 'Name: A to Z' }] },
        ]}
      >
        <button className="btn btn-brand" onClick={() => openForm(null)}><i className="bi bi-plus-lg me-2"></i>Add owner</button>
      </Toolbar>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="table-wrap">
        <table className="table-modern">
          <thead>
            <tr><th>Owner</th><th>Shop</th><th className="text-end">Actions</th></tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton cols={3} />}
            {list.rows.map((o) => (
              <tr key={o.id}>
                <td>
                  <div className="cell-main">
                    <Avatar user={o} size={40} />
                    <div className="min-w-0">
                      <div className="cell-title">{o.name}</div>
                      <div className="cell-sub">{o.email}</div>
                    </div>
                  </div>
                </td>
                <td>{o.shop ? <span className="badge-soft green"><i className="bi bi-shop"></i>{o.shop.name}</span> : <span className="badge-soft gray">No shop yet</span>}</td>
                <td><RowActions onView={() => setDetails(o)} onEdit={() => openForm(o)} onDelete={() => setDeleting(o)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && list.total === 0 && <EmptyState icon="bi-people" title="No owners found" text="Add a shop owner or change your search." />}
      </div>

      <Pagination page={list.page} pages={list.pages} total={list.total} pageSize={list.pageSize} onChange={list.setPage} />

      <Modal show={formOpen} title={editId ? 'Edit owner' : 'Add owner'} onClose={() => setFormOpen(false)}>
        <form onSubmit={save}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editId} />
            {editId && <div className="form-text">Leave empty to keep the old password.</div>}
          </div>
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Save owner
          </button>
        </form>
      </Modal>

      <Modal show={!!details} title="Owner details" onClose={() => setDetails(null)}>
        {details && (
          <>
            <div className="text-center mb-3">
              <div className="d-flex justify-content-center mb-2"><Avatar user={details} size={72} /></div>
              <h5 className="fw-bold mb-0">{details.name}</h5>
            </div>
            <div className="detail-row"><span className="text-muted">Email</span><span className="fw-semibold">{details.email}</span></div>
            <div className="detail-row"><span className="text-muted">Shop</span><span className="fw-semibold">{details.shop ? details.shop.name : 'No shop yet'}</span></div>
          </>
        )}
      </Modal>

      <ConfirmModal
        show={!!deleting}
        title="Delete owner?"
        text={deleting ? deleting.name + ' will not be able to login any more. Their shop stays but has no owner.' : ''}
        busy={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
