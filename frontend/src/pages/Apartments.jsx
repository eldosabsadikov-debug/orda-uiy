import { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { api } from "../api/client.js";
import { buildQuery } from "../utils/format.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { mockProperties } from "../data/mockProperties.js";

export default function Apartments() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({ city: "Қызылорда", sort: "newest" });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const query = useMemo(() => buildQuery(filters), [filters]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getProperties(query)
      .then((data) => {
        if (!active) return;
        setProperties(data.properties || []);
        setOffline(false);
      })
      .catch(() => {
        if (!active) return;
        setProperties(mockProperties);
        setOffline(true);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [query]);

  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow dark">Orda Uiy</p>
          <h1>{t("apartments.title")}</h1>
          <p>{t("apartments.subtitle")}</p>
        </div>

        <FilterBar value={filters} onChange={setFilters} />
        {offline && <p className="notice">Сервер қосылмаған / Сервер не подключен. Демо нысандар көрсетілді.</p>}
        {loading ? (
          <p>{t("common.loading")}</p>
        ) : properties.length ? (
          <div className="properties-grid">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        ) : (
          <div className="empty-state">{t("apartments.empty")}</div>
        )}
      </div>
    </section>
  );
}
