"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Post, PostBlock } from "@/lib/posts";

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isRevealed) {
          timerRef.current = setTimeout(() => setIsRevealed(true), delay);
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [delay, isRevealed]);

  useEffect(() => {
    if (!isRevealed) {
      setDisplayText(text.replace(/./g, " "));
      return;
    }

    let iteration = 0;

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

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

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

function ArticleBlockView({
  block,
  addToRefs,
  revealRefs
}: {
  block: PostBlock;
  addToRefs: (element: HTMLElement | null) => void;
  revealRefs: React.MutableRefObject<HTMLElement[]>;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <div
          key={block.id}
          ref={addToRefs}
          className="translate-y-6 opacity-0 transition-all duration-700 ease-out"
        >
          <p className="font-mono text-[0.85rem] leading-[2] text-[#ede8df]/70 md:text-[0.95rem] md:leading-[1.8]">
            {block.content}
          </p>
        </div>
      );

    case "heading":
      return (
        <div
          key={block.id}
          ref={addToRefs}
          className="mb-2 mt-10 translate-y-6 opacity-0 transition-all duration-700 ease-out"
        >
          <div
            className="mb-4 h-[1px] w-8 origin-left scale-x-0 bg-[#d4a84b] opacity-0 transition-all delay-300 duration-700"
            ref={(element) => {
              if (element && !revealRefs.current.includes(element)) {
                revealRefs.current.push(element);
              }
            }}
          />
          <h2 className="min-h-[1.5em] font-sans text-4xl font-normal uppercase leading-[0.92] tracking-[0.03em] md:text-5xl">
            <ScrambleText text={block.content} delay={200} />
          </h2>
        </div>
      );

    case "quote":
      return (
        <div
          key={block.id}
          ref={addToRefs}
          className="my-8 w-full translate-y-6 border-l border-[#d4a84b]/30 bg-[#1c1814]/80 p-8 opacity-0 backdrop-blur-md backdrop-saturate-150 transition-all duration-700 ease-out md:-ml-[5%] md:w-[110%] md:p-12"
        >
          <div className="mb-6 text-[0.6rem] uppercase tracking-[0.25em] text-[#d4a84b]">
            INSIGHT
          </div>
          <p className="font-sans text-3xl font-normal uppercase leading-[1] tracking-[0.03em] text-[#ede8df] md:text-[2.5rem]">
            {block.content}
          </p>
        </div>
      );

    case "image":
      return (
        <figure
          key={block.id}
          ref={addToRefs}
          className="my-10 w-full translate-y-6 opacity-0 transition-all duration-700 ease-out md:-ml-[10%] md:w-[120%]"
        >
          <div className="group relative overflow-hidden border border-[#d4a84b]/10 bg-[#1c1814]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.content}
              alt={block.caption || "Article visual"}
              className="h-auto w-full object-cover grayscale contrast-125 opacity-80 transition-all duration-700 ease-in-out group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-5 flex items-center gap-4">
              <span className="h-[1px] w-6 shrink-0 bg-[#d4a84b]" />
              <span className="text-[0.6rem] uppercase tracking-[0.25em] text-[#8a7b6e]">
                <ScrambleText text={block.caption} delay={300} />
              </span>
            </figcaption>
          ) : null}
        </figure>
      );

    default:
      return null;
  }
}

export function PostDetail({
  post,
  backHref = "/"
}: {
  post: Post;
  backHref?: string;
}) {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hudPctRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

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
            entry.target.classList.add("opacity-100", "translate-y-0", "scale-100");
            entry.target.classList.remove("opacity-0", "translate-y-6", "scale-x-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealRefs.current.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [post.blocks, post.slug]);

  const addToRefs = useCallback((element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) {
      revealRefs.current.push(element);
    }
  }, []);

  const handleGlobalMouseMove = (event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  };

  const [dateMonth = "", dateDay = ""] = post.date.split(" ");

  return (
    <div
      onMouseMove={handleGlobalMouseMove}
      className="relative min-h-screen overflow-x-hidden bg-[#1c1814] font-mono text-[#ede8df] selection:bg-[#d4a84b] selection:text-[#1c1814]"
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `
            repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 48px),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 48px),
            #14100d
          `
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-40 mix-blend-color-dodge"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 168, 75, 0.15), transparent 40%)`
          }}
        />
      </div>

      <div className="fixed right-4 top-4 z-50 text-right text-[0.65rem] uppercase tracking-[0.15em] text-[#8a7b6e] md:right-8 md:top-8">
        <div ref={hudPctRef}>000%</div>
        <div className="relative ml-auto mt-2 h-[1px] w-[7.5rem] overflow-hidden bg-[#8a7b6e]/30">
          <div
            ref={progressFillRef}
            className="absolute inset-y-0 left-0 w-0 bg-[#d4a84b] transition-all duration-100 ease-linear"
          />
        </div>
        <div className="mt-1.5 text-[0.6rem] text-[#d4a84b]">READING</div>
      </div>

      <div className="fixed left-6 top-8 z-50 md:left-[calc(2rem+0.125rem)]">
        <MagneticWrapper>
          <button
            onClick={handleBack}
            className="group flex cursor-pointer items-center gap-3 p-4 -m-4 text-[0.6rem] uppercase tracking-[0.25em] text-[#8a7b6e] transition-colors hover:text-[#d4a84b]"
          >
            <div className="h-[1px] w-6 origin-left bg-[#8a7b6e] transition-all duration-300 group-hover:w-8 group-hover:bg-[#d4a84b]" />
            BACK
          </button>
        </MagneticWrapper>
      </div>

      <header className="relative z-10 flex min-h-[90vh] w-full flex-col justify-center px-6 pb-10 pt-20 md:px-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 lg:flex-row lg:gap-0">
          <div
            ref={addToRefs}
            className="h-[50vh] w-full translate-y-6 opacity-0 transition-all duration-1000 ease-out lg:absolute lg:right-10 lg:top-1/2 lg:h-[70vh] lg:w-3/5 lg:-translate-y-1/2"
          >
            <div className="group relative h-full w-full overflow-hidden border border-[#d4a84b]/10 bg-[#1c1814]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover object-center grayscale contrast-125 opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
          </div>

          <div
            ref={addToRefs}
            className="relative z-10 w-full translate-y-6 border-l border-[#d4a84b]/30 bg-[#1c1814]/85 p-8 opacity-0 backdrop-blur-md backdrop-saturate-150 transition-all delay-200 duration-1000 ease-out md:p-12 lg:w-[28.75rem]"
          >
            <div className="mb-6 h-[1px] w-12 bg-[#d4a84b]" />
            <div className="mb-6 min-h-[1em] text-[0.6rem] uppercase tracking-[0.25em] text-[#d4a84b]">
              <ScrambleText text={post.tag} delay={500} />
            </div>
            <h1 className="min-h-[3em] font-sans text-6xl font-normal leading-[0.92] tracking-[0.03em] md:text-[6.5rem]">
              <ScrambleText text={post.title} delay={800} />
            </h1>
            <p className="mt-6 text-sm leading-[1.9] text-[#ede8df]/68 md:text-[0.95rem]">
              {post.summary}
            </p>
            {post.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d4a84b]/20 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-[#d4a84b]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-12 flex flex-wrap gap-8 border-t border-[#d4a84b]/10 pt-8 md:gap-12">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[2.2rem] leading-none text-[#d4a84b]">{dateDay}</span>
                <span className="text-[0.58rem] uppercase tracking-[0.2em] text-[#8a7b6e]">{dateMonth}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[2.2rem] leading-none text-[#d4a84b]">
                  {post.readTime.split(" ")[0]}
                </span>
                <span className="text-[0.58rem] uppercase tracking-[0.2em] text-[#8a7b6e]">
                  MIN READ
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[2.2rem] leading-none text-[#d4a84b]">BY</span>
                <span className="text-[0.58rem] uppercase tracking-[0.2em] text-[#8a7b6e]">
                  <ScrambleText text={post.author} delay={1500} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full px-6 py-20 pb-40 md:px-20">
        <div className="mx-auto flex max-w-[800px] flex-col gap-12 md:gap-16">
          {post.blocks.map((block) => (
            <ArticleBlockView
              key={block.id}
              block={block}
              addToRefs={addToRefs}
              revealRefs={revealRefs}
            />
          ))}

          <div
            ref={addToRefs}
            className="flex justify-center translate-y-6 pt-20 opacity-0 transition-all duration-700 ease-out"
          >
            <div className="flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.25em] text-[#8a7b6e]">
              <span className="h-[1px] w-8 bg-[#d4a84b]/30" />
              END OF SYSTEM LOG
              <span className="h-[1px] w-8 bg-[#d4a84b]/30" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
