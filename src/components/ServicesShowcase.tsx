import { Link } from "@tanstack/react-router";
import { BarChart3, Palette, PenTool, Megaphone, Calculator, ArrowLeft } from "lucide-react";
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
  return (
    <section className="section-pad bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="منظومة الخدمات"
          title="خدماتنا المتميزة"
          description="خمس منظومات خدمية متكاملة مصممة خصيصاً للجمعيات والمؤسسات الأهلية، من التأهيل للمنح إلى بناء الهوية والمحتوى والحملات."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {serviceCategories.map((c) => {
            const Icon = iconMap[c.iconName ?? "resources"];
            return (
              <Link
                key={c.slug}
                to="/services/$category"
                params={{ category: c.slug }}
                className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-sm font-extrabold text-gold">
                    {c.order}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground dark:bg-gold/10 dark:text-gold dark:group-hover:bg-gold dark:group-hover:text-gold-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-extrabold leading-snug">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.description}</p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary dark:text-gold">
                  عرض الخدمات
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
