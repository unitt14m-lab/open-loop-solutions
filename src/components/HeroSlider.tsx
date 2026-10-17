import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import crownPrince from "@/assets/hero-crown-prince.jpg.asset.json";
import wise from "@/assets/hero-wise.jpg.asset.json";
import tabahoth from "@/assets/hero-tabahoth.jpg.asset.json";

/**
 * Image-only banner slides. Each banner already carries its own design and
 * text, so nothing is overlaid on top of it and nothing is cropped.
 * To add/replace/remove a banner: change an entry in this list.
 */
const slides: { image: string; alt: string; width: number; height: number }[] = [
  {
    image: crownPrince.url,
    alt: "بانر عزّنا بطبعنا — الأمير ولي العهد محمد بن سلمان",
    width: 800,
    height: 451,
  },
  {
    image: wise.url,
    alt: "بانر الإِنسَانُ أَوَّلًا — وايز 12، مؤسسة قطر، 24-25 نوفمبر 2025",
    width: 1199,
    height: 675,
  },
  {
    image: tabahoth.url,
    alt: "بانر الهوية البصرية تباحُثْ Tabahoth — الفكر حين يُمارَس",
    width: 800,
    height: 449,
  },
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
            width={s.width}
            height={s.height}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`col-start-1 row-start-1 block h-auto w-full object-cover transition-opacity duration-1000 ${
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
