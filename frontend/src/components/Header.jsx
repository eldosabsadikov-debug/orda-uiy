import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const headerRef = useRef(null);
  const { lang, setLang, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function closeMenus() {
    setMenuOpen(false);
    setAdminOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenus();
    navigate("/");
  }

  useEffect(() => {
    function handlePointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        closeMenus();
      }
    }

    if (menuOpen || adminOpen) {
      document.addEventListener("pointerdown", handlePointerDown);
    }

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen, adminOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Orda Uiy" onClick={closeMenus}>
          <img src="/images/logo.jpg" alt="Orda Uiy" className="brand-logo" />
        </Link>

        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Навигация">
          <NavLink to="/apartments" onClick={closeMenus}>{t("nav.apartments")}</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin" onClick={closeMenus}>{t("nav.admin")}</NavLink>
          )}
          {!isAuthenticated ? (
            <NavLink className="mobile-nav-action" to="/login" onClick={closeMenus}>{t("nav.login")}</NavLink>
          ) : (
            <button className="mobile-nav-action" type="button" onClick={handleLogout}>{t("nav.logout")}</button>
          )}
        </nav>

        <div className="header-actions">
          <div className="language-switcher" aria-label="Тіл таңдау / Выбор языка">
            <button className={`lang-btn ${lang === "kk" ? "is-active" : ""}`} type="button" onClick={() => setLang("kk")}>KZ</button>
            <span className="lang-divider">/</span>
            <button className={`lang-btn ${lang === "ru" ? "is-active" : ""}`} type="button" onClick={() => setLang("ru")}>RU</button>
          </div>

          {!isAuthenticated ? (
            <Link className="login-link desktop-login-link" to="/login" onClick={closeMenus}>{t("nav.login")}</Link>
          ) : (
            <div className="admin-menu">
              <button className="login-link" type="button" onClick={() => setAdminOpen((v) => !v)}>Admin ▼</button>
              {adminOpen && (
                <div className="admin-dropdown">
                  <button type="button" onClick={handleLogout}>{t("nav.logout")}</button>
                </div>
              )}
            </div>
          )}

          <button className="menu-toggle" type="button" aria-label="Мәзір / Меню" onClick={() => setMenuOpen((v) => !v)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
