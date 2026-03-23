import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Personal Blog Frontend",
  description: "A personal blog frontend organized with Next.js App Router, TypeScript, and Tailwind CSS."
};

const themeScript = `
try {
  const saved = localStorage.getItem('personal-blog-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (systemDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('light', theme === 'light');
  document.documentElement.classList.toggle('dark', theme !== 'light');
} catch (error) {}
`;

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body className="page-grid min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
