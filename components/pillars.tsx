import {
  CommunityIcon,
  GlobeIcon,
  GraduationCapIcon,
  LeavesIcon,
} from "@/components/icons";

const pillars = [
  {
    title: "Academic Excellence",
    description: "High-quality education with\na global outlook.",
    icon: GraduationCapIcon,
    iconClassName: "h-[2.65rem]",
  },
  {
    title: "A Supportive Community",
    description: "Students, families and educators\ngrowing together.",
    icon: CommunityIcon,
    iconClassName: "h-[2.7rem]",
  },
  {
    title: "International Perspective",
    description: "Opening minds to a connected world.",
    icon: GlobeIcon,
    iconClassName: "h-[2.7rem]",
  },
  {
    title: "Holistic Development",
    description: "Nurturing talent, character\nand well-being.",
    icon: LeavesIcon,
    iconClassName: "h-[2.8rem]",
  },
];

export function Pillars() {
  return (
    <section
      id="about"
      aria-label="What IMS stands for"
      className="mx-auto max-w-[64rem] scroll-mt-4 px-5 lg:pr-[2.5625rem] lg:pl-[2.8125rem]"
    >
      <div className="mt-[1.55rem] border-t border-line pt-[1.25rem]">
        <ul className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:-mr-[1.75rem] lg:-ml-[1.25rem] lg:grid-cols-[238fr_249fr_257fr_242fr] lg:gap-y-0">
          {pillars.map(({ title, description, icon: IconComponent, iconClassName }) => (
            <li
              key={title}
              className="flex flex-col items-center text-center lg:border-l lg:border-line lg:first:border-l-0"
            >
              <span className="flex h-[2.7rem] items-center text-gold">
                <IconComponent className={iconClassName} />
              </span>
              <h3 className="mt-[0.5rem] font-serif text-xl leading-[1.5rem] font-medium lg:text-[1.045rem]">
                {title}
              </h3>
              <p className="mt-[0.15rem] pb-[0.2rem] text-sm leading-[1.4] whitespace-pre-line lg:text-[0.8rem] lg:leading-[1.11rem]">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
