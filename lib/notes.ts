import { getAllEntries } from "@/lib/entries";

export type NoteCardData = {
  slug: string;
  section: string;
  kicker: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  body: string;
};

export function getAllNotes() {
  return getAllEntries()
    .filter((entry) => entry.contentType === "note")
    .map((entry) => ({
      slug: entry.slug,
      section: entry.section,
      kicker: entry.kicker,
      title: entry.title,
      description: entry.summary,
      date: entry.displayDate,
      tags: entry.tags,
      draft: entry.draft,
      body: entry.body
    }))
    .filter((note) => !note.draft)
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export const notesPage = {
  title: "Notes / 笔记",
  description: "Notes 页用来承接短内容：草稿、方法记录、观察片段和暂未发展成正式文章的想法。",
  notes: getAllNotes()
};
