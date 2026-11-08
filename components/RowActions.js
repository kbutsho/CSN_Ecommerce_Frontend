export default function RowActions({ onView, onEdit, onDelete }) {
  return (
    <div className="row-actions">
      {onView && <button className="icon-btn view" title="View details" onClick={onView}><i className="bi bi-eye"></i></button>}
      {onEdit && <button className="icon-btn edit" title="Edit" onClick={onEdit}><i className="bi bi-pencil-square"></i></button>}
      {onDelete && <button className="icon-btn delete" title="Delete" onClick={onDelete}><i className="bi bi-trash3"></i></button>}
    </div>
  );
}
