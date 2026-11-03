import type { Metadata } from "next";
import { Figtree, Newsreader, Playfair_Display, Sacramento } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "IMS | International Metropolitan School",
  description:
    "Educating minds. Shaping futures. From the early years to university and beyond, IMS offers a complete and inspiring educational experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${figtree.variable} ${newsreader.variable} ${playfair.variable} ${sacramento.variable} antialiased`}
    >
      <body className="bg-white font-sans text-navy">{children}</body>
    </html>
  );
}
