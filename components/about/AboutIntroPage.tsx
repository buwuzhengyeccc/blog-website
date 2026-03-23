"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AboutPageContent } from "@/lib/pages";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>?/[]{}";

function ScrambleText({
  text,
  className = "",
  delay = 0
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isRevealed) {
          revealTimerRef.current = setTimeout(() => setIsRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
      }
    };
  }, [delay, isRevealed]);

  useEffect(() => {
    if (!isRevealed) {
      setDisplayText(text.replace(/./g, " "));
      return;
    }

    let iteration = 0;
    frameCountRef.current = 0;

    const animate = () => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") {
              return char;
            }
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      frameCountRef.current += 1;
      if (frameCountRef.current % 2 === 0) {
        iteration += 1;
      }

      if (iteration < text.length) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isRevealed, text]);

  return (
    <span ref={textRef} className={`whitespace-pre-wrap ${className}`}>
      {displayText}
    </span>
  );
}

function MagneticWrapper({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) {
      return;
    }

    const { clientX, clientY } = event;
    const { width, height, left, top } = wrapperRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition:
          position.x === 0 && position.y === 0
            ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
            : "transform 0.1s linear",
        willChange: "transform"
      }}
    >
      {children}
    </div>
  );
}

function TerminalText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isRevealed) {
          revealTimerRef.current = setTimeout(() => setIsRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      observer.disconnect();
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
      }
    };
  }, [delay, isRevealed]);

  useEffect(() => {
    if (!isRevealed) {
      return;
    }

    let index = 0;
    typingTimerRef.current = setInterval(() => {
      setDisplayed(text.substring(0, index));
      index += 1;
      if (index > text.length && typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    }, 30);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, [isRevealed, text]);

  return (
    <div ref={textRef} className="relative inline-block">
      <span>{displayed}</span>
      <span
        className="ml-1 inline-block h-[1em] w-[0.6em] animate-pulse bg-[#C48A3F] align-middle"
        style={{ animationDuration: "0.8s" }}
      />
    </div>
  );
}

function splitByHighlight(text: string, highlight: string) {
  const index = text.indexOf(highlight);
  if (index === -1) {
    return { before: text, highlight: "", after: "" };
  }

  return {
    before: text.slice(0, index),
    highlight,
    after: text.slice(index + highlight.length)
  };
}

type AboutIntroPageProps = {
  content: AboutPageContent;
};

export function AboutIntroPage({ content }: AboutIntroPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hudPctRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

  const [heroTitleTop = "", heroTitleMiddle = "", heroTitleBottom = ""] = content.hero.title;
  const [firstPath, secondPath] = content.overview.paths;
  const [visionIntro = "", visionTransition = "", visionFuture = ""] = content.vision.paragraphs;
  const [manifestoLineOne = "", manifestoLineTwo = ""] = content.manifesto.lines;

  const overviewQuote = splitByHighlight(content.overview.quote, "两种通向系统本质的路径");
  const bridgeText = splitByHighlight(content.overview.bridgeText, "连接");
  const visionStatement = splitByHighlight(content.vision.statement, "改变逆向工程的工作方式与生产范式");
  const visionTransitionLead = splitByHighlight(
    visionTransition,
    "由人定义目标，由智能体参与理解、推理、验证、调试与协作"
  );
  const visionTransitionTail = splitByHighlight(visionTransitionLead.after, "“结构化智能协同”");
  const manifestoIntro = splitByHighlight(
    content.manifesto.intro,
    "同时理解智能如何行动与系统如何运行"
  );
  const manifestoLineOneParts = splitByHighlight(manifestoLineOne, "更重要");
  const manifestoLineTwoParts = splitByHighlight(manifestoLineTwo, "更稀缺");

  useEffect(() => {
    let reqId = 0;
    let smoothPct = 0;
    let targetPct = 0;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      targetPct = Math.max(0, Math.min(1, scrollTop / maxScroll));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const loop = () => {
      smoothPct += (targetPct - smoothPct) * 0.1;
      const displayPct = Math.round(smoothPct * 100);

      if (hudPctRef.current) {
        hudPctRef.current.textContent = `${String(displayPct).padStart(3, "0")}%`;
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${displayPct}%`;
      }

      reqId = requestAnimationFrame(loop);
    };

    reqId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(reqId);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-12");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const addToRefs = useCallback((element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) {
      revealRefs.current.push(element);
    }
  }, []);

  const handleGlobalMouseMove = (event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="relative min-h-screen overflow-x-hidden bg-[#f3ede4] font-mono text-[#2c241f] selection:bg-[#C48A3F]/30 selection:text-[#2c241f]"
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `
            repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.04) 0, rgba(0, 0, 0, 0.04) 1px, transparent 1px, transparent 48px),
            repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0, rgba(0, 0, 0, 0.04) 1px, transparent 1px, transparent 48px),
            transparent
          `
        }}
      >
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-50 mix-blend-multiply"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(196, 138, 63, 0.15), transparent 40%)`
          }}
        />
      </div>

      <div className="pointer-events-none fixed right-4 top-4 z-50 text-right text-[0.65rem] uppercase tracking-[0.15em] text-[#7a6a5c] mix-blend-multiply md:right-8 md:top-8">
        <div ref={hudPctRef}>000%</div>
        <div className="relative ml-auto mt-2 h-[1px] w-[7.5rem] overflow-hidden bg-[#7a6a5c]/30">
          <div
            ref={progressFillRef}
            className="absolute inset-y-0 left-0 w-0 bg-[#C48A3F] transition-all duration-100 ease-linear"
          />
        </div>
        <div className="mt-1.5 text-[0.6rem] text-[#C48A3F]">{content.hudLabel}</div>
      </div>

      <div className="fixed left-6 top-8 z-50 md:left-12">
        <MagneticWrapper>
          <Link
            href="/"
            className="group -m-4 flex cursor-pointer items-center gap-3 p-4 text-[0.6rem] uppercase tracking-[0.25em] text-[#C48A3F]"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#C48A3F]" />
            {content.brandLabel}
          </Link>
        </MagneticWrapper>
      </div>

      <div className="pointer-events-none fixed left-6 top-1/2 z-0 hidden origin-left -translate-y-1/2 -rotate-90 opacity-[0.03] lg:block md:left-12">
        <span className="whitespace-nowrap font-sans text-[6rem] font-black uppercase tracking-tighter text-[#2c241f]">
          {content.watermark}
        </span>
      </div>

      <section className="relative z-10 flex min-h-[95vh] w-full flex-col justify-center px-6 pb-20 pt-32 md:px-20">
        <div className="mx-auto ml-0 w-full max-w-[1200px] lg:ml-[10%]">
          <div className="mb-8 flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.3em] text-[#7a6a5c]">
            <span className="h-[1px] w-12 bg-[#C48A3F]" />
            {content.hero.eyebrow}
          </div>

          <h1 className="mb-12 font-sans text-5xl font-normal uppercase leading-[0.85] tracking-[0.02em] text-[#2c241f] sm:text-7xl md:text-[8rem] lg:text-[10rem]">
            <ScrambleText text={heroTitleTop} delay={200} />
            <br />
            <span className="font-light italic text-[#C48A3F]/90">
              <ScrambleText text={heroTitleMiddle} delay={600} />
            </span>
            <br />
            <ScrambleText text={heroTitleBottom} delay={100} />
          </h1>

          <div className="w-full border border-[#C48A3F]/20 bg-white/60 p-6 shadow-sm backdrop-blur-md md:w-[28rem] md:p-8">
            <div className="mb-4 flex gap-2 border-b border-[#C48A3F]/20 pb-4">
              <div className="h-2 w-2 bg-[#7a6a5c]/50" />
              <div className="h-2 w-2 bg-[#7a6a5c]/50" />
              <div className="h-2 w-2 bg-[#C48A3F]" />
            </div>
            <div className="font-mono text-[0.85rem] leading-[2] text-[#4a3f38]">
              <TerminalText text={content.hero.terminalText} delay={1500} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 w-full border-y border-black/5 bg-[#ebe3d5]/50 px-6 py-24 md:px-20 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div
            ref={addToRefs}
            className="mb-16 translate-y-12 opacity-0 transition-all duration-1000 ease-out md:mb-24"
          >
            <p className="max-w-4xl border-l-2 border-[#C48A3F] pl-6 font-sans text-xl font-light leading-[1.8] text-[#2c241f] md:pl-10 md:text-2xl lg:text-3xl">
              {"\u201C"}
              {overviewQuote.before}
              <span className="font-bold text-[#C48A3F]">{overviewQuote.highlight}</span>
              {overviewQuote.after}
              {"\u201D"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
            <div
              ref={addToRefs}
              className="group translate-y-12 opacity-0 transition-all delay-100 duration-1000 ease-out"
            >
              <div className="mb-4 text-[0.65rem] uppercase tracking-[0.2em] text-[#C48A3F]">
                {firstPath?.eyebrow}
              </div>
              <h2 className="mb-6 font-sans text-4xl font-normal uppercase leading-[1] tracking-[0.03em] transition-colors group-hover:text-[#C48A3F] md:text-5xl">
                {firstPath?.title}
              </h2>
              <p className="text-[0.85rem] leading-[2.2] text-[#7a6a5c]">
                {firstPath?.description}
                <br />
                <span className="mt-4 inline-block border border-[#7a6a5c]/20 bg-white/40 px-3 py-1 text-[0.6rem] tracking-widest text-[#7a6a5c]/80">
                  {firstPath?.badge}
                </span>
              </p>
            </div>

            <div
              ref={addToRefs}
              className="group translate-y-12 opacity-0 transition-all delay-300 duration-1000 ease-out"
            >
              <div className="mb-4 text-[0.65rem] uppercase tracking-[0.2em] text-[#C48A3F]">
                {secondPath?.eyebrow}
              </div>
              <h2 className="mb-6 font-sans text-4xl font-normal uppercase leading-[1] tracking-[0.03em] transition-colors group-hover:text-[#C48A3F] md:text-5xl">
                {secondPath?.title}
              </h2>
              <p className="text-[0.85rem] leading-[2.2] text-[#7a6a5c]">
                {secondPath?.description}
                <br />
                <span className="mt-4 inline-block border border-[#7a6a5c]/20 bg-white/40 px-3 py-1 text-[0.6rem] tracking-widest text-[#7a6a5c]/80">
                  {secondPath?.badge}
                </span>
              </p>
            </div>
          </div>

          <div
            ref={addToRefs}
            className="mt-20 translate-y-12 text-center opacity-0 transition-all duration-1000 ease-out md:mt-32"
          >
            <div className="mx-auto mb-8 h-24 w-[1px] bg-gradient-to-b from-[#C48A3F] to-transparent" />
            <p className="font-sans text-base tracking-widest text-[#4a3f38] md:text-lg">
              {bridgeText.before}
              <span className="font-bold text-[#C48A3F]">{bridgeText.highlight}</span>
              {bridgeText.after}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 w-full px-6 py-32 md:px-20">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-24">
          <div
            ref={addToRefs}
            className="translate-y-12 opacity-0 transition-all duration-1000 ease-out"
          >
            <h3 className="font-sans text-2xl font-light leading-[1.6] text-[#2c241f] md:text-4xl md:leading-[1.8]">
              {visionStatement.before}
              <span className="border-b-2 border-[#C48A3F]/30 pb-1 text-[#C48A3F]">
                {visionStatement.highlight}
              </span>
              {visionStatement.after}
            </h3>
          </div>

          <div
            ref={addToRefs}
            className="group relative translate-y-12 overflow-hidden border border-[#C48A3F]/20 bg-white/70 p-8 opacity-0 shadow-sm backdrop-blur-md transition-all duration-1000 ease-out md:p-14"
          >
            <div className="pointer-events-none absolute right-0 top-0 p-6 font-sans text-8xl font-black italic text-[#2c241f] opacity-[0.03] transition-opacity group-hover:opacity-10">
              SHIFT
            </div>

            <div className="mb-8 text-[0.6rem] uppercase tracking-[0.25em] text-[#C48A3F]">
              {content.vision.eyebrow}
            </div>

            <div className="flex flex-col gap-6 text-[0.9rem] leading-[2.2] text-[#7a6a5c] md:text-[0.95rem]">
              <p>{visionIntro}</p>
              <p className="text-[#4a3f38]">
                {visionTransitionLead.before}
                <span className="font-medium text-[#C48A3F]">{visionTransitionLead.highlight}</span>
                {visionTransitionTail.before}
                <strong className="mx-1 font-bold tracking-widest text-[#2c241f] underline decoration-[#C48A3F]/50 underline-offset-4">
                  {visionTransitionTail.highlight}
                </strong>
                {visionTransitionTail.after}
              </p>
              <p>{visionFuture}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 w-full border-t border-black/5 bg-[#ebe3d5]/80 px-6 py-32 md:px-20">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-10">
          <div className="select-none whitespace-nowrap font-sans text-[20vw] font-black text-[#d0c6b6]">
            {content.manifesto.watermark}
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] text-center">
          <div
            ref={addToRefs}
            className="mb-20 translate-y-12 opacity-0 transition-all duration-1000 ease-out"
          >
            <p className="mx-auto max-w-2xl text-[0.85rem] leading-[2.2] text-[#7a6a5c] md:text-base">
              {manifestoIntro.before}
              <span className="px-1 font-medium text-[#2c241f]">{manifestoIntro.highlight}</span>
              {manifestoIntro.after}
            </p>
          </div>

          <div
            ref={addToRefs}
            className="flex translate-y-12 flex-col items-center justify-center gap-6 opacity-0 transition-all delay-200 duration-1000 ease-out md:gap-10"
          >
            <h2 className="font-sans text-3xl font-bold tracking-tighter text-[#2c241f] md:text-5xl lg:text-7xl">
              {manifestoLineOneParts.before}
              <span className="text-[#C48A3F]">{manifestoLineOneParts.highlight}</span>
              {manifestoLineOneParts.after}
            </h2>
            <h2 className="font-sans text-3xl font-bold tracking-tighter text-[#2c241f] md:text-5xl lg:text-7xl">
              {manifestoLineTwoParts.before}
              <span className="text-[#C48A3F]">{manifestoLineTwoParts.highlight}</span>
              {manifestoLineTwoParts.after}
            </h2>
          </div>

          <div
            ref={addToRefs}
            className="mt-24 translate-y-12 opacity-0 transition-all delay-400 duration-1000 ease-out"
          >
            <p className="font-sans text-xl font-light italic tracking-wide text-[#7a6a5c] md:text-3xl">
              {"\""}
              {content.manifesto.quote}
              {"\""}
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 w-full border-t border-black/5 bg-[#e5ddd0] px-6 py-24 md:px-20">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-12 md:flex-row md:items-end">
          <div
            ref={addToRefs}
            className="max-w-xl translate-y-12 opacity-0 transition-all duration-1000 ease-out"
          >
            <div className="mb-6 h-[1px] w-8 bg-[#C48A3F]" />
            <p className="whitespace-pre-line text-[0.8rem] leading-[2.2] text-[#7a6a5c] md:text-[0.85rem]">
              {content.footer.description}
            </p>
          </div>

          <div
            ref={addToRefs}
            className="translate-y-12 text-left opacity-0 transition-all delay-200 duration-1000 ease-out md:text-right"
          >
            <Link
              href="/"
              className="cursor-pointer font-sans text-4xl font-bold uppercase tracking-[0.05em] text-[#2c241f]/10 transition-colors hover:text-[#C48A3F] md:text-6xl"
            >
              <ScrambleText text={content.footer.ctaLabel} delay={500} />
            </Link>
            <div className="mt-4 text-[0.55rem] uppercase tracking-[0.3em] text-[#7a6a5c]">
              {content.footer.statusLabel}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
