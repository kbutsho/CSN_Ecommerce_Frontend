'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, flash, getUser, saveLogin } from '@/lib/api';
import { useSettings } from '@/components/SettingsProvider';
import { useToast } from '@/components/ToastProvider';

const demoAccounts = [
  { email: 'admin@gmail.com', role: 'Admin', note: 'Manage shops, products and owners', icon: 'bi-shield-check', tone: 'admin' },
  { email: 'owner1@gmail.com', role: 'Shop owner', note: 'Manage your own shop and prices', icon: 'bi-shop', tone: 'owner' },
];

export default function LoginPage() {
  const { settings } = useSettings();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) window.location.href = user.role === 'admin' ? '/admin' : '/owner';
  }, []);

  function fillDemo(account) {
    setEmail(account.email);
    setPassword('Password#0000');
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api('/login', 'POST', { email, password });
      saveLogin(data.token, data.user);
      flash('success', 'Welcome back, ' + data.user.name + '!');
      window.location.href = data.user.role === 'admin' ? '/admin' : '/owner';
    } catch (err) {
      toast.error(err.message, 'Login failed');
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Link href="/" className="brand brand-light">
          <span className="brand-mark" style={{ background: 'rgba(255,255,255,0.16)' }}><i className="bi bi-bag-heart-fill"></i></span>
          {settings.site_name}
        </Link>
        <div>
          <h2>Run your shop from one simple dashboard.</h2>
          <p className="mt-3">Manage products, prices and shops in one place.</p>
          <ul className="auth-points">
            <li><i className="bi bi-collection"></i>One shared product catalog for every shop</li>
            <li><i className="bi bi-tag"></i>Set your own price, details and picture</li>
            <li><i className="bi bi-shield-check"></i>Only listed products reach your customers</li>
          </ul>
        </div>
        <div className="small" style={{ color: '#9ccfc9' }}>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> {settings.site_name}</div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <h3 className="mb-1">Welcome back</h3>
          <p className="text-muted mb-4">Login to access your account.</p>

          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-icon">
                <i className="bi bi-envelope"></i>
                <input type="email" className="form-control" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} required />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-icon">
                <i className="bi bi-lock"></i>
                <input type={show ? 'text' : 'password'} className="form-control pe-5" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} required />
                <button type="button" className="pass-toggle" onClick={() => setShow(!show)} tabIndex={-1} aria-label="Show or hide password">
                  <i className={'bi ' + (show ? 'bi-eye-slash' : 'bi-eye')}></i>
                </button>
              </div>
            </div>
            <button className="btn btn-brand w-100 py-2" disabled={busy}>
              {busy ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
              {busy ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="demo-box mt-4">
            <div className="demo-head">
              <span className="fw-bold">Demo accounts</span>
              {/* <span className="demo-pass">password: <code>Password#0000</code></span> */}
            </div>
            <div className="demo-list">
              {demoAccounts.map((a) => (
                <button type="button" key={a.email} className={'demo-card' + (email === a.email ? ' active' : '')} onClick={() => fillDemo(a)} disabled={busy}>
                  <span className={'demo-ico ' + a.tone}><i className={'bi ' + a.icon}></i></span>
                  <span className="demo-text">
                    <span className="demo-role">{a.role}</span>
                    <span className="demo-mail">{a.email}</span>
                  </span>
                  <span className="demo-use">Use</span>
                </button>
              ))}
            </div>
            <div className="demo-hint">Click an account to fill the email and password.</div>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="text-decoration-none small fw-semibold"><i className="bi bi-arrow-left me-1"></i>Back to store</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
