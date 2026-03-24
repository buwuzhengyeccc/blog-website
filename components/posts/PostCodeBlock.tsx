"use client";

import { useMemo, useState } from "react";

export function PostCodeBlock({
  code,
  language = "text"
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const lineCount = useMemo(() => code.split(/\r?\n/).length, [code]);
  const isLongBlock = lineCount > 18 || code.length > 1200;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-12 w-full overflow-hidden border border-[#d4a84b]/15 bg-[#14100d] shadow-[0_0_0_1px_rgba(212,168,75,0.05)] transition-all duration-300 hover:border-[#d4a84b]/30 hover:shadow-[0_0_20px_rgba(212,168,75,0.03)]">
      <div className="flex items-center justify-between border-b border-[#d4a84b]/10 bg-[#1a1512] px-5 py-2.5">
        <div className="flex items-center gap-4">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[#8a7b6e]">
            SYSTEM.LOG
          </span>
          <span className="h-[1px] w-6 bg-[#d4a84b]/20" />
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#d4a84b]">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isLongBlock ? (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              className="text-[0.6rem] uppercase tracking-[0.18em] text-[#8a7b6e] transition-colors hover:text-[#d4a84b]"
            >
              {expanded ? "Collapse" : `Expand ${lineCount} lines`}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-[#8a7b6e] transition-colors hover:text-[#d4a84b]"
          >
            {copied ? (
              <span className="text-[#d4a84b]">COPIED!</span>
            ) : (
              <>
                <span>COPY</span>
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="relative">
        <pre
          className={`overflow-x-auto p-6 text-[0.92rem] leading-[1.8] text-[#e9dfd2] md:p-8 ${
            isLongBlock && !expanded ? "max-h-[24rem] overflow-hidden" : ""
          }`}
        >
          <code className="bg-transparent p-0 font-mono text-[0.88em]">{code}</code>
        </pre>
        {isLongBlock && !expanded ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#14100d] via-[#14100d]/95 to-transparent" />
        ) : null}
      </div>
    </div>
  );
}
