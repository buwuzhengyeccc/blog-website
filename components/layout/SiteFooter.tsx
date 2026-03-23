"use client";

import { usePathname } from "next/navigation";

const HIDDEN_FOOTER_ROUTES = new Set(["/", "/about", "/contact"]);

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname && HIDDEN_FOOTER_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-xs uppercase tracking-[0.2em] text-stone-400 light:text-stone-600">
      Personal Blog Frontend Structure / Next.js App Router
    </footer>
  );
}
