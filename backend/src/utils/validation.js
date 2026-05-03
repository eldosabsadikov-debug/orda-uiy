export function toNumberOrNull(value) {
  if (value === "" || value === undefined || value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizePropertyInput(body) {
  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

  return {
    titleKk: String(body.titleKk || "").trim(),
    titleRu: String(body.titleRu || "").trim(),
    descriptionKk: String(body.descriptionKk || "").trim(),
    descriptionRu: String(body.descriptionRu || "").trim(),
    price: Number(body.price),
    city: String(body.city || "").trim(),
    district: String(body.district || "").trim(),
    address: body.address ? String(body.address).trim() : null,
    propertyType: body.propertyType || "apartment",
    dealType: body.dealType || "sale",
    rooms: toNumberOrNull(body.rooms),
    area: toNumberOrNull(body.area),
    floor: toNumberOrNull(body.floor),
    totalFloors: toNumberOrNull(body.totalFloors),
    yearBuilt: toNumberOrNull(body.yearBuilt),
    residentialComplex: body.residentialComplex || null,
    material: body.material || null,
    kitchenArea: toNumberOrNull(body.kitchenArea),
    ceilingHeight: toNumberOrNull(body.ceilingHeight),
    bathroom: body.bathroom || null,
    balcony: body.balcony || null,
    furniture: body.furniture || null,
    mortgageAvailable: Boolean(body.mortgageAvailable),
    instagram: body.instagram || null,
    phone: body.phone || null,
    whatsapp: body.whatsapp || null,
    extraNotes: body.extraNotes || null,
    otherContacts: body.otherContacts ? String(body.otherContacts).trim() : null,
    landArea: toNumberOrNull(body.landArea),
    houseArea: toNumberOrNull(body.houseArea),
    images,
    status: body.status || "active"
  };
}

export function validateProperty(data) {
  const required = ["titleKk", "titleRu", "descriptionKk", "descriptionRu", "price", "city", "district", "propertyType", "dealType", "status"];
  const missing = required.filter((key) => data[key] === undefined || data[key] === null || data[key] === "" || Number.isNaN(data[key]));
  if (missing.length) {
    const error = new Error(`Міндетті өрістер толтырылмаған / Заполните обязательные поля: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }
}
