export function formatPrice(value) {
  if (!value && value !== 0) return "";
  return `${Number(value).toLocaleString("ru-RU")} ₸`;
}

export function labelFor(t, group, value) {
  return t(`${group}.${value}`) || value;
}

export function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}
