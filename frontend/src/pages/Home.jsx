import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const servicesItems = {
  kk: [
    "Договор 3 айға толтырылады.",
    "Договор толтыруға, фото және видео түсіруге ешқандай ақша төлемейсіз — барлығы тегін жасалады.",
    "Барлық әлеуметтік желілерге (Krisha, OLX, Instagram) жарнаманы біздің жылжымайтын мүлік агенттігі төлейді.",
    "Егер ипотека арқылы сатып алатын болсаңыз, банктегі барлық процестерді тездетуге және дұрыс жүруіне біз көмектесеміз. Сіз тек құжаттарға қол қою үшін ғана келесіз.",
    "Біздің комиссия тек үй сатылғаннан кейін ғана төленеді. Оған дейін ешқандай ақша төлемейсіз."
  ],
  ru: [
    "Договор заключается сроком на 3 месяца.",
    "За заключение договора, фото- и видеосъемку вы ничего не платите — все услуги предоставляются бесплатно.",
    "Размещение рекламы на всех платформах (Krisha, OLX, Instagram) оплачивает наше агентство недвижимости.",
    "Если недвижимость покупается через ипотеку, мы помогаем ускорить банковские процессы и следим за правильностью оформления. Вам нужно будет прийти только для подписания документов.",
    "Комиссию нашего агентства вы оплачиваете только после продажи недвижимости. До этого никаких платежей нет."
  ]
};

export default function Home() {
  const { lang, t } = useLanguage();
  const [modal, setModal] = useState(null);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <video className="hero-video hero-video-mobile" autoPlay muted loop playsInline preload="metadata" poster="/images/hero-mobile.png">
            <source src="/videos/videoplayback.mp4" type="video/mp4" />
          </video>
          <video className="hero-video hero-video-desktop" autoPlay muted loop playsInline preload="metadata" poster="/images/hero-desktop.png">
            <source src="/videos/videoplayback.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <p className="eyebrow">{t("hero.eyebrow")}</p>
          <h1 id="hero-title">Orda Uiy</h1>
          <p className="hero-text">{t("hero.text")}</p>
        </div>
      </section>

      <section className="quick-section" aria-labelledby="quick-title">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow dark">{t("quick.eyebrow")}</p>
            <h2 id="quick-title">{t("quick.title")}</h2>
            <p>{t("quick.text")}</p>
          </div>

          <div className="action-grid">
            <button className="action-card" type="button" onClick={() => setModal("services")}>
              <span className="card-number">01</span>
              <span className="card-title">{t("cards.services")}</span>
            </button>
            <button className="action-card" type="button" onClick={() => setModal("socials")}>
              <span className="card-number">02</span>
              <span className="card-title">{t("cards.socials")}</span>
            </button>
            <button className="action-card" type="button" onClick={() => setModal("contacts")}>
              <span className="card-number">03</span>
              <span className="card-title">{t("cards.contacts")}</span>
            </button>
            <Link className="action-card" to="/apartments">
            <span className="card-number">04</span>
            <span className="card-title">{t("cards.apartments")}</span>
            </Link>
          </div>
        </div>
      </section>

      <Modal isOpen={Boolean(modal)} onClose={() => setModal(null)}>
        {modal === "services" && (
          <div className="modal-content">
            <h2>{t("services.title")}</h2>
            <p><strong>{t("services.short")}</strong></p>
            <ol>{servicesItems[lang].map((item) => <li key={item}>{item}</li>)}</ol>
            <h3>{t("services.requirement")}</h3>
            <p>{t("services.reqText")}</p>
            <div className="modal-actions">
              <a href="/docs/dogovor.pdf" target="_blank" rel="noopener">{t("services.pdf")}</a>
            </div>
          </div>
        )}
        {modal === "socials" && (
          <div className="modal-content">
            <h2>{t("socials.title")}</h2>
            <div className="link-list">
              <a href="https://www.instagram.com/orda.uiy?igsh=bTk5anN5ZnNqeXVh" target="_blank" rel="noopener">Instagram</a>
              <a href="https://wa.me/77005022001" target="_blank" rel="noopener">WhatsApp</a>
              <a href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDEyNTE2NjMxMzA2OTUw?story_media_id=2522698430392837293&igsh=NHM0M3lwenIxamV4" target="_blank" rel="noopener">{t("socials.reviews")}</a>
            </div>
          </div>
        )}
        {modal === "contacts" && (
          <div className="modal-content">
            <h2>{t("contacts.title")}</h2>
            <p><strong>{t("contacts.phone")}:</strong> <a href="tel:+77005022001">8 700 502 20 01</a></p>
          </div>
        )}
      </Modal>
    </>
  );
}
