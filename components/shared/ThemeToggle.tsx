"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "personal-blog-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as "dark" | "light" | null;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = saved || (systemDark ? "dark" : "light");
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }, []);

  function applyTheme(nextTheme: "dark" | "light") {
    document.documentElement.classList.toggle("light", nextTheme === "light");
    document.documentElement.classList.toggle("dark", nextTheme !== "light");
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-200 transition hover:border-white hover:text-white light:border-stone-300 light:text-stone-700 light:hover:border-stone-700"
    >
      {theme === "dark" ? "切换浅色" : "切换深色"}
    </button>
  );
}
