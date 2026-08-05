import { Check } from "lucide-react";
import { PackageRequestDialog } from "@/components/PackageRequestDialog";
import type { Pkg } from "@/data/site";


export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  light?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {eyebrow && (
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide ${
            light ? "bg-primary-foreground/10" : "bg-accent text-accent-foreground"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "opacity-80" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export function PackageCard({ pkg }: { pkg: Pkg }) {
  return (
    <article className="card-elevated flex h-full flex-col p-7">
      {pkg.featured && (
        <span className="mb-3 inline-flex w-fit rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold text-gold-foreground">
          الأكثر طلباً
        </span>
      )}
      <h3 className="text-lg font-extrabold leading-snug">{pkg.title}</h3>
      <p className="mt-1 text-sm font-semibold text-primary">{pkg.subtitle}</p>

      <ul className="mt-5 flex-1 space-y-3">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl bg-secondary p-4">
        {pkg.price && <p className="text-xl font-extrabold text-secondary-foreground">{pkg.price}</p>}
        {pkg.tiers && (
          <div className="space-y-3">
            {pkg.tiers.map((t) => (
              <div key={t.label}>
                <p className="text-xs font-bold text-muted-foreground">{t.label}</p>
                <p className="mt-1 text-sm font-extrabold text-secondary-foreground">{t.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button asChild className="mt-4 w-full rounded-full font-bold">
        <Link to="/booking">اطلب الباقة</Link>
      </Button>
    </article>
  );
}
