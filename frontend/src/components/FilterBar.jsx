import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const initial = {
  search: "",
  propertyType: "",
  dealType: "",
  city: "Қызылорда",
  district: "",
  rooms: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest"
};

export default function FilterBar({ value, onChange }) {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrapRef = useRef(null);
  const filters = { ...initial, ...value };

  useEffect(() => {
    function handlePointerDown(event) {
      if (!wrapRef.current?.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    if (mobileOpen) document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [mobileOpen]);

  function update(key, next) {
    onChange({ ...filters, [key]: next });
  }

  function clear() {
    onChange(initial);
  }

  const fields = (
    <>
      <select value={filters.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
        <option value="">{t("filters.type")}</option>
        <option value="apartment">{t("type.apartment")}</option>
        <option value="house">{t("type.house")}</option>
        <option value="commercial">{t("type.commercial")}</option>
      </select>
      <select value={filters.dealType} onChange={(e) => update("dealType", e.target.value)}>
        <option value="">{t("filters.deal")}</option>
        <option value="sale">{t("deal.sale")}</option>
        <option value="rent">{t("deal.rent")}</option>
        <option value="subrent">{t("deal.subrent")}</option>
      </select>
      <input value={filters.city} onChange={(e) => update("city", e.target.value)} placeholder={t("filters.city")} />
      <input value={filters.district} onChange={(e) => update("district", e.target.value)} placeholder={t("filters.district")} />
      <select value={filters.rooms} onChange={(e) => update("rooms", e.target.value)}>
        <option value="">{t("filters.rooms")}</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4plus">4+</option>
      </select>
      <input type="number" value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)} placeholder={t("filters.minPrice")} />
      <input type="number" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} placeholder={t("filters.maxPrice")} />
      <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
        <option value="newest">{t("sort.newest")}</option>
        <option value="cheapest">{t("sort.cheapest")}</option>
        <option value="expensive">{t("sort.expensive")}</option>
      </select>
    </>
  );

  return (
    <div className="filters-wrap" ref={wrapRef}>
      <div className="search-line">
        <input value={filters.search} onChange={(e) => update("search", e.target.value)} placeholder={t("common.search")} />
        <button className="filter-toggle" type="button" onClick={() => setMobileOpen((v) => !v)}>{t("common.filter")}</button>
      </div>
      <div className="filters-grid desktop-filters">{fields}</div>
      {mobileOpen && (
        <div className="mobile-filter-panel">
          <div className="filters-grid">{fields}</div>
          <div className="filter-actions">
            <button className="yellow-btn" type="button" onClick={() => setMobileOpen(false)}>{t("common.apply")}</button>
            <button className="ghost-btn" type="button" onClick={clear}>{t("common.clear")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
