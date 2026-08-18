import jood from "@/assets/partner-jood.png.asset.json";
import ghaith from "@/assets/partner-ghaith.png.asset.json";
import ataa from "@/assets/partner-ataa.png.asset.json";
import { partners } from "@/data/site";

const partnerLogos = [
  { name: "جمعية الجود للخدمات الإنسانية", src: jood.url },
  { name: "جمعية غيث للخدمات الإنسانية", src: ghaith.url },
  { name: "جمعية عطاء للخدمات الإنسانية", src: ataa.url },
];

export function PartnersMarquee() {
  const logoCards = partnerLogos.map((p) => ({
    key: p.name,
    content: (
      <div className="group flex h-32 w-[230px] shrink-0 items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:border-white/10">
        <img
          src={p.src}
          alt={`شعار ${p.name}`}
          loading="lazy"
          className="max-h-[65px] w-auto object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 dark:[filter:brightness(0)_invert(1)]"
        />
      </div>
    ),
  }));

  const textCards = partners.map((p) => ({
    key: p,
    content: (
      <div className="flex h-32 w-[230px] shrink-0 items-center justify-center rounded-2xl border border-border bg-card px-6 text-center text-sm font-bold text-muted-foreground shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:border-white/10">
        {p}
      </div>
    ),
  }));

  const allCards = [...logoCards, ...textCards];
  // Duplicate twice (3 total sets) so the track is always wider than any viewport.
  // The CSS animation translates exactly -50%, matching one full duplicated pair.
  const track = [...allCards, ...allCards, ...allCards];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl">
        <div className="marquee-track">
          {track.map((card, i) => (
            <div key={`${card.key}-${i}`} className="shrink-0">
              {card.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
