type TocSection = {
  id: string;
  heading: string;
};

export function PostToc({ sections }: { sections: TocSection[] }) {
  return (
    <aside className="top-24 h-fit lg:sticky">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gold">Contents</p>
      <nav className="space-y-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="block text-sm text-stone-400 transition hover:text-white light:text-stone-600 light:hover:text-stone-900"
          >
            {section.heading}
          </a>
        ))}
      </nav>
    </aside>
  );
}
