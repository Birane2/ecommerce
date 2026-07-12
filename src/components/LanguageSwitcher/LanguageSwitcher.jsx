import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa6";
import { SUPPORTED_LANGUAGES } from "../../i18n/i18n";
import "./languageSwitcher.css";

// Sélecteur de langue : change i18next.language instantanément (pas de rechargement),
// la persistance en localStorage est gérée par i18next-browser-languagedetector.
function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.resolvedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  function handleSelect(code) {
    i18n.changeLanguage(code);
    setIsOpen(false);
  }

  return (
    <div className="language_switcher" ref={containerRef}>
      <button
        type="button"
        className="language_trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("nav.language")}
      >
        <FaGlobe />
        <span>{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div className="language_dropdown" role="menu">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              type="button"
              role="menuitem"
              key={language.code}
              className={`language_option ${
                language.code === currentLanguage.code ? "active" : ""
              }`}
              onClick={() => handleSelect(language.code)}
            >
              <span>{language.flag}</span>
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
