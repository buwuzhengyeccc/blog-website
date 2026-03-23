"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/sections/ai-agent", label: "AI Agent" },
  { href: "/sections/cybersecurity", label: "Cybersecurity" },
  { href: "/sections/portfolio", label: "Portfolio" },
  { href: "/sections/thoughts", label: "Thoughts" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ember/70 backdrop-blur light:bg-sand/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em]">
          Personal Blog / 2026
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-stone-300 transition hover:text-white light:text-stone-600 light:hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
