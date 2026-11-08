export function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-wrap">
      <div className="loader-ring"></div>
      <div className="loader-text">{text}</div>
    </div>
  );
}

export function CardSkeletons({ count = 4 }) {
  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="col-6 col-lg-3" key={i}>
          <div className="pcard">
            <div className="skeleton" style={{ aspectRatio: '4 / 3' }}></div>
            <div className="pcard-body">
              <div className="skeleton mb-2" style={{ height: 16, width: '70%' }}></div>
              <div className="skeleton mb-3" style={{ height: 12, width: '95%' }}></div>
              <div className="skeleton" style={{ height: 18, width: '35%' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Shimmering rows shown inside a table while data loads.
export function TableSkeleton({ cols = 4, rows = 5 }) {
  return Array.from({ length: rows }).map((_, r) => (
    <tr key={r}>
      {Array.from({ length: cols }).map((_, c) => (
        <td key={c}><div className="skeleton" style={{ height: 14, width: c === 0 ? '80%' : '60%' }}></div></td>
      ))}
    </tr>
  ));
}
