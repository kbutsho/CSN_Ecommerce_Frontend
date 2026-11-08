export default function Pagination({ page, pages, total, pageSize, onChange }) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  let start = Math.max(1, page - 2);
  let end = Math.min(pages, start + 4);
  start = Math.max(1, end - 4);
  const numbers = [];
  for (let i = start; i <= end; i++) numbers.push(i);

  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 pt-3">
      <div className="small text-muted">Showing {from}-{to} of {total}</div>
      {pages > 1 && (
        <ul className="pagination pagination-sm mb-0">
          <li className={'page-item' + (page === 1 ? ' disabled' : '')}>
            <button className="page-link" onClick={() => onChange(page - 1)}><i className="bi bi-chevron-left"></i></button>
          </li>
          {numbers.map((n) => (
            <li key={n} className={'page-item' + (n === page ? ' active' : '')}>
              <button className="page-link" onClick={() => onChange(n)}>{n}</button>
            </li>
          ))}
          <li className={'page-item' + (page === pages ? ' disabled' : '')}>
            <button className="page-link" onClick={() => onChange(page + 1)}><i className="bi bi-chevron-right"></i></button>
          </li>
        </ul>
      )}
    </div>
  );
}
