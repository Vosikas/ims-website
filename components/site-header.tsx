"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

const navItems = [
  { label: "Home", href: "/", current: true },
  { label: "About Us", href: "#about" },
  { label: "Our Educational Pathways", href: "#pathways" },
  { label: "School Life", href: "#school-life" },
  { label: "News & Events", href: "#news-events" },
  { label: "Contact & Careers", href: "#contact" },
];

function LanguageSwitch() {
  return (
    <div className="flex items-center text-sm tracking-[0.03em] lg:text-[0.62rem]">
      <button type="button" className="cursor-pointer transition-colors hover:text-gold">
        GR
      </button>
      <span className="mx-[0.3rem] h-[0.8rem] w-px bg-navy/50" />
      <button
        type="button"
        aria-pressed="true"
        className="cursor-pointer transition-colors hover:text-gold"
      >
        EN
      </button>
    </div>
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      aria-label="Search"
      className="cursor-pointer text-gold transition-colors hover:text-navy"
    >
      <SearchIcon className="size-5 lg:size-[0.82rem]" />
    </button>
  );
}

const admissionsClassName =
  "inline-flex items-center justify-center rounded-[0.25rem] bg-gold font-medium text-white transition-colors hover:bg-navy";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-30 bg-white">
      <div className="flex h-[4.6875rem] items-center px-5 lg:pr-[3.0625rem] lg:pl-[3rem]">
        <Logo />

        <nav aria-label="Main" className="relative top-[0.61rem] ml-[3.58rem] hidden lg:block">
          <ul className="flex gap-[0.96rem]">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={`block border-b-2 pb-[0.3rem] text-[0.592rem] font-medium whitespace-nowrap transition-colors hover:border-gold ${
                    item.current ? "border-gold" : "border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative top-[0.1rem] ml-auto hidden items-center lg:flex">
          <LanguageSwitch />
          <span className="mr-[0.9rem] ml-[0.8rem] h-[0.9rem] w-px bg-navy/20" />
          <SearchButton />
          <Link
            href="#contact"
            className={`${admissionsClassName} ml-[1.35rem] h-[2.25rem] w-[5.375rem] text-[0.62rem]`}
          >
            Admissions
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto cursor-pointer p-1 lg:hidden"
        >
          {menuOpen ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-t border-line bg-white px-5 pb-6 shadow-lg lg:hidden"
        >
          <nav aria-label="Main">
            <ul className="divide-y divide-line">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-3 font-medium ${item.current ? "text-gold" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 flex items-center gap-5">
            <LanguageSwitch />
            <SearchButton />
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className={`${admissionsClassName} ml-auto h-11 px-6 text-sm`}
            >
              Admissions
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
