import Modal from '@/components/Modal';

export default function ConfirmModal({ show, title, text, confirmText = 'Delete', icon = 'bi-trash3', busy, onConfirm, onClose }) {
  return (
    <Modal show={show} onClose={busy ? () => { } : onClose} size="modal-sm" hideHeader>
      <div className="confirm-box">
        <div className="confirm-icon"><i className={'bi ' + icon}></i></div>
        <h5 className="confirm-title">{title}</h5>
        <p className="confirm-text">{text}</p>
        <div className="confirm-actions">
          <button className="btn btn-light border" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className={'bi ' + icon + ' me-2'}></i>}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
