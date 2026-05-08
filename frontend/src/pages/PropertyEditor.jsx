import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_COUNT = 30;

const emptyForm = {
  title: "",
  description: "",
  titleKk: "",
  titleRu: "",
  descriptionKk: "",
  descriptionRu: "",
  price: "",
  city: "Қызылорда",
  district: "",
  address: "",
  propertyType: "apartment",
  dealType: "sale",
  rooms: "",
  area: "",
  floor: "",
  totalFloors: "",
  phone: "",
  otherContacts: "",
  status: "active",
  extraNotes: "",
  imagesText: ""
};

function parseImages(text) {
  return String(text || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PropertyEditor({ mode }) {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingImage, setRemovingImage] = useState("");

  const imageUrls = useMemo(() => parseImages(form.imagesText), [form.imagesText]);

  useEffect(() => {
    if (mode !== "edit") return;

    api.getProperty(id)
      .then((data) => {
        const p = data.property;

        setForm({
          ...emptyForm,
          ...p,
          title: lang === "kk" ? (p.titleKk || p.titleRu || "") : (p.titleRu || p.titleKk || ""),
          description: lang === "kk" ? (p.descriptionKk || p.descriptionRu || "") : (p.descriptionRu || p.descriptionKk || ""),
          otherContacts: p.otherContacts || "",
          imagesText: (p.images || []).join("\n")
        });
      })
      .finally(() => setLoading(false));
  }, [id, mode, lang]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setImages(urls) {
    update("imagesText", urls.join("\n"));
  }

  function payload() {
    const images = parseImages(form.imagesText);
    const title = form.title.trim();
    const description = form.description.trim();

    return {
      ...form,
      titleKk: title,
      titleRu: title,
      descriptionKk: description,
      descriptionRu: description,
      price: Number(form.price),
      rooms: form.rooms ? Number(form.rooms) : null,
      area: form.area ? Number(form.area) : null,
      floor: form.floor ? Number(form.floor) : null,
      totalFloors: form.totalFloors ? Number(form.totalFloors) : null,
      phone: form.phone.trim() || null,
      otherContacts: form.otherContacts.trim() || null,
      images
    };
  }

  async function handleUpload(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const tooLarge = files.find((file) => file.size > MAX_IMAGE_SIZE);

    if (tooLarge) {
      alert(t("form.imageSizeError"));
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const fd = new FormData();

      files.forEach((file) => fd.append("images", file));

      const data = await api.uploadImages(fd);
      const next = [...imageUrls, ...(data.urls || [])];

      setImages(next);
      event.target.value = "";
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(url) {
    if (!window.confirm(t("form.deleteImageConfirm"))) return;

    setRemovingImage(url);

    try {
      await api.deleteImages([url]);
      setImages(imageUrls.filter((image) => image !== url));
    } finally {
      setRemovingImage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (mode === "edit") {
        await api.updateProperty(id, payload());
      } else {
        await api.createProperty(payload());
      }

      navigate("/admin");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <p>{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container editor-wrap">
        <div className="page-heading compact">
          <p className="eyebrow dark">Orda Uiy</p>
          <h1>{mode === "edit" ? t("form.editTitle") : t("form.createTitle")}</h1>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>{t("form.basic")}</legend>

            <label>
              <span>{t("filters.type")}</span>
              <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} required>
                <option value="apartment">{t("type.apartment")}</option>
                <option value="house">{t("type.house")}</option>
                <option value="commercial">{t("type.commercial")}</option>
                <option value="land">{t("type.land")}</option>
              </select>
            </label>

            <label>
              <span>{t("filters.deal")}</span>
              <select value={form.dealType} onChange={(e) => update("dealType", e.target.value)} required>
                <option value="sale">{t("deal.sale")}</option>
                <option value="rent">{t("deal.rent")}</option>
                <option value="subrent">{t("deal.subrent")}</option>
              </select>
            </label>

            <label>
              <span>{t("form.status")}</span>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} required>
                <option value="active">{t("common.active")}</option>
                <option value="hidden">{t("common.hidden")}</option>
                <option value="draft">{t("common.draft")}</option>
              </select>
            </label>
          </fieldset>

          <fieldset>
            <legend>{t("form.texts")}</legend>
            <label>
              <span>{t("form.title")}</span>
              <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
            </label>

            <label className="full">
              <span>{t("form.description")}</span>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} required />
            </label>
          </fieldset>

          <fieldset>
            <legend>{t("form.location")}</legend>
            <label>
              <span>{t("form.price")}</span>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required />
            </label>

            <label>
              <span>{t("filters.city")}</span>
              <input value={form.city} onChange={(e) => update("city", e.target.value)} required />
            </label>

            <label>
              <span>{t("filters.district")}</span>
              <input value={form.district} onChange={(e) => update("district", e.target.value)} required />
            </label>

            <label>
              <span>{t("form.address")}</span>
              <input value={form.address} onChange={(e) => update("address", e.target.value)} />
            </label>
          </fieldset>

          <fieldset>
            <legend>{t("form.details")}</legend>

            <label>
              <span>{t("filters.rooms")}</span>
              <input
                type="number"
                value={form.rooms}
                onChange={(e) => update("rooms", e.target.value)}
                required={form.propertyType !== "land"}
              />
            </label>

            <label>
              <span>{t("form.area")}</span>
              <input type="number" value={form.area} onChange={(e) => update("area", e.target.value)} required />
            </label>

            <label>
              <span>{t("form.floor")}</span>
              <input type="number" value={form.floor} onChange={(e) => update("floor", e.target.value)} />
            </label>

            <label>
              <span>{t("form.totalFloors")}</span>
              <input type="number" value={form.totalFloors} onChange={(e) => update("totalFloors", e.target.value)} />
            </label>

            <label className="full">
              <span>{t("form.extraNotes")}</span>
              <textarea value={form.extraNotes} onChange={(e) => update("extraNotes", e.target.value)} />
            </label>
          </fieldset>

          <fieldset>
            <legend>{t("form.media")}</legend>

            <label className="full file-label">
              <span>{t("form.upload")}</span>
              <input type="file" accept="image/*" multiple onChange={handleUpload} />
              <small>{t("form.uploadHelp")}</small>
              {uploading && <em>{t("common.loading")}</em>}
            </label>

            {imageUrls.length > 0 && (
              <div className="full">
                <p className="preview-title">{t("form.currentImages")}</p>

                <div className="upload-preview-grid">
                  {imageUrls.map((url, index) => (
                    <div className="upload-preview-card" key={`${url}-${index}`}>
                      <img src={url} alt={`${t("form.currentImages")} ${index + 1}`} loading="lazy" decoding="async" />

                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        disabled={removingImage === url}
                        aria-label={t("form.removeImage")}
                      >
                        ×
                      </button>

                      <span>{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="full">
              <span>{t("form.imageUrls")}</span>
              <textarea value={form.imagesText} onChange={(e) => update("imagesText", e.target.value)} placeholder="https://..." />
            </label>
          </fieldset>

          <fieldset>
            <legend>{t("form.contacts")}</legend>

            <label>
              <span>{t("form.phone")}</span>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </label>

            <label className="full">
              <span>{t("form.otherContacts")}</span>
              <textarea value={form.otherContacts} onChange={(e) => update("otherContacts", e.target.value)} />
            </label>
          </fieldset>

          <div className="form-actions">
            <button className="yellow-btn" type="submit" disabled={saving}>
              {saving ? t("common.loading") : t("common.save")}
            </button>

            <Link className="ghost-btn" to="/admin">
              {t("common.cancel")}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}