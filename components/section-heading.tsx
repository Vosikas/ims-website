type SectionHeadingProps = {
  as: "h1" | "h2";
  id?: string;
  eyebrow: string;
  title: string;
  intro: string;
};

export function SectionHeading({ as: Heading, id, eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <>
      <p className="flex items-center justify-center gap-[0.625rem] text-[0.78rem] tracking-[0.02em] uppercase">
        <span className="h-[0.1rem] w-[1.875rem] bg-gold" />
        {eyebrow}
        <span className="h-[0.1rem] w-[1.875rem] bg-gold" />
      </p>
      <Heading
        id={id}
        className="mt-[0.12rem] font-serif text-[2.1rem] leading-[1.15] font-medium lg:text-[1.97rem] lg:leading-[2.6rem] el:font-semibold"
      >
        {title}
      </Heading>
      <p className="mt-[0.18rem] text-base leading-[1.4] lg:text-[0.9rem]">{intro}</p>
    </>
  );
}
