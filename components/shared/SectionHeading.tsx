export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-12 max-w-3xl space-y-5">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1>
      <p className="text-base leading-8 text-stone-300 light:text-stone-700">{description}</p>
    </div>
  );
}
