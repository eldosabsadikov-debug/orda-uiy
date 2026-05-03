import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("orda-uiy-token") || "");

  async function login(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem("orda-uiy-token", data.token);
    setToken(data.token);
    return data;
  }

  function logout() {
    localStorage.removeItem("orda-uiy-token");
    setToken("");
  }

  const value = useMemo(() => ({
    token,
    isAuthenticated: Boolean(token),
    login,
    logout
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
