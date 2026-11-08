'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ICONS = { success: 'bi-check-lg', error: 'bi-x-lg', info: 'bi-info-lg', warning: 'bi-exclamation-lg' };
const TITLES = { success: 'Success', error: 'Something went wrong', info: 'Heads up', warning: 'Warning' };
const LIFETIME = 4500;

const ToastContext = createContext({ success() { }, error() { }, info() { }, warning() { } });

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, LIFETIME);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={'toast-item ' + toast.type} role="status">
      <span className="toast-icon"><i className={'bi ' + ICONS[toast.type]}></i></span>
      <div className="toast-text">
        <div className="toast-title">{toast.title}</div>
        <div className="toast-msg">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>
      <span className="toast-bar" style={{ animationDuration: LIFETIME + 'ms' }}></span>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const counter = useRef(0);

  const remove = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback((type, message, title) => {
    const id = ++counter.current;
    setItems((list) => [...list.slice(-3), { id, type, message, title: title || TITLES[type] }]);
  }, []);

  const toast = useMemo(() => ({
    success: (message, title) => push('success', message, title),
    error: (message, title) => push('error', message, title),
    info: (message, title) => push('info', message, title),
    warning: (message, title) => push('warning', message, title),
  }), [push]);

  useEffect(() => {
    function readFlash() {
      const raw = sessionStorage.getItem('flash');
      if (!raw) return;
      sessionStorage.removeItem('flash');
      try {
        const f = JSON.parse(raw);
        push(f.type, f.message);
      } catch (e) { }
    }
    readFlash();
    window.addEventListener('flash', readFlash);
    return () => window.removeEventListener('flash', readFlash);
  }, [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack">
        {items.map((t) => <Toast key={t.id} toast={t} onClose={() => remove(t.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
