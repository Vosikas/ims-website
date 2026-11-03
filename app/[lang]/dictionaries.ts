import type en from "./dictionaries/en.json";
import type { Locale } from "./locales";

export type Dictionary = typeof en;

// Typing every entry as Dictionary makes a missing translation a compile error.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  el: () => import("./dictionaries/el.json").then((module) => module.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
