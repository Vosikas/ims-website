import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";
import "./panhellenic.css";
import { el } from "./_lib/i18n/el";

// A root layout of its own: the login has no site header or footer, and going between it and
// the site is a full page load.

export const metadata: Metadata = {
  title: { template: el.meta.titleTemplate, default: el.meta.defaultTitle },
  robots: { index: false, follow: false },
};

export default function PanhellenicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="el" className={`${fontVariables} antialiased`}>
      <body className="bg-white font-sans text-navy">{children}</body>
    </html>
  );
}
