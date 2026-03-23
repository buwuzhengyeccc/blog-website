"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import type { ContactPageContent } from "@/lib/pages";

type SocialItem = {
  name: string;
  desc: string;
  url: string;
  icon: React.ReactNode;
};

type ContactIntroPageProps = {
  content: ContactPageContent;
};

function getSocialIcon(name: string) {
  switch (name.toLowerCase()) {
    case "github":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    case "twitter":
    case "x":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
  }
}

export function ContactIntroPage({ content }: ContactIntroPageProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const email = content.emailCard.email;

  useEffect(() => {
    setMounted(true);
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const setCopiedState = () => {
    setCopied(true);
    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current);
    }
    copiedTimerRef.current = setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedState();
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        setCopiedState();
      } catch (error) {
        console.error("Copy failed", error);
      }

      document.body.removeChild(textArea);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  const socials: SocialItem[] = content.socials.map((social) => ({
    ...social,
    icon: getSocialIcon(social.name)
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3ede4] font-sans text-[#4a4238] selection:bg-[#d4a84b]/20 selection:text-[#4a4238]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] animate-blob rounded-full bg-[#eadfce]/68 blur-[84px] mix-blend-multiply md:blur-[124px]" />
        <div className="animation-delay-2000 absolute right-[-10%] top-[20%] h-[45vw] w-[45vw] animate-blob rounded-full bg-[#e7d7c1]/56 blur-[84px] mix-blend-multiply md:blur-[124px]" />
        <div className="animation-delay-4000 absolute bottom-[-20%] left-[20%] h-[60vw] w-[60vw] animate-blob rounded-full bg-[#efe4d8]/62 blur-[84px] mix-blend-multiply md:blur-[124px]" />
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(74,66,56,0.035) 0, rgba(74,66,56,0.035) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(74,66,56,0.03) 0, rgba(74,66,56,0.03) 1px, transparent 1px, transparent 48px), radial-gradient(circle at top, rgba(212,168,75,0.08), transparent 42%), #f3ede4"
          }}
        />
      </div>

      <nav
        className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between p-6 transition-opacity duration-1000 md:p-10 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 text-[#8c7a6b] transition-colors hover:text-[#b88a55]"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="text-sm uppercase tracking-widest">{content.nav.backLabel}</span>
        </button>
        <div className="text-sm uppercase tracking-[0.2em] text-[#8c7a6b]">{content.nav.title}</div>
      </nav>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 py-32 md:px-12 lg:px-24">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-stretch lg:gap-24">
          <div className="flex w-full max-w-xl flex-1 flex-col justify-center">
            <div
              className={`transition-all delay-100 duration-1000 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="mb-8 flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.28em] text-[#8c7a6b]">
                <span className="h-[1px] w-10 bg-[#b88a55]" />
                {content.hero.eyebrow}
              </div>
              <h1 className="mb-6 font-serif text-4xl leading-[1.2] text-[#3d332d] md:text-5xl lg:text-6xl">
                {content.hero.titleLine1}
                <br />
                <span className="font-light italic text-[#8c7a6b]">{content.hero.titleLine2}</span>
              </h1>
              <p className="mb-12 text-base leading-[2] text-[#7a7068] md:text-lg">
                {content.hero.description}
              </p>
            </div>

            <div
              className={`transition-all delay-300 duration-1000 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="rounded-[2rem] border border-white/45 bg-white/58 p-8 shadow-[0_10px_36px_rgba(74,66,56,0.08)] backdrop-blur-xl md:p-10">
                <div className="mb-2 text-sm uppercase tracking-widest text-[#8c7a6b]">
                  {content.emailCard.label}
                </div>
                <div className="mb-8 break-all font-serif text-2xl tracking-wide text-[#3d332d] md:text-3xl">
                  {email}
                </div>

                <button
                  onClick={handleCopyEmail}
                  className={`flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-all duration-300 md:w-auto ${
                    copied
                      ? "bg-[#e7efe6] text-[#5c8a65]"
                      : "bg-[#4a4238] text-white hover:-translate-y-1 hover:bg-[#3d332d] hover:shadow-lg"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {content.emailCard.copiedLabel}
                    </>
                  ) : (
                    content.emailCard.copyLabel
                  )}
                </button>
              </div>
            </div>
          </div>

          <div
            className={`flex w-full flex-1 flex-col justify-center lg:max-w-md ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            } transition-all delay-500 duration-1000 ease-out`}
          >
            <div className="space-y-4">
              <div className="mb-8 ml-4 text-sm uppercase tracking-widest text-[#8c7a6b]">
                {content.socialsTitle}
              </div>

              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl border border-transparent bg-transparent p-6 transition-all duration-500 ease-out hover:border-white/45 hover:bg-white/38"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/68 text-[#8c7a6b] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:text-[#b88a55]">
                      {social.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-serif text-xl text-[#3d332d] transition-colors group-hover:text-[#b88a55]">
                        {social.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#8c7a6b]">{social.desc}</p>
                    </div>
                    <div className="translate-x-[-1rem] text-[#8c7a6b] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `
        }}
      />
    </div>
  );
}
