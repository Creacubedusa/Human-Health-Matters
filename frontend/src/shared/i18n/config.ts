import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

// Always start with 'en'. The user picks their language on the SelectLanguage
// screen; _layout.tsx restores the saved choice from SecureStore before the
// splash hides, so the device locale is never needed at init time.
//
// initImmediate:false — forces synchronous init so i18n.isInitialized is true
// before any module that imports this file can render a component.
//
// I18nextProvider (in _layout.tsx) is the source of truth for useTranslation().
// It bypasses getI18n() entirely, eliminating the i18next v23 race where
// afterInit (which calls setI18n) fires asynchronously even with initImmediate:false.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
    initImmediate: false,
    react: { useSuspense: false },
  });
}

export default i18n;
