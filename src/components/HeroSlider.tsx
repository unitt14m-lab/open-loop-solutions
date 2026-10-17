import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import heroMarketing from "@/assets/hero-marketing.jpg";
import heroRelief from "@/assets/hero-relief.jpg";

/**
 * Image-only banner slides. To add/replace a banner: import the image
 * (or use an .asset.json `.url`) and add an entry here.
 */
const slides: { image: string; alt: string }[] = [
  { image: heroImage, alt: "فريق أوبن لوب أثناء جلسة عمل استشارية" },
  { image: heroMarketing, alt: "جلسة تخطيط استراتيجي وتسويق رقمي" },
  { image: heroRelief, alt: "توزيع ميداني لمشاريع الإعاشة والسلال الغذائية" },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const go = (d: number) => setActive((i) => (i + d + slides.length) % slides.length);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background" aria-roledescription="carousel">
      <h1 className="sr-only">أوبن لوب — تسويق واستشارات للقطاع غير الربحي</h1>
      <div className="grid">
        {slides.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt={s.alt}
            width={1920}
            height={1088}
            loading={i === 0 ? "eager" : "lazy"}
            className={`col-start-1 row-start-1 block h-auto w-full object-cover transition-opacity duration-1000 lg:max-h-[80vh] ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== active}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="السابق"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground backdrop-blur transition hover:bg-background sm:block">
            <ChevronRight className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="التالي"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground backdrop-blur transition hover:bg-background sm:block">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button key={s.image} type="button" onClick={() => setActive(i)} aria-label={`الشريحة ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-mist" : "w-3 bg-background/70"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
