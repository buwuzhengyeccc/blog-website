import { notFound } from "next/navigation";
import { PostDetail } from "@/components/posts/PostDetail";
import { SectionEntryDetail } from "@/components/sections/SectionEntryDetail";
import { getPostBySectionAndSlug } from "@/lib/posts";
import { getAllSectionEntries, getSectionEntryBySlugs } from "@/lib/sections";

export function generateStaticParams() {
  return getAllSectionEntries().map((entry) => ({
    slug: entry.section,
    articleSlug: entry.slug
  }));
}

export default async function SectionEntryPage({
  params
}: {
  params: Promise<{ slug: string; articleSlug: string }>;
}) {
  const { slug, articleSlug } = await params;
  const entry = getSectionEntryBySlugs(slug, articleSlug);

  if (!entry) {
    notFound();
  }

  const backHref = `/sections/${slug}`;

  if (entry.type === "post") {
    const post = getPostBySectionAndSlug(slug, articleSlug);

    if (!post) {
      notFound();
    }

    return <PostDetail post={post} backHref={backHref} />;
  }

  return <SectionEntryDetail entry={entry} backHref={backHref} />;
}
