import { use } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en-EN.json";
import translationFR from "./locales/fr-FR.json";

const resources = {
	fr: { translation: translationFR },
	en: { translation: translationEN },
};

// detect user language
// learn more: https://github.com/i18next/i18next-browser-languageDetector
use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		resources,
		fallbackLng: "fr",
		debug: false,
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
		react: {
			transKeepBasicHtmlNodesFor: ["br", "strong", "i", "b"],
		},
	});

export default i18n;
