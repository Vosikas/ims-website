import type { ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/app/[lang]/locales";
import { ArrowRightIcon } from "@/components/icons";

type ContactDict = Dictionary["contact"];

export type Campus = {
  id: keyof ContactDict["campuses"];
  panelClassName: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  hours: string;
  mapLink: string;
  mapEmbed: string;
};

type CampusCardProps = {
  campus: Campus;
  text: ContactDict["campuses"][Campus["id"]];
  labels: ContactDict["labels"];
  lang: Locale;
};

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-[0.04em] uppercase lg:text-[0.58rem]">{label}</dt>
      <dd className="text-base leading-[1.35] lg:text-[0.8rem] lg:leading-[1.1rem]">{children}</dd>
    </div>
  );
}

const linkClassName = "underline decoration-navy/40 underline-offset-2 hover:decoration-navy";

export function CampusCard({ campus, text, labels, lang }: CampusCardProps) {
  const { panelClassName, phone, phoneDisplay, email, hours, mapLink, mapEmbed } = campus;

  return (
    <li className="flex flex-col overflow-hidden rounded-[0.3rem]">
      <div className="relative aspect-[306/190] bg-mist">
        <iframe
          src={mapEmbed.replaceAll("!1sen!", `!1s${lang}!`)}
          title={`${labels.map}: ${text.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
      <div className={`flex flex-1 flex-col px-[1.1rem] pt-[0.8rem] pb-[0.95rem] ${panelClassName}`}>
        <p className="text-xs tracking-[0.04em] uppercase lg:text-[0.6rem]">{text.campus}</p>
        <h2 className="mt-[0.1rem] font-serif text-[1.5rem] leading-tight font-medium lg:text-[1.25rem] el:font-semibold el:md:min-h-[2.5em]">
          {text.name}
        </h2>
        <dl className="mt-[0.6rem] mb-[0.8rem] space-y-[0.5rem]">
          <Detail label={labels.address}>
            <span className="whitespace-pre-line">{text.address}</span>
          </Detail>
          <Detail label={labels.phone}>
            <a href={`tel:+30${phone}`} className={linkClassName}>
              {phoneDisplay}
            </a>
          </Detail>
          <Detail label={labels.email}>
            <a href={`mailto:${email}`} className={linkClassName}>
              {email}
            </a>
          </Detail>
          <Detail label={labels.hours}>{hours}</Detail>
        </dl>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-auto inline-flex items-center gap-[0.5rem] text-xs font-bold tracking-[0.05em] uppercase lg:text-[0.58rem]"
        >
          {labels.openMap}
          <ArrowRightIcon className="w-[0.9rem] shrink-0 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </li>
  );
}
