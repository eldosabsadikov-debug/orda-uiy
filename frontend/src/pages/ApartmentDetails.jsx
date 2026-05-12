import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery.jsx";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { formatPrice, labelFor } from "../utils/format.js";
import { mockProperties } from "../data/mockProperties.js";
import { DetailSkeleton } from "../components/Skeletons.jsx";

export default function ApartmentDetails() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getProperty(id)
      .then((data) => active && setProperty(data.property))
      .catch(() => active && setProperty(mockProperties.find((item) => item.id === id) || null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
    <section className="page-section">
      <DetailSkeleton />
      </section>
      );
    }

  if (!property) {
    return <section className="page-section"><div className="container"><div className="empty-state">{t("apartments.empty")}</div></div></section>;
  }

  const title = lang === "kk" ? property.titleKk : property.titleRu;
  const description = lang === "kk" ? property.descriptionKk : property.descriptionRu;
  return (
    <section className="page-section">
      <div className="container detail-layout">
        <ImageGallery images={property.images} title={title} />
        <article className="detail-card">
          <p className="property-meta"><span>{labelFor(t, "type", property.propertyType)}</span><span>{labelFor(t, "deal", property.dealType)}</span></p>
          <h1>{title}</h1>
          <p className="detail-price">{formatPrice(property.price)}</p>
          <div className="detail-list">
            <div><strong>{t("details.city")}</strong><span>{property.city}</span></div>
            {property.district && <div><strong>{t("details.district")}</strong><span>{property.district}</span></div>}
            {property.address && <div><strong>{t("details.address")}</strong><span>{property.address}</span></div>}
            {property.rooms && <div><strong>{t("details.rooms")}</strong><span>{property.rooms}</span></div>}
            {property.area && <div><strong>{t("details.area")}</strong><span>{property.area} м²</span></div>}
            {property.floor && <div><strong>{t("details.floor")}</strong><span>{property.floor}{property.totalFloors ? `/${property.totalFloors}` : ""}</span></div>}
          </div>
          {description && <><h2>{t("details.description")}</h2><p className="detail-description">{description}</p></>}
          {property.extraNotes && <><h2>{t("details.extraNotes")}</h2><p className="detail-description">{property.extraNotes}</p></>}
          {(property.phone || property.otherContacts) && (
            <div className="detail-actions">
              {property.phone && <p className="phone-text"><strong>{t("contacts.phone")}:</strong><br />{property.phone}</p>}
              {property.otherContacts && <p className="other-contacts"><strong>{t("contacts.other")}:</strong><br />{property.otherContacts}</p>}
            </div>
          )}
          <Link className="back-link" to="/apartments">← {t("form.back")}</Link>
        </article>
      </div>
    </section>
  );
}
