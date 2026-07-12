import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";
import ar from "./locales/ar/translation.json";

export const SUPPORTED_LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

const STORAGE_KEY = "ecommerce_language";

// Applique la direction (LTR/RTL) et la langue sur <html> à chaque changement
function applyDocumentDirection(language) {
  const lang = SUPPORTED_LANGUAGES.find((item) => item.code === language);
  document.documentElement.lang = language;
  document.documentElement.dir = lang?.dir || "ltr";
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: undefined,
    fallbackLng: "fr",
    supportedLngs: ["fr", "en", "ar"],
    detection: {
      // Seule une langue explicitement choisie (sauvegardée) doit changer la
      // langue par défaut : on ignore la locale du navigateur pour rester
      // cohérent avec une application française par défaut.
      order: ["localStorage"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

applyDocumentDirection(i18n.resolvedLanguage || i18n.language);

i18n.on("languageChanged", (language) => {
  applyDocumentDirection(language);
});

export default i18n;
