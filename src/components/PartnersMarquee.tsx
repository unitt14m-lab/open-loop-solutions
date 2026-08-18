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
  const items = [
    ...partnerLogos.map((partner) => ({
      key: partner.name,
      content: (
        <div className="group flex h-32 items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:border-white/10">
          <img
            src={partner.src}
            alt={`شعار ${partner.name}`}
            loading="lazy"
            className="max-h-[65px] w-auto max-w-full object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 dark:[filter:brightness(0)_invert(1)]"
          />
        </div>
      ),
    })),
    ...partners.map((partner) => ({
      key: partner,
      content: (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-border bg-card px-6 text-center text-sm font-bold text-muted-foreground shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg dark:border-white/10">
          {partner}
        </div>
      ),
    })),
  ];

  const duplicatedItems = [...items, ...items];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="marquee-container rounded-3xl" dir="ltr">
        <div className="marquee-track">
          {duplicatedItems.map((item, index) => (
            <div className="partner-card" key={`${item.key}-${index}`}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
