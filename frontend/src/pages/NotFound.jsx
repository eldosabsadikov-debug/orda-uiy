import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="page-section">
      <div className="container empty-state">
        <h1>{t("notFound.title")}</h1>
        <p>{t("notFound.text")}</p>
        <Link className="yellow-btn" to="/">Orda Uiy</Link>
      </div>
    </section>
  );
}
