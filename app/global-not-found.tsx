import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | IMS",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-navy px-6 text-center font-[system-ui] text-white">
        <p className="text-5xl">404</p>
        <h1 lang="el" className="text-xl">
          Η σελίδα δεν βρέθηκε
        </h1>
        <p className="text-xl">Page not found</p>
        <p className="mt-3 flex gap-6 underline underline-offset-4">
          <Link href="/el" lang="el">
            Αρχική
          </Link>
          <Link href="/en">Home</Link>
        </p>
      </body>
    </html>
  );
}
