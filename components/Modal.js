'use client';
import { useEffect } from 'react';

export default function Modal({ show, title, onClose, size = '', hideHeader = false, children }) {
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;
  return (
    <>
      <div className="modal d-block app-modal" tabIndex="-1" onClick={onClose}>
        <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable ' + size} onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            {!hideHeader && (
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="modal-x" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>
              </div>
            )}
            <div className={'modal-body' + (hideHeader ? ' p-4' : '')}>{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}
