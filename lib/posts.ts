import { getAllEntries } from "@/lib/entries";

export type Post = {
  slug: string;
  section: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  tag: string;
  date: string;
  author: string;
  readTime: string;
  coverImage: string;
  body: string;
};

export function getAllPosts() {
  return getAllEntries()
    .filter((entry) => entry.contentType === "post")
    .map((entry) => ({
      slug: entry.slug,
      section: entry.section,
      title: entry.title,
      summary: entry.summary,
      category: entry.category,
      tags: entry.tags,
      tag: entry.tag,
      date: entry.displayDate,
      author: entry.author,
      readTime: entry.readTime,
      coverImage: entry.coverImage,
      body: entry.body
    }));
}

export function getPostBySectionAndSlug(section: string, slug: string) {
  return getAllPosts().find((post) => post.section === section && post.slug === slug);
}
