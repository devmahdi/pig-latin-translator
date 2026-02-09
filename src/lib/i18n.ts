import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import de from '@/locales/de.json';
import pt from '@/locales/pt.json';

export const locales = ['en', 'es', 'fr', 'de', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
};

const translations = { en, es, fr, de, pt };

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

export function getLocaleFromParam(param?: string): Locale {
  if (param && locales.includes(param as Locale)) {
    return param as Locale;
  }
  return defaultLocale;
}

export type Translations = typeof en;
