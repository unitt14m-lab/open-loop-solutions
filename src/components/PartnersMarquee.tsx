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
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
      {partnerLogos.map((p) => (
        <div
          key={p.name}
          className="group flex h-32 items-center justify-center rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:border-white/10"
        >
          <img
            src={p.src}
            alt={`شعار ${p.name}`}
            loading="lazy"
            className="max-h-[65px] w-auto object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 dark:[filter:brightness(0)_invert(1)]"
          />
        </div>
      ))}
      {partners.slice(0, 5).map((p) => (
        <div
          key={p}
          className="flex h-32 items-center justify-center rounded-3xl border border-border bg-card px-6 text-center text-sm font-bold text-muted-foreground transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:border-white/10"
        >
          {p}
        </div>
      ))}
    </div>
  );
}
