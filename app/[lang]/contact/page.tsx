import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampusCard, type Campus } from "@/components/campus-card";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "../dictionaries";
import { hasLocale } from "../locales";

// Everything here is as published on ims.edu.gr/el/contact-us/, including the map embeds.
// The hours appear there with no label or days, so don't add either without confirming them.
const campuses: Campus[] = [
  {
    id: "earlyYears",
    panelClassName: "bg-nursery",
    phone: "2109827447",
    phoneDisplay: "210 9827447",
    email: "nipio@ims.edu.gr",
    hours: "8:00 – 16:00",
    mapLink: "https://maps.app.goo.gl/UTMy8fCwXNGHxUREA",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3147.895328721994!2d23.7218783!3d37.909509199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bf4120cb49b5%3A0xe66c2a2ac0ca854!2sInternational%20Metropolitan%20School%20-%20Kindergarten!5e0!3m2!1sen!2sgr!4v1742549118971!5m2!1sen!2sgr",
  },
  {
    id: "primary",
    panelClassName: "bg-primary-school",
    phone: "2109969866",
    phoneDisplay: "210 9969866",
    email: "dimotiko@ims.edu.gr",
    hours: "8:00 – 16:00",
    mapLink: "https://maps.app.goo.gl/nSdKHRK95X5riaUU9",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3147.936615950392!2d23.7338924!3d37.9085442!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bfee81323fb7%3A0xd0e1c6de6a073bc2!2sInternational%20Metropolitan%20School%20-%20Primary!5e0!3m2!1sen!2sgr!4v1742549388746!5m2!1sen!2sgr",
  },
  {
    id: "middleHigh",
    panelClassName: "bg-middle-school",
    phone: "2109824310",
    phoneDisplay: "210 9824310",
    email: "info@ims.edu.gr",
    hours: "8:00 – 17:00",
    mapLink: "https://maps.app.goo.gl/HA5qBAzWefQgcS4K8",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.1339577661483!2d23.72766357653131!3d37.90393147195315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bf55e32d7ddb%3A0x1ceab491661d42d!2sInternational%20Metropolitan%20School%20-%20Gymnasium!5e0!3m2!1sen!2sgr!4v1742549061098!5m2!1sen!2sgr",
  },
];

const panelClassName = "rounded-[0.3rem] bg-mist px-[1.25rem] py-[1.1rem]";
const panelTitleClassName =
  "font-serif text-[1.5rem] leading-tight font-medium lg:text-[1.25rem] el:font-semibold";

export async function generateMetadata({
  params,
}: Pick<PageProps<"/[lang]/contact">, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { contact } = await getDictionary(lang);
  return { title: contact.metaTitle, description: contact.intro };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { contact } = await getDictionary(lang);

  return (
    <main className="mx-auto max-w-[64rem] px-5 pt-[1.75rem] pb-[3rem] lg:pr-[2.5625rem] lg:pl-[2.8125rem]">
      <div className="text-center">
        <SectionHeading
          as="h1"
          eyebrow={contact.eyebrow}
          title={contact.title}
          intro={contact.intro}
        />
      </div>

      <ul className="mt-[1.28rem] grid gap-[0.55rem] md:grid-cols-3">
        {campuses.map((campus) => (
          <CampusCard
            key={campus.id}
            campus={campus}
            text={contact.campuses[campus.id]}
            labels={contact.labels}
            lang={lang}
          />
        ))}
      </ul>

      <div className="mt-[0.55rem] grid gap-[0.55rem] md:grid-cols-[3fr_2fr]">
        <section className={panelClassName}>
          <h2 className={panelTitleClassName}>{contact.parents.title}</h2>
          <ul className="mt-[0.6rem] list-disc space-y-[0.35rem] pl-[1.1rem] text-sm leading-[1.45] marker:text-gold lg:text-[0.75rem] lg:leading-[1.1rem]">
            {contact.parents.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={panelClassName}>
          <h2 className={panelTitleClassName}>{contact.programmes.title}</h2>
          <dl className="mt-[0.6rem] space-y-[0.7rem] text-sm leading-[1.45] lg:text-[0.75rem] lg:leading-[1.1rem]">
            {contact.programmes.items.map(({ name, hours, detail }) => (
              <div key={name}>
                <dt className="font-bold">{name}</dt>
                <dd>
                  {hours}
                  <br />
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
