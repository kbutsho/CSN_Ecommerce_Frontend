'use client';
import { useState } from 'react';
import { useSettings } from '@/components/SettingsProvider';
import { useToast } from '@/components/ToastProvider';

export default function ContactSection() {
  const { settings } = useSettings();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function send(e) {
    e.preventDefault();
    const subject = 'Message from ' + form.name;
    const body = form.message + '\n\n' + form.name + '\n' + form.email;
    window.location.href = 'mailto:' + settings.contact_email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    toast.info('Opening your email app to send the message.');
    setForm({ name: '', email: '', message: '' });
  }

  const info = [
    { icon: 'bi-envelope', label: 'Email', value: settings.contact_email, href: 'mailto:' + settings.contact_email },
    { icon: 'bi-telephone', label: 'Phone', value: settings.contact_phone, href: 'tel:' + (settings.contact_phone || '').replace(/\s/g, '') },
    { icon: 'bi-geo-alt', label: 'Address', value: settings.contact_address },
  ].filter((i) => i.value);

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="row g-4 g-lg-5 align-items-stretch">
          <div className="col-lg-5">
            <h3 className="fw-bold mb-2">Contact us</h3>
            <p className="text-muted mb-4">Questions about a product or a shop? Send us a message and we will get back to you.</p>
            <div className="contact-list">
              {info.map((i) => (
                <div className="contact-item" key={i.label}>
                  <span className="contact-icon"><i className={'bi ' + i.icon}></i></span>
                  <div className="min-w-0">
                    <div className="contact-label">{i.label}</div>
                    {i.href ? <a href={i.href} className="contact-value">{i.value}</a> : <div className="contact-value">{i.value}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-7">
            <form className="contact-form" onSubmit={send}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Your name</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Your email</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required></textarea>
                </div>
              </div>
              <button className="btn btn-brand mt-3 px-4"><i className="bi bi-send me-2"></i>Send message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
