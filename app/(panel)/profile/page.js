'use client';
import { useEffect, useRef, useState } from 'react';
import { api, getUser, toFormData, updateStoredUser } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import Avatar from '@/components/Avatar';

export default function ProfilePage() {
  const toast = useToast();
  const fileInput = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getUser();
    setForm({ name: user.name, email: user.email, password: '' });
    setRole(user.role);
    setCurrentAvatar(user.avatar_url || null);
  }, []);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function pick(e) {
    const chosen = e.target.files[0];
    e.target.value = '';
    if (!chosen) return;
    if (!chosen.type.startsWith('image/')) return toast.error('Please choose an image file.');
    if (chosen.size > 2 * 1024 * 1024) return toast.error('The image must be smaller than 2 MB.');
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
    setRemoveAvatar(false);
  }

  function removePhoto() {
    setFile(null);
    setPreview(null);
    setRemoveAvatar(true);
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const body = toFormData({ ...form, avatar: file, remove_avatar: removeAvatar ? '1' : '' }, true);
      const user = await api('/profile', 'POST', body);
      updateStoredUser(user);
      setCurrentAvatar(user.avatar_url || null);
      setFile(null);
      setPreview(null);
      setRemoveAvatar(false);
      setForm({ ...form, password: '' });
      toast.success('Your profile has been updated.');
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }

  const shownAvatar = preview || (removeAvatar ? null : currentAvatar);

  return (
    <form className="row g-4 profile-row" onSubmit={save}>
      <div className="col-lg-4">
        <div className="card-box profile-card h-100">
          <div className="profile-photo">
            <Avatar src={shownAvatar} size={128} />
            <button type="button" className="photo-btn" onClick={() => fileInput.current.click()} title="Change photo">
              <i className="bi bi-camera-fill"></i>
            </button>
          </div>
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={pick} />

          <h5 className="fw-bold mb-1 mt-3">{form.name}</h5>
          <div className="text-muted small mb-3">{form.email}</div>
          <span className="badge-soft green">{role === 'admin' ? 'Administrator' : 'Shop owner'}</span>

          <div className="d-flex gap-2 mt-4">
            <button type="button" className="btn btn-outline-brand btn-sm px-3" onClick={() => fileInput.current.click()}>
              <i className="bi bi-upload me-2"></i>{shownAvatar ? 'Change photo' : 'Upload photo'}
            </button>
            {shownAvatar && (
              <button type="button" className="btn btn-outline-danger btn-sm px-3" onClick={removePhoto}>
                <i className="bi bi-trash3 me-2"></i>Remove
              </button>
            )}
          </div>
          <div className="form-text mt-2">{file || removeAvatar ? 'Press Save changes to apply.' : 'JPG or PNG, up to 2 MB.'}</div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="card-box h-100 d-flex flex-column">
          <h5 className="mb-1">Edit profile</h5>
          <p className="text-muted">Change your name, email, password or photo.</p>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">New password</label>
              <input type="password" className="form-control" placeholder="Leave empty to keep your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <div className="mt-auto pt-4">
            <button className="btn btn-brand px-4" disabled={busy}>
              {busy && <span className="spinner-border spinner-border-sm me-2"></span>}Save changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
