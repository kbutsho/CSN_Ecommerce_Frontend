export default function StatCard({ icon, label, value, tone = 'teal', note }) {
  return (
    <div className="stat-card">
      <div className={'stat-icon ' + tone}><i className={'bi ' + icon}></i></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {note && <div className="stat-note">{note}</div>}
      </div>
    </div>
  );
}
