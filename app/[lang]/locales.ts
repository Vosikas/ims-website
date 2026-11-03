export const locales = ["en", "el"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Holds the language a visitor picked with the GR/EN switch.
export const localeCookie = "locale";

export const hasLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);
