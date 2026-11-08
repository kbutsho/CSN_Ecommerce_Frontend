export default function Toolbar({ q, onSearch, placeholder = 'Search...', selects = [], children }) {
  return (
    <div className="toolbar">
      <div className="search-box">
        <i className="bi bi-search"></i>
        <input className="form-control" placeholder={placeholder} value={q} onChange={(e) => onSearch(e.target.value)} />
      </div>
      {selects.map((sel, i) => (
        <select key={i} className="form-select toolbar-select" value={sel.value} onChange={(e) => sel.onChange(e.target.value)}>
          {sel.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ))}
      {children && <div className="toolbar-actions">{children}</div>}
    </div>
  );
}
