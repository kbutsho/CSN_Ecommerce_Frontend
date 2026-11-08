'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { useSettings } from '@/components/SettingsProvider';
import { Loader } from '@/components/Loader';

export default function AdminSettings() {
  const toast = useToast();
  const { settings, setSettings } = useSettings();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/settings').then(setForm).catch((e) => setError(e.message));
  }, []);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api('/admin/settings', 'PUT', form);
      setSettings({ ...settings, ...data });
      toast.success('Settings saved.');
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  if (!form) return error ? <div className="alert alert-danger">{error}</div> : <Loader />;

  return (
    <div className="row">
      <div className="col-xl-12">
        <form className="card-box" onSubmit={save}>
          <h5 className="mb-1">Site settings</h5>
          <p className="text-muted">These texts and contact details appear on the customer pages.</p>


          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Site name</label>
              <input className="form-control" value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Currency symbol</label>
              <input className="form-control" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Home page title</label>
              <input className="form-control" value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Home page sub title</label>
              <textarea className="form-control" rows="2" value={form.hero_subtitle || ''} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}></textarea>
            </div>
          </div>

          <h6 className="fw-bold mt-4 mb-3">Contact details</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Contact email</label>
              <input type="email" className="form-control" value={form.contact_email || ''} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Contact phone</label>
              <input className="form-control" value={form.contact_phone || ''} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <input className="form-control" value={form.contact_address || ''} onChange={(e) => setForm({ ...form, contact_address: e.target.value })} />
            </div>
          </div>

          <button className="btn btn-brand mt-4 px-4" disabled={busy}>
            {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Save settings
          </button>
        </form>
      </div>
    </div>
  );
}
