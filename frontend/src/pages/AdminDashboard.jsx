import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { buildQuery, formatPrice, labelFor } from "../utils/format.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import ImageLightbox from "../components/ImageLightbox.jsx";
import { AdminListSkeleton } from "../components/Skeletons.jsx";

function AdminItemImage({ images = [], title }) {
  const safeImages = images.length ? images : ["/images/no-image.svg"];
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasMany = safeImages.length > 1;

  function previous(event) {
    event.stopPropagation();
    setIndex((current) => (current === 0 ? safeImages.length - 1 : current - 1));
  }

  function next(event) {
    event.stopPropagation();
    setIndex((current) => (current === safeImages.length - 1 ? 0 : current + 1));
  }

  return (
    <>
      <div
        className="admin-image-wrap clickable-image"
        role="button"
        tabIndex={0}
        onClick={() => setLightboxOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setLightboxOpen(true);
          }
        }}
      >
        <img src={safeImages[index]} alt={title} loading="lazy" decoding="async" />

        {hasMany && (
          <>
            <button className="admin-image-nav admin-image-prev" type="button" onClick={previous}>‹</button>
            <button className="admin-image-nav admin-image-next" type="button" onClick={next}>›</button>
            <span className="admin-image-count">{index + 1}/{safeImages.length}</span>
          </>
        )}
      </div>

      <ImageLightbox
        images={safeImages}
        startIndex={index}
        title={title}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", propertyType: "", dealType: "", sort: "newest" });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const query = useMemo(() => buildQuery({ ...filters, page, limit: 10 }), [filters, page]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getAdminProperties(query);
      setItems(data.properties || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [query]);

  async function remove(id) {
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    await api.deleteProperty(id);
    load();
  }

  async function toggleStatus(property) {
    const next = property.status === "active" ? "hidden" : "active";
    await api.changeStatus(property.id, next);
    load();
  }

  const activeCount = items.filter((item) => item.status === "active").length;
  const hiddenCount = items.filter((item) => item.status === "hidden").length;

  return (
    <section className="page-section admin-section">
      <div className="container">
        <div className="admin-top">
          <div>
            <p className="eyebrow dark">Orda Uiy</p>
            <h1>{t("admin.title")}</h1>
            <p>{t("admin.subtitle")}</p>
          </div>
          <Link className="yellow-btn" to="/admin/new">{t("admin.add")}</Link>
        </div>

        <div className="stats-grid">
          <div><strong>{items.length}</strong><span>{t("admin.total")}</span></div>
          <div><strong>{activeCount}</strong><span>{t("admin.active")}</span></div>
          <div><strong>{hiddenCount}</strong><span>{t("admin.hidden")}</span></div>
        </div>

        <div className="admin-filters">
          <input value={filters.search} onChange={(e) => { setPage(1); setFilters({ ...filters, search: e.target.value }); }} placeholder={t("common.search")} />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">{t("common.all")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="hidden">{t("common.hidden")}</option>
            <option value="draft">{t("common.draft")}</option>
          </select>
          <select value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}>
            <option value="">{t("filters.type")}</option>
            <option value="apartment">{t("type.apartment")}</option>
            <option value="house">{t("type.house")}</option>
            <option value="commercial">{t("type.commercial")}</option>
            <option value="land">{t("type.land")}</option>
          </select>
          <select value={filters.dealType} onChange={(e) => setFilters({ ...filters, dealType: e.target.value })}>
            <option value="">{t("filters.deal")}</option>
            <option value="sale">{t("deal.sale")}</option>
            <option value="rent">{t("deal.rent")}</option>
            <option value="subrent">{t("deal.subrent")}</option>
          </select>
        </div>

        {loading ? <AdminListSkeleton count={5} /> : (
          <div className="admin-list">
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination-actions">
                <button
                  className="ghost-btn"
                  type="button"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  {t("common.previous")}
                </button>

                <span className="pagination-info">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  className="ghost-btn"
                  type="button"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((current) => current + 1)}
                >
                  {t("common.next")}
                </button>
              </div>
            )}
            {items.map((property) => {
              const title = lang === "kk" ? property.titleKk : property.titleRu;
              return (
                <article className="admin-item" key={property.id}>
                  <AdminItemImage images={property.images} title={title} />
                  <div>
                    <h3>{title}</h3>
                    <p>{formatPrice(property.price)} · {property.city}{property.district ? `, ${property.district}` : ""}</p>
                    <p>{labelFor(t, "type", property.propertyType)} · {labelFor(t, "deal", property.dealType)}</p>
                  </div>
                  <span className={`status-pill status-${property.status}`}>{t(`common.${property.status}`)}</span>
                  <div className="admin-actions">
                    <Link className="small-btn" to={`/admin/edit/${property.id}`}>{t("common.edit")}</Link>
                    <button className="small-btn" type="button" onClick={() => toggleStatus(property)}>{property.status === "active" ? t("common.hide") : t("common.show")}</button>
                    <button className="small-btn danger" type="button" onClick={() => remove(property.id)}>{t("common.delete")}</button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
