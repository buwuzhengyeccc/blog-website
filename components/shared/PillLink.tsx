import Link from "next/link";

export function PillLink({
  href,
  children,
  variant = "primary"
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "border-gold text-gold hover:bg-gold hover:text-ember"
      : "border-white/15 text-stone-200 hover:border-white hover:text-white light:border-stone-300 light:text-stone-700 light:hover:border-stone-700";

  return (
    <Link
      href={href}
      className={`rounded-full border px-5 py-3 text-xs uppercase tracking-[0.2em] transition ${styles}`}
    >
      {children}
    </Link>
  );
}
