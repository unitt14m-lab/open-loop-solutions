import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Calculator,
  ClipboardList,
  Megaphone,
  Minus,
  Palette,
  PenTool,
  Plus,
  Rocket,
  SearchCheck,
  UtensilsCrossed,
} from "lucide-react";
import { serviceCategories } from "@/data/site";
import { FAQ } from "@/data/legal";
import { SectionHeading } from "@/components/Sections";

const iconMap = {
  resources: BarChart3,
  design: Palette,
  content: PenTool,
  marketing: Megaphone,
  tax: Calculator,
} as const;

export function ServiceTabs() {
  const [active, setActive] = useState(0);
  const c = serviceCategories[active] ?? serviceCategories[0]!;
  const ActiveIcon = iconMap[c.iconName ?? "resources"];

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="خدماتنا"
          title="كل ما تحتاجه جمعيتك في مكان واحد"
          description="تنقّل بين أقسام الخدمات واطلب ما يناسبك مباشرة."
        />

        <div
          role="tablist"
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm"
        >
          {serviceCategories.map((cat, i) => {
            const Icon = iconMap[cat.iconName ?? "resources"];
            const on = i === active;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
                  on
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {cat.title.replace("خدمات ", "")}
              </button>
            );
          })}
          <Link
            to="/catering"
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <UtensilsCrossed className="h-4 w-4" aria-hidden />
            مشاريع الاعاشة
          </Link>
        </div>

        <div
          key={c.slug}
          className="animate-fade-in mt-8 grid gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-lg sm:p-10 lg:grid-cols-[1fr_1.4fr]"
        >
          <div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary dark:text-gold">
              <ActiveIcon className="h-7 w-7" aria-hidden />
            </span>
            <h3 className="mt-5 text-2xl font-extrabold">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/services/$category"
                params={{ category: c.slug }}
                search={{ service: "all" }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                اطلب الخدمة
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/services/$category"
                params={{ category: c.slug }}
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-bold transition-colors hover:bg-secondary"
              >
                التفاصيل
              </Link>
            </div>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {c.items.map((it) => (
              <li key={it}>
                <Link
                  to="/services/$category"
                  params={{ category: c.slug }}
                  search={{ service: it }}
                  className="flex h-full items-start gap-3 rounded-2xl border border-border bg-background p-4 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                  {it}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: ClipboardList, title: "اطلب الخدمة", text: "اختر الخدمة أو الباقة المناسبة وأرسل طلبك خلال دقائق." },
  { icon: SearchCheck, title: "المراجعة", text: "يراجع فريقنا الطلب ويتواصل معك لتحديد النطاق والتفاصيل." },
  { icon: Rocket, title: "التنفيذ", text: "ننفذ العمل باحترافية ونتابع معك حتى تحقيق النتائج." },
];

export function HowWeWork() {
  return (
    <section className="section-pad bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="كيف نعمل" title="ثلاث خطوات وتبدأ" />
        <ol className="relative mt-12 grid gap-6 lg:grid-cols-3">
          <span
            className="absolute inset-x-[16%] top-8 hidden h-px bg-border lg:block"
            aria-hidden
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative text-center">
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card text-primary shadow-md dark:text-gold">
                <s.icon className="h-7 w-7" aria-hidden />
                <span className="absolute -top-2 -start-2 grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-extrabold text-gold-foreground">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-5 text-lg font-extrabold">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="الأسئلة الشائعة" title="لديك سؤال؟" />
        <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start text-base font-bold"
                >
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
                    {on ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <p className="overflow-hidden px-6 text-sm leading-relaxed text-muted-foreground">
                    <span className="block pb-5">{f.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <Link to="/faq" className="text-sm font-bold text-primary dark:text-gold">
            عرض كل الأسئلة
          </Link>
        </div>
      </div>
    </section>
  );
}
