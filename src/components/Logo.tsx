import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
          light ? "bg-primary-foreground/15" : "surface-primary"
        }`}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="16" cy="16" r="9" strokeLinecap="round" strokeDasharray="42 14" />
          <path d="M23 9l5-5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-lg font-extrabold">أوبن لوب</span>
        <span
          className={`block text-[11px] font-medium tracking-[0.22em] ${
            light ? "opacity-70" : "text-muted-foreground"
          }`}
        >
          OPEN LOOP
        </span>
      </span>
    </Link>
  );
}
