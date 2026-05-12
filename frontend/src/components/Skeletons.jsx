export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="properties-grid">
      {Array.from({ length: count }).map((_, index) => (
        <article className="property-card skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="property-body">
            <div className="skeleton skeleton-pill" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="container detail-layout">
      <div className="skeleton skeleton-detail-image" />
      <article className="detail-card">
        <div className="skeleton skeleton-pill" />
        <div className="skeleton skeleton-title large" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </article>
    </div>
  );
}

export function AdminListSkeleton({ count = 5 }) {
  return (
    <div className="admin-list">
      {Array.from({ length: count }).map((_, index) => (
        <article className="admin-item" key={index}>
          <div className="skeleton skeleton-admin-image" />
          <div>
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-line short" />
        </article>
      ))}
    </div>
  );
}