import { useEffect, useRef } from "react";

export default function Modal({ isOpen, onClose, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal is-open" aria-hidden="false">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-panel" role="dialog" aria-modal="true" tabIndex="-1" ref={panelRef}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Жабу / Закрыть">×</button>
        {children}
      </div>
    </div>
  );
}
