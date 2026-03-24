"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "@/components/posts/postMarkdownComponents";

export function PostMarkdownProgressive({ chunks }: { chunks: string[] }) {
  const initialCount = Math.min(2, chunks.length);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current || visibleCount >= chunks.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        setVisibleCount((current) => Math.min(current + 2, chunks.length));
      },
      { rootMargin: "800px 0px" }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [chunks.length, visibleCount]);

  const visibleChunks = useMemo(() => chunks.slice(0, visibleCount), [chunks, visibleCount]);

  return (
    <div className="font-sans text-[1.05rem] leading-[1.9] tracking-[0.02em] text-[#ddd6cb]">
      {visibleChunks.map((chunk, index) => (
        <ReactMarkdown
          key={`chunk-${index}`}
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {chunk}
        </ReactMarkdown>
      ))}

      {visibleCount < chunks.length ? (
        <div ref={sentinelRef} className="py-8">
          <div className="flex items-center justify-between gap-4 border border-[#d4a84b]/10 bg-[#16110e]/60 px-4 py-3">
            <div className="text-[0.62rem] uppercase tracking-[0.22em] text-[#8a7b6e]">
              Loading next module...
            </div>
            <button
              type="button"
              onClick={() => setVisibleCount((current) => Math.min(current + 4, chunks.length))}
              className="text-[0.62rem] uppercase tracking-[0.18em] text-[#d4a84b] transition-colors hover:text-[#f3dfb2]"
            >
              Load more
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
