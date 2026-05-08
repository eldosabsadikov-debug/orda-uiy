import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ImageLightbox({
  images = [],
  startIndex = 0,
  title = "",
  isOpen,
  onClose
}) {
  const { t } = useLanguage();

  const safeImages = useMemo(
    () => (images.length ? images : ["/images/no-image.svg"]),
    [images]
  );

  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) setIndex(startIndex);
  }, [isOpen, startIndex]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, safeImages.length]);

  function previous() {
    setIndex((current) => (current === 0 ? safeImages.length - 1 : current - 1));
  }

  function next() {
    setIndex((current) => (current === safeImages.length - 1 ? 0 : current + 1));
  }

  if (!isOpen) return null;

  const activeImage = safeImages[index] || safeImages[0];
  const hasMany = safeImages.length > 1;

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <button
        className="lightbox-backdrop"
        type="button"
        onClick={onClose}
        aria-label={t("common.close")}
      />

      <div className="lightbox-panel">
        <button
          className="lightbox-close"
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          ×
        </button>

        {hasMany && (
          <button
            className="lightbox-nav lightbox-prev"
            type="button"
            onClick={previous}
            aria-label={t("common.previous")}
          >
            ‹
          </button>
        )}

        <img
          className="lightbox-image"
          src={activeImage}
          alt={title || t("common.noImage")}
        />

        {hasMany && (
          <button
            className="lightbox-nav lightbox-next"
            type="button"
            onClick={next}
            aria-label={t("common.next")}
          >
            ›
          </button>
        )}

        <div className="lightbox-footer">
          {hasMany && <span>{index + 1} / {safeImages.length}</span>}
        </div>
      </div>
    </div>
  );
}