import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BarChart3, Palette, PenTool, Megaphone, Calculator, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { serviceCategories } from "@/data/site";
import { SectionHeading } from "@/components/Sections";

const iconMap = {
  resources: BarChart3,
  design: Palette,
  content: PenTool,
  marketing: Megaphone,
  tax: Calculator,
};

export function ServicesShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActive = () => {
      const trackRect = track.getBoundingClientRect();
      const trackStart = trackRect.right; // start edge in RTL
      let best = 0;
      let bestDistance = Infinity;
      Array.from(track.children).forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const distance = Math.abs(cardRect.right - trackStart);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      setActive(best);
    };

    updateActive();
    track.addEventListener("scroll", updateActive, { passive: true });
    return () => track.removeEventListener("scroll", updateActive);
  }, []);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const prev = () => scrollTo(Math.max(0, active - 1));
  const next = () => scrollTo(Math.min(serviceCategories.length - 1, active + 1));

  return (
    <section className="section-pad bg-surface overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="منظومة الخدمات"
          title="خدماتنا المتميزة"
          description="خمس منظومات خدمية متكاملة مصممة خصيصاً للجمعيات والمؤسسات الأهلية، من التأهيل للمنح إلى بناء الهوية والمحتوى والحملات."
        />
      </div>

      <div className="relative mt-12">
        {/* Navigation arrows — desktop only */}
        <button
          type="button"
          onClick={prev}
          disabled={active === 0}
          aria-label="الخدمة السابقة"
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-card/90 p-2.5 text-foreground shadow-lg backdrop-blur transition-all hover:bg-card hover:text-gold disabled:opacity-30 disabled:hover:text-foreground lg:flex"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={next}
          disabled={active === serviceCategories.length - 1}
          aria-label="الخدمة التالية"
          className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-card/90 p-2.5 text-foreground shadow-lg backdrop-blur transition-all hover:bg-card hover:text-gold disabled:opacity-30 disabled:hover:text-foreground lg:flex"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        {/* Carousel track */}
        <div
          ref={trackRef}
          dir="rtl"
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 scrollbar-hide sm:px-6 lg:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {serviceCategories.map((c, i) => {
            const Icon = iconMap[c.iconName ?? "resources"];
            return (
              <Link
                key={c.slug}
                data-index={i}
                to="/services/$category"
                params={{ category: c.slug }}
                className="group relative flex aspect-square h-full max-h-[280px] w-[320px] max-w-[320px] snap-start flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-sm font-extrabold text-gold">
                    {c.order}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground dark:bg-gold/10 dark:text-gold dark:group-hover:bg-gold dark:group-hover:text-gold-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>

                <div className="flex-1 py-3">
                  <h3 className="text-lg font-extrabold leading-snug">{c.title}</h3>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-extrabold text-primary dark:text-gold">
                  عرض الخدمات
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="مؤشرات الخدمات">
          {serviceCategories.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`الخدمة ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-gold" : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
