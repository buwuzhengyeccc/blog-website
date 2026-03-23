import { notFound } from "next/navigation";
import { SectionGalleryPage } from "@/components/sections/SectionGalleryPage";
import { getEntriesBySection, getSectionMeta, SECTION_SLUGS } from "@/lib/sections";

export function generateStaticParams() {
  return SECTION_SLUGS.map((slug) => ({ slug }));
}

export default async function SectionPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sectionMeta = getSectionMeta(slug);
  const entries = getEntriesBySection(slug);

  if (!sectionMeta) {
    notFound();
  }

  return (
    <SectionGalleryPage
      section={sectionMeta}
      entries={entries}
    />
  );
}
