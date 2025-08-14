import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar/translation.json";
import en from "./locales/en/ranslation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });
  //اتجاه النص
// i18n.on('languageChanged', (lng) => {
//   document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
//   document.documentElement.setAttribute('lang', lng);
// });
export default i18n;
