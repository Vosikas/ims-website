import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { notFound } from "next/navigation";
import makerspace from "@/public/images/campus/makerspace.jpg";
import basketball from "@/public/images/school/basketball.jpg";
import imacLab from "@/public/images/school/imac-lab.jpg";
import learningSupport from "@/public/images/school/learning-support.jpg";
import library from "@/public/images/school/library-reading.jpg";
import outdoorClassroom from "@/public/images/school/outdoor-classroom.jpg";
import robotics from "@/public/images/school/robotics-ipad.jpg";
import schoolTrip from "@/public/images/school/school-trip.jpg";
import science from "@/public/images/school/science-electronics.jpg";
import studentLounge from "@/public/images/school/student-lounge.jpg";
import { getDictionary, type Dictionary } from "../dictionaries";
import { hasLocale } from "../locales";

type SectionId = keyof Dictionary["schoolLifePage"]["sections"];

type Section = {
  id: SectionId;
  image: StaticImageData;
  focusClassName?: string;
};

// Texts and photos from ims.edu.gr ("Η ζωή στο σχολείο").
const sections: Section[] = [
  { id: "wellbeing", image: studentLounge },
  { id: "learning", image: learningSupport, focusClassName: "object-[50%_62%]" },
  { id: "library", image: library, focusClassName: "object-[45%_55%]" },
  { id: "science", image: science },
  { id: "technology", image: imacLab, focusClassName: "object-[50%_60%]" },
  { id: "makerspace", image: makerspace, focusClassName: "object-[62%_55%]" },
  { id: "sports", image: basketball, focusClassName: "object-[30%_50%]" },
  { id: "trips", image: schoolTrip, focusClassName: "object-[50%_40%]" },
  { id: "outdoor", image: outdoorClassroom },
  { id: "afterSchool", image: robotics },
];

const practicalItems = ["canteen", "uniform", "transport", "camp", "languages", "maths"] as const;

export async function generateMetadata({
  params,
}: Pick<PageProps<"/[lang]/school-life">, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { schoolLifePage } = await getDictionary(lang);
  return { title: schoolLifePage.metaTitle, description: schoolLifePage.intro };
}

export default async function SchoolLifePage({ params }: PageProps<"/[lang]/school-life">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { schoolLifePage: dict } = await getDictionary(lang);

  return (
    <main className="mx-auto max-w-[64rem] px-5 pt-[1.75rem] pb-[3rem] lg:pr-[2.5625rem] lg:pl-[2.8125rem]">
      <div className="text-center">
        <h1 className="font-serif text-[2.4rem] leading-[1.1] font-medium text-balance lg:text-[2.2rem] el:font-semibold">
          {dict.title}
        </h1>
        <span className="mx-auto mt-[0.6rem] block h-[0.125rem] w-[1.95rem] bg-gold" />
        <p className="mx-auto mt-[0.7rem] max-w-[36rem] text-base leading-[1.5] lg:text-[0.9rem]">
          {dict.intro}
        </p>
      </div>

      <div className="mt-[2.2rem] space-y-[2.2rem] lg:space-y-[2.6rem]">
        {sections.map(({ id, image, focusClassName }, i) => (
          <article key={id} className="grid items-center gap-5 lg:grid-cols-2 lg:gap-[2.6rem]">
            <div
              className={`relative aspect-[3/2] overflow-hidden rounded-[0.3rem] bg-mist ${i % 2 ? "lg:order-2" : ""}`}
            >
              <Image
                src={image}
                alt={dict.sections[id].alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 30vw, 100vw"
                className={`object-cover ${focusClassName ?? ""}`}
              />
            </div>
            <div className="max-w-[30rem]">
              <h2 className="font-serif text-[1.75rem] leading-tight font-medium lg:text-[1.5rem] el:font-semibold">
                {dict.sections[id].title}
              </h2>
              <span className="mt-[0.55rem] block h-[0.125rem] w-[1.95rem] bg-gold" />
              <p className="mt-[0.7rem] text-[1.0625rem] leading-[1.65] lg:text-[0.88rem] lg:leading-[1.45rem]">
                {dict.sections[id].text}
              </p>
            </div>
          </article>
        ))}
      </div>

      <section aria-labelledby="practical-heading" className="mt-[3rem]">
        <h2
          id="practical-heading"
          className="font-serif text-[1.75rem] leading-tight font-medium lg:text-[1.5rem] el:font-semibold"
        >
          {dict.practical.title}
        </h2>
        <dl className="mt-[1rem] grid gap-[0.55rem] sm:grid-cols-2 lg:grid-cols-3">
          {practicalItems.map((id) => (
            <div key={id} className="rounded-[0.3rem] bg-mist px-[1.1rem] py-[0.95rem]">
              <dt className="font-serif text-[1.25rem] leading-tight font-medium lg:text-[1.05rem] el:font-semibold">
                {dict.practical.items[id].title}
              </dt>
              <dd className="mt-[0.35rem] text-sm leading-[1.5] lg:text-[0.76rem] lg:leading-[1.15rem]">
                {dict.practical.items[id].text}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
