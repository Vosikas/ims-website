import {
  Commissioner,
  EB_Garamond,
  Figtree,
  Newsreader,
  Playfair_Display,
  Sacramento,
  Source_Serif_4,
} from "next/font/google";

// Shared by the site's layout and the Panhellenic exams login, so both load the same fonts.

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// The rest are each used by one language only (see globals.css), so they aren't preloaded.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  preload: false,
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["greek", "latin"],
  preload: false,
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  preload: false,
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["greek", "latin"],
  style: "italic",
  preload: false,
});

/** The CSS variables of every font, for the className of <html>. */
export const fontVariables = [
  figtree,
  playfair,
  newsreader,
  sacramento,
  commissioner,
  sourceSerif,
  garamond,
]
  .map((font) => font.variable)
  .join(" ");
