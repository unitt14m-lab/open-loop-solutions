import { LEGAL_DISCLAIMER } from "@/lib/marketplace";

/** Legal placeholder shown across the marketplace surfaces. */
export function MarketplaceDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-2xl border border-border/60 bg-secondary/50 p-4 text-xs font-bold leading-relaxed text-muted-foreground ${className}`}
    >
      {LEGAL_DISCLAIMER}
    </p>
  );
}

/** High-contrast status pill used for accounts, opportunities, quotes and commissions. */
export function StatusBadge({
  status,
  map,
}: {
  status: string;
  map: Record<string, { label: string; tone: string }>;
}) {
  const entry = map[status] ?? { label: status, tone: "bg-muted text-foreground" };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold ${entry.tone}`}>
      {entry.label}
    </span>
  );
}
