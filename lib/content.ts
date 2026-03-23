import fs from "node:fs";
import path from "node:path";

export function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseFrontmatter<T>(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid MDX file: missing frontmatter block.");
  }

  const [, rawFrontmatter, body] = match;
  const lines = rawFrontmatter.split(/\r?\n/);
  const data: Record<string, string | string[]> = {};
  let currentListKey: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      continue;
    }

    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && currentListKey) {
      const current = data[currentListKey];
      if (Array.isArray(current)) {
        current.push(stripQuotes(listItem[1].trim()));
      }
      continue;
    }

    const entry = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!entry) {
      continue;
    }

    const [, key, value] = entry;
    if (!value) {
      data[key] = [];
      currentListKey = key;
      continue;
    }

    data[key] = stripQuotes(value.trim());
    currentListKey = null;
  }

  return {
    data: data as T,
    body: body.trim()
  };
}

export function getMdxFiles(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath).filter((fileName) => fileName.endsWith(".mdx"));
}

export function readTextFile(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

export function slugFromFilePath(filePath: string) {
  return path.basename(filePath, path.extname(filePath));
}

export function sectionFromSectionsFilePath(filePath: string) {
  const normalized = filePath.split(path.sep);
  const sectionsIndex = normalized.lastIndexOf("sections");

  if (sectionsIndex === -1 || sectionsIndex + 1 >= normalized.length) {
    throw new Error(`Unable to derive section from file path: ${filePath}`);
  }

  return normalized[sectionsIndex + 1];
}

export function formatDisplayDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  const month = parsed
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${month} ${day}`;
}

export function parseBoolean(value: string | undefined) {
  return value === "true";
}
