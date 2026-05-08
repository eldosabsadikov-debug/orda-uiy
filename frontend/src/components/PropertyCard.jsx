import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { formatPrice, labelFor } from "../utils/format.js";
import ImageLightbox from "./ImageLightbox.jsx";

export default function PropertyCard({ property }) {
  const { lang, t } = useLanguage();

  const title = lang === "kk" ? property.titleKk : property.titleRu;
  const description = lang === "kk" ? property.descriptionKk : property.descriptionRu;
  const images = property.images?.length ? property.images : ["/images/no-image.svg"];

  const [imageIndex, setImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasManyImages = images.length > 1;

  function previousImage(event) {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function nextImage(event) {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  function openLightbox() {
    setLightboxOpen(true);
  }

  function handleImageKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox();
    }
  }

  return (
    <>
      <article className="property-card">
        <div
          className="property-image-wrap clickable-image"
          role="button"
          tabIndex={0}
          aria-label={title}
          onClick={openLightbox}
          onKeyDown={handleImageKeyDown}
        >
          <img
            className="property-image"
            src={images[imageIndex]}
            alt={title || t("common.noImage")}
            loading="lazy"
            decoding="async"
          />

          {hasManyImages && (
            <>
              <button className="property-image-nav property-image-prev" type="button" onClick={previousImage} aria-label={t("common.previous")}>‹</button>
              <button className="property-image-nav property-image-next" type="button" onClick={nextImage} aria-label={t("common.next")}>›</button>
              <span className="property-image-count">{imageIndex + 1}/{images.length}</span>
            </>
          )}
        </div>

        <div className="property-body">
          <div className="property-meta">
            <span>{labelFor(t, "type", property.propertyType)}</span>
            <span>{labelFor(t, "deal", property.dealType)}</span>
          </div>

          <h3>{title}</h3>
          <p className="property-price">{formatPrice(property.price)}</p>
          <p className="property-place">{property.city}{property.district ? `, ${property.district}` : ""}</p>

          <p className="property-specs">
            {property.area ? `${property.area} м²` : ""}
            {property.rooms ? ` · ${property.rooms}` : ""}
            {property.floor ? ` · ${property.floor}${property.totalFloors ? `/${property.totalFloors}` : ""}` : ""}
          </p>

          {description && <p className="property-short">{description}</p>}

          <Link className="yellow-link" to={`/apartments/${property.id}`}>
            {t("common.more")}
          </Link>
        </div>
      </article>

      <ImageLightbox
        images={images}
        startIndex={imageIndex}
        title={title}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}