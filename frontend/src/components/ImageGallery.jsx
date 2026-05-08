import { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import ImageLightbox from "./ImageLightbox.jsx";

export default function ImageGallery({ images = [], title }) {
  const { t } = useLanguage();
  const safeImages = images.length ? images : ["/images/no-image.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = safeImages[activeIndex] || safeImages[0];
  const hasMany = safeImages.length > 1;

  function previous() {
    setActiveIndex((index) => (index === 0 ? safeImages.length - 1 : index - 1));
  }

  function next() {
    setActiveIndex((index) => (index === safeImages.length - 1 ? 0 : index + 1));
  }

  return (
    <>
      <div className="gallery">
        <div className="gallery-main-wrap">
          <button
            className="gallery-main-button"
            type="button"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              className="gallery-main"
              src={active}
              alt={title || t("common.noImage")}
              loading="lazy"
              decoding="async"
            />
          </button>

          {hasMany && (
            <>
              <button className="image-nav image-nav-prev" type="button" onClick={previous} aria-label={t("common.previous")}>‹</button>
              <button className="image-nav image-nav-next" type="button" onClick={next} aria-label={t("common.next")}>›</button>
              <span className="image-count">{activeIndex + 1} / {safeImages.length}</span>
            </>
          )}
        </div>

        {hasMany && (
          <div className="gallery-thumbs">
            {safeImages.map((image, index) => (
              <button
                className={activeIndex === index ? "is-active" : ""}
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
              >
                <img src={image} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}
      </div>

      <ImageLightbox
        images={safeImages}
        startIndex={activeIndex}
        title={title}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}