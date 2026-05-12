import { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { PropertyGridSkeleton } from "../components/Skeletons.jsx";
import { api } from "../api/client.js";
import { buildQuery } from "../utils/format.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { mockProperties } from "../data/mockProperties.js";

const PAGE_LIMIT = 12;

export default function Apartments() {
  const { t } = useLanguage();

  const [filters, setFilters] = useState({
    city: "Қызылорда",
    sort: "newest"
  });

  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offline, setOffline] = useState(false);

  const query = useMemo(() => {
    return buildQuery({
      ...filters,
      page,
      limit: PAGE_LIMIT
    });
  }, [filters, page]);

  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  useEffect(() => {
    let active = true;

    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    api.getProperties(query)
      .then((data) => {
        if (!active) return;

        const nextProperties = data.properties || [];

        setProperties((prev) => (
          page === 1 ? nextProperties : [...prev, ...nextProperties]
        ));

        setPagination(data.pagination || null);
        setOffline(false);
      })
      .catch(() => {
        if (!active) return;

        if (page === 1) {
          setProperties(mockProperties);
          setPagination(null);
        }

        setOffline(true);
      })
      .finally(() => {
        if (!active) return;

        setLoading(false);
        setLoadingMore(false);
      });

    return () => {
      active = false;
    };
  }, [query, page]);

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow dark">Orda Uiy</p>
          <h1>{t("apartments.title")}</h1>
          <p>{t("apartments.subtitle")}</p>
        </div>

        <FilterBar value={filters} onChange={handleFiltersChange} />

        {offline && (
          <p className="notice">
            Сервер қосылмаған / Сервер не подключен. Демо нысандар көрсетілді.
          </p>
        )}

        {loading ? (
          <PropertyGridSkeleton count={6} />
        ) : properties.length ? (
          <>
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {pagination?.hasNext && (
              <div className="pagination-actions">
                <button
                  className="yellow-btn"
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={loadingMore}
                >
                  {loadingMore ? t("common.loading") : t("common.showMore")}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">{t("apartments.empty")}</div>
        )}
      </div>
    </section>
  );
}