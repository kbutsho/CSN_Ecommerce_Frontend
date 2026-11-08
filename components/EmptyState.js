export default function EmptyState({ icon = 'bi-inbox', title, text }) {
  return (
    <div className="empty-state">
      <i className={'bi ' + icon}></i>
      <div className="fw-semibold">{title}</div>
      {text && <div className="small text-muted">{text}</div>}
    </div>
  );
}
