import { getAllEntries } from "@/lib/entries";

export type PostBlock = {
  id: string;
  type: "paragraph" | "image" | "quote" | "heading";
  content: string;
  caption?: string;
};

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
  blocks: PostBlock[];
};

type PostFrontmatter = {
  title: string;
  date: string;
  summary: string;
  category: string;
  section: string;
  tags: string[];
  tag: string;
  author: string;
  readTime: string;
  coverImage: string;
};

function mdxToBlocks(slug: string, body: string, coverImage: string): PostBlock[] {
  const lines = body.split(/\r?\n/);
  const blocks: PostBlock[] = [];
  let paragraphBuffer: string[] = [];
  let paragraphIndex = 0;
  let headingIndex = 0;
  let quoteIndex = 0;
  let imageIndex = 0;

  const pushParagraph = () => {
    const content = paragraphBuffer.join(" ").trim();
    if (!content) {
      paragraphBuffer = [];
      return;
    }

    paragraphIndex += 1;
    blocks.push({
      id: `${slug}-p${paragraphIndex}`,
      type: "paragraph",
      content
    });
    paragraphBuffer = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (!line) {
      pushParagraph();
      continue;
    }

    if (line.startsWith("## ")) {
      pushParagraph();
      headingIndex += 1;
      blocks.push({
        id: `${slug}-h${headingIndex}`,
        type: "heading",
        content: line.replace(/^##\s+/, "")
      });
      continue;
    }

    if (line.startsWith("> ")) {
      pushParagraph();
      quoteIndex += 1;
      blocks.push({
        id: `${slug}-q${quoteIndex}`,
        type: "quote",
        content: line.replace(/^>\s+/, "")
      });
      continue;
    }

    const imageMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imageMatch) {
      pushParagraph();
      imageIndex += 1;
      blocks.push({
        id: `${slug}-img${imageIndex}`,
        type: "image",
        content: imageMatch[2] || coverImage,
        caption: imageMatch[1] || undefined
      });
      continue;
    }

    paragraphBuffer.push(line);
  }

  pushParagraph();
  return blocks;
}

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
      blocks: mdxToBlocks(entry.slug, entry.body, entry.coverImage)
    }));
}

export function getPostBySectionAndSlug(section: string, slug: string) {
  return getAllPosts().find((post) => post.section === section && post.slug === slug);
}
