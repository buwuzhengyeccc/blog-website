import fs from "node:fs";
import path from "node:path";

export type AboutPageContent = {
  hudLabel: string;
  brandLabel: string;
  watermark: string;
  hero: {
    eyebrow: string;
    title: string[];
    terminalText: string;
  };
  overview: {
    quote: string;
    paths: Array<{
      eyebrow: string;
      title: string;
      description: string;
      badge: string;
    }>;
    bridgeText: string;
  };
  vision: {
    statement: string;
    eyebrow: string;
    paragraphs: string[];
  };
  manifesto: {
    watermark: string;
    intro: string;
    lines: string[];
    quote: string;
  };
  footer: {
    description: string;
    ctaLabel: string;
    statusLabel: string;
  };
};

export type ContactPageContent = {
  nav: {
    backLabel: string;
    title: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
  };
  emailCard: {
    label: string;
    email: string;
    copyLabel: string;
    copiedLabel: string;
  };
  socialsTitle: string;
  socials: Array<{
    name: string;
    desc: string;
    url: string;
  }>;
};

export type HomePageContent = {
  items: Array<{
    id: string;
    tag: string;
    titleLines: string[];
    imageSrc: string;
    description: string;
    ctaText: string;
    detailHref: string;
    stats?: Array<{ value: string; label: string }>;
  }>;
};

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(PAGES_DIR, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  return JSON.parse(source) as T;
}

export function getAboutPageContent() {
  return readJsonFile<AboutPageContent>("about.json");
}

export function getContactPageContent() {
  return readJsonFile<ContactPageContent>("contact.json");
}

export function getHomePageContent() {
  return readJsonFile<HomePageContent>("home.json");
}
