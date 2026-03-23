import { getAllEntries, type EntryRecord } from "@/lib/entries";
import { type NoteCardData } from "@/lib/notes";
import { type Post } from "@/lib/posts";
import { type ProjectCardData } from "@/lib/projects";

export const SECTION_SLUGS = [
  "ai-agent",
  "cybersecurity",
  "portfolio",
  "thoughts"
] as const;

export type SectionSlug = (typeof SECTION_SLUGS)[number];
export type SectionEntryType = "post" | "note" | "project";

export type SectionMeta = {
  slug: SectionSlug;
  title: string;
  eyebrow: string;
  description: string;
  theme: "light" | "dark";
  hint: string;
};

type BaseSectionEntry = {
  type: SectionEntryType;
  slug: string;
  section: SectionSlug;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  href: string;
  body: string;
  image?: string;
  kicker?: string;
  stack?: string[];
  status?: string;
  readTime?: string;
  author?: string;
  coverImage?: string;
};

export type PostSectionEntry = BaseSectionEntry & {
  type: "post";
  source: Post;
};

export type NoteSectionEntry = BaseSectionEntry & {
  type: "note";
  source: NoteCardData;
};

export type ProjectSectionEntry = BaseSectionEntry & {
  type: "project";
  source: ProjectCardData;
};

export type SectionEntry = PostSectionEntry | NoteSectionEntry | ProjectSectionEntry;

export const SECTION_META: Record<SectionSlug, SectionMeta> = {
  "ai-agent": {
    slug: "ai-agent",
    title: "AI Agent",
    eyebrow: "SECTION / AI AGENT",
    description: "围绕 AI Agent 的协作方式、规划过程与工程实践，按专题而不是内容类型来聚合展示。",
    theme: "dark",
    hint: "滑动以探索"
  },
  cybersecurity: {
    slug: "cybersecurity",
    title: "Cybersecurity",
    eyebrow: "SECTION / CYBERSECURITY",
    description: "聚合我关于安全、结构边界、风险面与底层视角的内容，而不再分散在不同内容集合里。",
    theme: "dark",
    hint: "滑动以探索"
  },
  portfolio: {
    slug: "portfolio",
    title: "Portfolio",
    eyebrow: "SECTION / PORTFOLIO",
    description: "把项目、案例与关于作品表达方式的文章统一收敛到同一个专题前台入口。",
    theme: "light",
    hint: "滑动以探索"
  },
  thoughts: {
    slug: "thoughts",
    title: "Thoughts",
    eyebrow: "SECTION / THOUGHTS",
    description: "承接那些还没长成完整文章的记录、观察和工作中的中间判断。",
    theme: "light",
    hint: "滑动以探索"
  }
};

const SECTION_IMAGES: Record<SectionSlug, string> = {
  "ai-agent": "https://assets.codepen.io/573855/demo-monsters-01.webp",
  cybersecurity: "https://assets.codepen.io/573855/demo-monsters-02.webp",
  portfolio: "https://assets.codepen.io/573855/demo-monsters-03.webp",
  thoughts: "https://assets.codepen.io/573855/demo-monsters-04.webp"
};

function isSectionSlug(value: string): value is SectionSlug {
  return SECTION_SLUGS.includes(value as SectionSlug);
}

function buildPostSource(entry: EntryRecord): Post {
  return {
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
    blocks: []
  };
}

function buildNoteSource(entry: EntryRecord): NoteCardData {
  return {
    slug: entry.slug,
    section: entry.section,
    kicker: entry.kicker,
    title: entry.title,
    description: entry.summary,
    date: entry.displayDate,
    tags: entry.tags,
    draft: entry.draft,
    body: entry.body
  };
}

function buildProjectSource(entry: EntryRecord): ProjectCardData {
  return {
    slug: entry.slug,
    section: entry.section,
    kicker: entry.kicker,
    title: entry.title,
    description: entry.summary,
    date: entry.displayDate,
    stack: entry.stack,
    status: entry.status,
    repo: entry.repo,
    demo: entry.demo,
    featured: entry.featured,
    points: entry.highlights,
    body: entry.body
  };
}

function mapEntry(entry: EntryRecord): SectionEntry | null {
  if (!isSectionSlug(entry.section)) {
    return null;
  }

  if (entry.contentType === "post") {
    return {
      type: "post",
      slug: entry.slug,
      section: entry.section,
      title: entry.title,
      summary: entry.summary,
      date: entry.displayDate,
      tags: entry.tags,
      href: `/sections/${entry.section}/${entry.slug}`,
      body: entry.body,
      image: entry.coverImage || SECTION_IMAGES[entry.section],
      readTime: entry.readTime,
      author: entry.author,
      coverImage: entry.coverImage,
      source: buildPostSource(entry)
    };
  }

  if (entry.contentType === "note") {
    return {
      type: "note",
      slug: entry.slug,
      section: entry.section,
      title: entry.title,
      summary: entry.summary,
      date: entry.displayDate,
      tags: entry.tags,
      href: `/sections/${entry.section}/${entry.slug}`,
      body: entry.body,
      image: SECTION_IMAGES[entry.section],
      kicker: entry.kicker,
      source: buildNoteSource(entry)
    };
  }

  return {
    type: "project",
    slug: entry.slug,
    section: entry.section,
    title: entry.title,
    summary: entry.summary,
    date: entry.displayDate,
    tags: entry.tags.length ? entry.tags : entry.stack,
    href: `/sections/${entry.section}/${entry.slug}`,
    body: entry.body,
    image: SECTION_IMAGES[entry.section],
    kicker: entry.kicker,
    stack: entry.stack,
    status: entry.status,
    source: buildProjectSource(entry)
  };
}

export function getAllSectionEntries() {
  return getAllEntries()
    .filter((entry) => !entry.draft)
    .map(mapEntry)
    .filter((entry): entry is SectionEntry => Boolean(entry))
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getSectionMeta(slug: string) {
  return isSectionSlug(slug) ? SECTION_META[slug] : undefined;
}

export function getEntriesBySection(slug: string) {
  if (!isSectionSlug(slug)) {
    return [];
  }

  return getAllSectionEntries().filter((entry) => entry.section === slug);
}

export function getSectionEntryBySlugs(sectionSlug: string, articleSlug: string) {
  if (!isSectionSlug(sectionSlug)) {
    return undefined;
  }

  return getAllSectionEntries().find(
    (entry) => entry.section === sectionSlug && entry.slug === articleSlug
  );
}
