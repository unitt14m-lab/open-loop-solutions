import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PackageCard } from "@/components/Sections";
import type { Pkg } from "@/data/site";

function usePerPage() {
  const [perPage, setPerPage] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setPerPage(mq.matches ? 3 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return perPage;
}

export function PackagesCarousel({ items }: { items: Pkg[] }) {
  const perPage = usePerPage();
  const [page, setPage] = useState(0);

  const pages = useMemo(() => {
    const out: Pkg[][] = [];
    for (let i = 0; i < items.length; i += perPage) out.push(items.slice(i, i + perPage));
    return out;
  }, [items, perPage]);

  const total = pages.length;
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(total - 1, 0)));
  }, [total]);

  const go = (dir: number) => setPage((p) => Math.min(Math.max(p + dir, 0), total - 1);

  return (
    <div className="mt-12">
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(${page * 100}%)`,
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {pages.map((group, gi) => (
            <div
              key={gi}
              className="w-full shrink-0 grid gap-6 md:grid-cols-3"
              style={{ opacity: gi === page ? 1 : 0.4, transition: "opacity 0.4s ease-in-out" }}
            >
              {group.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="السابق"
            onClick={() => go(-1)}
            disabled={page === 0}
            className="rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-accent disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex items-center gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`الصفحة ${i + 1}`}
                onClick={() => setPage(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === page ? "w-7 bg-primary dark:bg-gold" : "w-2.5 bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="التالي"
            onClick={() => go(1)}
            disabled={page === total - 1}
            className="rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-accent disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
