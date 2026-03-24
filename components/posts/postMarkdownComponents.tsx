import type { Components } from "react-markdown";
import { PostCodeBlock } from "@/components/posts/PostCodeBlock";

export const markdownComponents: Components = {
  h1({ children }) {
    return (
      <h1 className="mt-20 mb-8 flex max-w-[800px] items-center gap-5 font-sans text-4xl font-normal leading-[1.05] tracking-[0.02em] text-[#f5f0e8] before:block before:h-[2px] before:w-12 before:bg-[#d4a84b]/80 md:text-5xl">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="mt-16 mb-6 flex max-w-[800px] items-center gap-4 font-sans text-2xl font-normal uppercase tracking-[0.05em] text-[#f5f0e8] before:block before:h-[1px] before:w-8 before:bg-[#d4a84b]/60 md:text-[2rem]">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="mt-12 mb-4 max-w-[800px] font-sans text-xl font-normal uppercase tracking-[0.04em] text-[#e7dcc8] md:text-[1.4rem]">
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="mt-8 mb-3 max-w-[800px] font-sans text-lg uppercase tracking-[0.03em] text-[#efe2cd]">
        {children}
      </h4>
    );
  },
  p({ children }) {
    return (
      <p className="mb-8 max-w-[800px] text-[1.04rem] leading-[2.05] tracking-[0.02em] text-[#ddd6cb] md:text-[1.08rem]">
        {children}
      </p>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold text-[#f5f0e8]">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-[#efe2cd]">{children}</em>;
  },
  del({ children }) {
    return <del className="text-[#9b8e82]">{children}</del>;
  },
  a({ children, href }) {
    return (
      <a
        href={href}
        className="text-[#d4a84b] underline decoration-[#d4a84b]/30 underline-offset-4 transition-colors hover:text-[#f3dfb2] hover:decoration-[#d4a84b]"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },
  ul({ children }) {
    return (
      <ul className="mb-8 max-w-[800px] list-disc space-y-3 pl-6 text-[1rem] leading-[2.05] text-[#ddd6cb] marker:text-[#d4a84b]/60">
        {children}
      </ul>
    );
  },
  ol({ children }) {
    return (
      <ol className="mb-8 max-w-[800px] list-decimal space-y-3 pl-6 text-[1rem] leading-[2.05] text-[#ddd6cb] marker:text-[#d4a84b]/60">
        {children}
      </ol>
    );
  },
  li({ children }) {
    return <li className="pl-2">{children}</li>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="relative mb-12 max-w-[920px] border-l border-[#d4a84b]/40 bg-[#1a1512]/60 px-8 py-7 text-[1.15rem] leading-[2] text-[#f1e8db] shadow-[0_0_0_1px_rgba(212,168,75,0.05)]">
        <div className="mb-5 text-[0.65rem] uppercase tracking-[0.25em] text-[#d4a84b]">
          INSIGHT
        </div>
        <div className="space-y-4 [&_p:last-child]:mb-0">{children}</div>
      </blockquote>
    );
  },
  code(props) {
    const { children, className } = props;
    const value = String(children).replace(/\n$/, "");
    const match = /language-([\w-]+)/.exec(className || "");

    if (match) {
      return <PostCodeBlock code={value} language={match[1]} />;
    }

    return (
      <code className="rounded border border-[#d4a84b]/20 bg-[#17120f] px-1.5 py-0.5 font-mono text-[0.85em] text-[#f3dfb2]">
        {children}
      </code>
    );
  },
  img({ src, alt, title }) {
    return (
      <figure className="my-16 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || ""}
          alt={alt || "Article visual"}
          className="my-0 w-full border border-[#d4a84b]/10 bg-[#1c1814] object-cover grayscale-[30%] transition-all duration-700 hover:grayscale-0"
        />
        {title || alt ? (
          <figcaption className="mt-5 border-l border-[#8a7b6e]/30 pl-4 text-left text-[0.65rem] uppercase tracking-[0.25em] text-[#8a7b6e]">
            {title || alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
  hr() {
    return <hr className="my-20 w-full border-0 border-t border-[#d4a84b]/20" />;
  },
  table({ children }) {
    return (
      <div className="my-16 w-full overflow-x-auto border border-[#d4a84b]/15 bg-[#14100d] shadow-[0_0_0_1px_rgba(212,168,75,0.03)]">
        <table className="w-full min-w-[40rem] border-collapse text-left">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="border-b border-[#d4a84b]/20 bg-[#1a1512]">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody>{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="border-b border-[#d4a84b]/10 last:border-b-0">{children}</tr>;
  },
  th({ children }) {
    return (
      <th className="px-6 py-5 align-top font-sans text-[0.72rem] uppercase tracking-[0.2em] text-[#d4a84b]">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="px-6 py-5 align-top text-[0.98rem] leading-8 text-[#ede8df]">{children}</td>;
  }
};
