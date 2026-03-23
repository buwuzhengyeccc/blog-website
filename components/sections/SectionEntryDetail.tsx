"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SectionEntry } from "@/lib/sections";

export function SectionEntryDetail({
  entry,
  backHref
}: {
  entry: SectionEntry;
  backHref: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(backHref);
  };

  return (
    <div className="min-h-screen bg-[#111111] px-6 py-10 text-[#f5f0e8] md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={handleBack}
          className="mb-10 inline-flex items-center gap-3 border-b border-[#c3a26b]/40 pb-2 text-[0.7rem] uppercase tracking-[0.2em] text-[#c3a26b]"
        >
          <span aria-hidden="true">&larr;</span>
          Back To Section
        </button>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="text-[0.7rem] uppercase tracking-[0.22em] text-[#c3a26b]">
              {entry.kicker || `${entry.section} / ${entry.type}`}
            </div>

            <h1 className="font-serif text-4xl leading-tight md:text-6xl">{entry.title}</h1>

            <p className="max-w-2xl text-base leading-8 text-[#d0c8bc]">{entry.summary}</p>

            <div className="flex flex-wrap gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-[#9d9284]">
              <span>{entry.date}</span>
              <span>{entry.type}</span>
              {entry.status ? <span>{entry.status}</span> : null}
              {entry.readTime ? <span>{entry.readTime}</span> : null}
            </div>

            {entry.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-stone-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden border border-white/10 bg-[#1a1a1a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.image || "https://assets.codepen.io/573855/demo-monsters-03.webp"}
              alt={entry.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_280px]">
          <article className="border border-white/8 bg-[#151515] p-8 md:p-12">
            <div className="mb-6 text-[0.65rem] uppercase tracking-[0.24em] text-[#c3a26b]">
              Detailed Reading
            </div>
            <div className="whitespace-pre-line text-[0.95rem] leading-8 text-[#ddd6cb]">
              {entry.body}
            </div>
          </article>

          <aside className="border border-white/8 bg-[#151515] p-8">
            <div className="mb-6 text-[0.65rem] uppercase tracking-[0.24em] text-[#c3a26b]">
              Entry Meta
            </div>
            <div className="space-y-4 text-sm text-[#cfc5b8]">
              <div>
                <div className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-[#8f8477]">
                  Section
                </div>
                <div>{entry.section}</div>
              </div>
              <div>
                <div className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-[#8f8477]">
                  Type
                </div>
                <div>{entry.type}</div>
              </div>
              {entry.stack?.length ? (
                <div>
                  <div className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-[#8f8477]">
                    Stack
                  </div>
                  <div>{entry.stack.join(" / ")}</div>
                </div>
              ) : null}
              {entry.author ? (
                <div>
                  <div className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-[#8f8477]">
                    Author
                  </div>
                  <div>{entry.author}</div>
                </div>
              ) : null}
            </div>

            <Link
              href={backHref}
              className="mt-8 inline-flex border border-[#c3a26b] px-5 py-3 text-[0.7rem] uppercase tracking-[0.18em] text-[#c3a26b] transition hover:bg-[#c3a26b] hover:text-[#111111]"
            >
              Return To Section
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
