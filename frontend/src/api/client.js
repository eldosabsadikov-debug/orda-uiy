const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = localStorage.getItem("orda-uiy-token");

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request error");
  }

  return data;
}

export const api = {
  url: API_URL,
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  getProperties: (query = "") => request(`/api/properties${query}`),
  getProperty: (id) => request(`/api/properties/${id}`),
  getAdminProperties: (query = "") => request(`/api/admin/properties${query}`),
  createProperty: (payload) => request("/api/admin/properties", { method: "POST", body: JSON.stringify(payload) }),
  updateProperty: (id, payload) => request(`/api/admin/properties/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProperty: (id) => request(`/api/admin/properties/${id}`, { method: "DELETE" }),
  changeStatus: (id, status) => request(`/api/admin/properties/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  uploadImages: (formData) => request("/api/uploads", { method: "POST", body: formData }),
  deleteImages: (urls) => request("/api/uploads", { method: "DELETE", body: JSON.stringify({ urls }) })
};
