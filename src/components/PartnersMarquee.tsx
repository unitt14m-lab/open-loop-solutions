import { partners } from "@/data/site";

export function PartnersMarquee() {
  const list = [...partners, ...partners];
  return (
    <div className="relative overflow-hidden">
      <div className="marquee-track flex w-max gap-4">
        {list.map((p, i) => (
          <div
            key={`${p}-${i}`}
            className="flex h-20 min-w-56 items-center justify-center rounded-3xl border border-border bg-card px-8 text-center text-sm font-bold text-muted-foreground"
          >
            {p}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-gradient-to-l from-transparent to-background" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-gradient-to-r from-transparent to-background" />
    </div>
  );
}
