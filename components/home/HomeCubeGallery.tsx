"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryItem {
  id: string;
  imageSrc?: string;
  title: React.ReactNode;
  tag: string;
  description: React.ReactNode;
  stats?: { value: string | number; label: string }[];
  ctaText: string;
  detailHref: string;
}

export interface CubeGalleryProps {
  items: GalleryItem[];
  credit?: { text: string; url: string };
  defaultTheme?: "dark" | "light";
}

const STOPS = [
  { rx: 90, ry: 0 },
  { rx: 0, ry: 0 },
  { rx: 0, ry: -90 },
  { rx: 0, ry: -180 },
  { rx: 0, ry: -270 },
  { rx: -90, ry: -360 }
];

const N = STOPS.length;
const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const defaultCredit = {
  text: "Personal Blog System",
  url: "/about"
};

export function HomeCubeGallery({
  items,
  credit = defaultCredit,
  defaultTheme = "light"
}: CubeGalleryProps) {
  const [theme, setTheme] = useState<"dark" | "light">(defaultTheme);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const cubeRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const hudPctRef = useRef<HTMLDivElement>(null);
  const physicsRef = useRef({
    tgt: 0,
    smooth: 0,
    lastNow: 0,
    maxScroll: 1,
    anchorAnim: null as number | null
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("personal-blog-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const p = physicsRef.current;
    p.lastNow = performance.now();
    let reqId = 0;

    const resize = () => {
      p.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const onScroll = () => {
      const target = p.maxScroll > 0 ? window.scrollY / p.maxScroll : 0;
      p.tgt = Math.max(0, Math.min(1, target));
    };

    const stopAnim = () => {
      if (p.anchorAnim !== null) {
        cancelAnimationFrame(p.anchorAnim);
        p.anchorAnim = null;
      }
    };

    const updateDOM = (smooth: number) => {
      const pct = Math.round(smooth * 100);
      if (hudPctRef.current) {
        hudPctRef.current.textContent = `${String(pct).padStart(3, "0")}%`;
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${pct}%`;
      }

      const nextIndex = Math.min(N - 1, Math.floor(smooth * N));
      setActiveIndex((prev) => (prev !== nextIndex ? nextIndex : prev));

      if (cubeRef.current) {
        const t = smooth * (N - 1);
        const index = Math.min(Math.floor(t), N - 2);
        const factor = easeIO(t - index);
        const current = STOPS[index];
        const next = STOPS[index + 1];
        const rx = current.rx + (next.rx - current.rx) * factor;
        const ry = current.ry + (next.ry - current.ry) * factor;
        cubeRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    };

    const frame = (now: number) => {
      reqId = requestAnimationFrame(frame);
      const dt = Math.min((now - p.lastNow) / 1000, 0.05);
      p.lastNow = now;

      p.smooth += (p.tgt - p.smooth) * (1 - Math.exp(-dt * 8));
      p.smooth = Math.max(0, Math.min(1, p.smooth));
      updateDOM(p.smooth);
    };

    resize();
    onScroll();
    reqId = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", stopAnim, { passive: true });
    window.addEventListener("mousedown", stopAnim, { passive: true });
    window.addEventListener("keydown", stopAnim, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", stopAnim);
      window.removeEventListener("mousedown", stopAnim);
      window.removeEventListener("keydown", stopAnim);
      cancelAnimationFrame(reqId);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setRevealedIds((prev) => {
          const next = new Set(prev);
          let changed = false;
          entries.forEach((entry) => {
            if (entry.isIntersecting && !next.has(entry.target.id)) {
              next.add(entry.target.id);
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      },
      { threshold: 0.15 }
    );

    const sections = document.querySelectorAll("[data-reveal-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = useCallback(
    (index: number) => {
      const p = physicsRef.current;
      if (p.anchorAnim !== null) {
        cancelAnimationFrame(p.anchorAnim);
      }

      const targetElement = document.getElementById(items[index].id);
      if (!targetElement) {
        return;
      }

      const startY = window.scrollY;
      const isSmall = window.innerWidth <= 900;
      const isHero = index === 0;
      const extraOffset =
        isSmall && !isHero ? Math.max(0, targetElement.offsetHeight - window.innerHeight) : 0;
      const targetY = Math.max(0, Math.min(targetElement.offsetTop + extraOffset, p.maxScroll));
      const diff = targetY - startY;
      const duration = 900;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        window.scrollTo(0, startY + diff * easeInOutCubic(progress));
        if (progress < 1) {
          p.anchorAnim = requestAnimationFrame(tick);
        } else {
          p.anchorAnim = null;
        }
      };

      p.anchorAnim = requestAnimationFrame(tick);
    },
    [items]
  );

  const isDark = theme === "dark";
  const themeColors = {
    bg: isDark ? "bg-[#1c1814]" : "bg-[#f3ede4]",
    fg: isDark ? "text-[#ede8df]" : "text-[#0d0d14]",
    muted: isDark ? "text-[#8a7b6e]" : "text-[#8c8b98]",
    accentText: isDark ? "text-[#d4a84b]" : "text-[#5b6d2a]",
    accentBg: isDark ? "bg-[#d4a84b]" : "bg-[#5b6d2a]",
    accentBorder: isDark ? "border-[#d4a84b]" : "border-[#5b6d2a]",
    cardBg: isDark ? "bg-[#1c1814]/80" : "bg-[#f3ede4]/55",
    cardBorder: isDark ? "border-[#d4a84b]/20" : "border-[#5b6d2a]/15",
    faceBg: isDark ? "#14100d" : "#ddd8cf",
    faceLines: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.05)"
  };

  const facesConfig = [
    { name: "top", transform: "rotateX(-90deg) translateZ(calc(var(--s) / 2))" },
    { name: "front", transform: "translateZ(calc(var(--s) / 2))" },
    { name: "right", transform: "rotateY(90deg) translateZ(calc(var(--s) / 2))" },
    { name: "back", transform: "rotateY(180deg) translateZ(calc(var(--s) / 2))" },
    { name: "left", transform: "rotateY(-90deg) translateZ(calc(var(--s) / 2))" },
    { name: "bottom", transform: "rotateX(90deg) translateZ(calc(var(--s) / 2))" }
  ];

  return (
    <div className={`relative overflow-x-hidden font-mono transition-colors duration-300 ${themeColors.bg} ${themeColors.fg}`}>
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center" style={{ perspective: "1100px" }}>
        <div
          ref={cubeRef}
          className="relative will-change-transform"
          style={{
            ["--s" as string]: "min(74vw, 74vh, 560px)",
            width: "var(--s)",
            height: "var(--s)",
            transformStyle: "preserve-3d",
            transform: "rotateX(90deg) rotateY(0deg)"
          }}
        >
          {facesConfig.map((face, index) => {
            const item = items[index];
            return (
              <div
                key={face.name}
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: face.transform,
                  background: `
                    repeating-linear-gradient(0deg, ${themeColors.faceLines} 0, ${themeColors.faceLines} 1px, transparent 1px, transparent 48px),
                    repeating-linear-gradient(90deg, ${themeColors.faceLines} 0, ${themeColors.faceLines} 1px, transparent 1px, transparent 48px),
                    ${themeColors.faceBg}
                  `
                }}
              >
                {item?.imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageSrc} alt={face.name} className="absolute inset-0 block h-full w-full object-cover" />
                ) : (
                  <span className={`absolute bottom-6 left-7 select-none font-sans text-4xl font-bold uppercase tracking-widest sm:text-6xl md:text-[5rem] ${isDark ? "text-white/5" : "text-black/5"}`}>
                    {face.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`fixed right-4 top-4 z-10 text-right text-[0.65rem] uppercase tracking-[0.15em] md:right-8 md:top-8 ${themeColors.muted}`}>
        <div ref={hudPctRef}>000%</div>
        <div className={`relative ml-auto mt-2 h-[1px] w-[7.5rem] overflow-hidden ${isDark ? "bg-[#8a7b6e]" : "bg-[#9a9aaa]"}`}>
          <div ref={progressFillRef} className={`absolute inset-y-0 left-0 w-0 ${themeColors.accentBg}`} />
        </div>
        <div className={`mt-1.5 text-[0.6rem] ${themeColors.accentText}`}>
          {items[activeIndex]?.tag.split("—")[1]?.trim() || "SCENE"}
        </div>
      </div>

      <div className="fixed left-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex md:left-[calc(2rem+0.125rem)]">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to scene ${index + 1}`}
            className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              activeIndex === index ? `${themeColors.accentBg} scale-[1.8]` : isDark ? "bg-[#8a7b6e]" : "bg-[#9a9aaa]"
            }`}
          />
        ))}
      </div>

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-10 -translate-x-1/2 text-center md:bottom-8">
        <div className={`mb-0.5 text-[0.58rem] uppercase tracking-[0.28em] ${themeColors.accentText}`}>
          {String(activeIndex + 1).padStart(2, "0")}
        </div>
        <div className={`font-sans text-3xl font-bold uppercase leading-none tracking-[0.08em] md:text-5xl ${themeColors.muted} ${isDark ? "opacity-50" : "opacity-35"}`}>
          {items[activeIndex]?.tag.split("—")[1]?.trim() || "SCENE"}
        </div>
      </div>

      <div className="relative z-10">
        {items.map((item, index) => {
          const isRight = index % 2 !== 0;
          const isHero = index === 0;
          const isRevealed = revealedIds.has(item.id);

          return (
            <section
              key={item.id}
              id={item.id}
              data-reveal-section
              className={`flex min-h-[150vh] px-6 md:min-h-screen md:px-20 ${isHero ? "items-center py-16" : "items-end pb-14 md:items-center md:py-24"}`}
            >
              <div
                className={`w-full max-w-full border-r-0 p-6 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 md:max-w-[23.75rem] md:p-9 ${themeColors.cardBg} ${
                  isRight ? `md:ml-auto md:border-r-[1px] md:text-right ${themeColors.cardBorder}` : `border-l-[1px] ${themeColors.cardBorder}`
                }`}
              >
                {!isHero ? (
                  <div
                    className={`mb-5 h-[1px] w-12 transition-all duration-700 ease-out ${themeColors.accentBg} ${
                      isRight ? "ml-auto origin-right" : "origin-left"
                    } ${isRevealed ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
                  />
                ) : null}

                <div className={`mb-4 text-[0.6rem] uppercase tracking-[0.25em] transition-all delay-75 duration-500 ease-out ${themeColors.accentText} ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  {item.tag}
                </div>

                <h2 className={`font-sans font-normal leading-[0.92] tracking-[0.03em] transition-all delay-100 duration-500 ease-out ${isHero ? "text-5xl md:text-[6.5rem]" : "text-4xl md:text-[5rem]"} ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  {item.title}
                </h2>

                <p className={`mt-5 whitespace-pre-line text-[0.78rem] leading-[1.8] transition-all delay-200 duration-500 ease-out md:leading-[1.55] ${isDark ? "text-[#ede8df]/55" : "text-[#0d0d14]/55"} ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  {item.description}
                </p>

                {item.stats ? (
                  <div className={`mt-5 flex flex-wrap gap-6 transition-all delay-300 duration-500 ease-out md:mt-8 md:gap-10 ${isRight ? "md:justify-end" : ""} ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                    {item.stats.map((stat) => (
                      <div key={stat.label} className="flex flex-col gap-0.5">
                        <span className={`font-sans text-[2.2rem] leading-none ${themeColors.accentText}`}>{stat.value}</span>
                        <span className={`text-[0.58rem] uppercase tracking-[0.2em] ${themeColors.muted}`}>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className={`mt-5 flex flex-wrap gap-3 transition-all delay-[400ms] duration-500 ease-out md:mt-7 ${isRight ? "md:justify-end" : ""} ${isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                  <button
                    onClick={() => scrollToSection(index === items.length - 1 ? 0 : index + 1)}
                    className={`inline-flex items-center gap-2.5 border-[1px] px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-all ${themeColors.accentBorder} ${themeColors.accentText}`}
                  >
                    {item.ctaText}
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[0.6875rem] w-[0.6875rem]">
                      <path d="M1 6h10M6 1l5 5-5 5" />
                    </svg>
                  </button>
                  <Link
                    href={item.detailHref}
                    className={`inline-flex items-center gap-2.5 border-[1px] px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-all ${
                      isDark ? "border-white/20 text-[#ede8df] hover:border-white hover:bg-white hover:text-[#1c1814]" : "border-black/15 text-[#0d0d14] hover:border-black hover:bg-black hover:text-[#f3ede4]"
                    }`}
                  >
                    了解详情
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
