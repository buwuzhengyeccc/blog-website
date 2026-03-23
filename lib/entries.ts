import fs from "node:fs";
import path from "node:path";
import {
  formatDisplayDate,
  parseBoolean,
  parseFrontmatter,
  readTextFile,
  sectionFromSectionsFilePath,
  slugFromFilePath
} from "@/lib/content";
import type { SectionSlug } from "@/lib/sections";

export type EntryContentType = "post" | "note" | "project";

export type EntryFrontmatter = {
  title: string;
  date: string;
  summary: string;
  section?: SectionSlug;
  contentType: EntryContentType;
  tags: string[];
  draft?: string;
  featured?: string;
  kicker?: string;
  category?: string;
  tag?: string;
  author?: string;
  readTime?: string;
  coverImage?: string;
  stack?: string[];
  status?: string;
  repo?: string;
  demo?: string;
  highlights?: string[];
};

export type EntryRecord = {
  slug: string;
  section: SectionSlug;
  contentType: EntryContentType;
  title: string;
  summary: string;
  date: string;
  displayDate: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  kicker: string;
  category: string;
  tag: string;
  author: string;
  readTime: string;
  coverImage: string;
  stack: string[];
  status: string;
  repo: string;
  demo: string;
  highlights: string[];
  body: string;
  filePath: string;
};

const SECTIONS_DIR = path.join(process.cwd(), "content", "sections");

function readMdxFilesRecursively(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      return readMdxFilesRecursively(fullPath);
    }

    return entry.name.endsWith(".mdx") ? [fullPath] : [];
  });
}

function readEntryFile(filePath: string): EntryRecord {
  const source = readTextFile(filePath);
  const { data, body } = parseFrontmatter<EntryFrontmatter>(source);
  const section = sectionFromSectionsFilePath(filePath) as SectionSlug;

  return {
    slug: slugFromFilePath(filePath),
    section,
    contentType: data.contentType,
    title: data.title,
    summary: data.summary,
    date: data.date,
    displayDate: formatDisplayDate(data.date),
    tags: data.tags || [],
    draft: parseBoolean(data.draft),
    featured: parseBoolean(data.featured),
    kicker: data.kicker || "",
    category: data.category || "",
    tag: data.tag || "",
    author: data.author || "",
    readTime: data.readTime || "",
    coverImage: data.coverImage || "",
    stack: data.stack || [],
    status: data.status || "",
    repo: data.repo || "",
    demo: data.demo || "",
    highlights: data.highlights || [],
    body,
    filePath
  };
}

export function getAllEntries() {
  return readMdxFilesRecursively(SECTIONS_DIR)
    .map(readEntryFile)
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getEntryBySectionAndSlug(section: string, slug: string) {
  return getAllEntries().find((entry) => entry.section === section && entry.slug === slug);
}
