import { getAllEntries } from "@/lib/entries";

export type ProjectCardData = {
  slug: string;
  section: string;
  kicker: string;
  title: string;
  description: string;
  date: string;
  stack: string[];
  status: string;
  repo: string;
  demo: string;
  featured: boolean;
  points: string[];
  body: string;
};

export function getAllProjects() {
  return getAllEntries()
    .filter((entry) => entry.contentType === "project")
    .map((entry) => ({
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
    }))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.slug.localeCompare(a.slug));
}

export const projectsPage = {
  title: "Projects / 项目",
  description: "这里收纳较完整的项目案例，强调问题背景、解决路径和最终产出，适合作为作品集的主展示页。",
  projects: getAllProjects()
};
