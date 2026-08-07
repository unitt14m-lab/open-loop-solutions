import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ArrowLeft, Target, TrendingUp, Megaphone, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { PackageCard, SectionHeading } from "@/components/Sections";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { CateringSection } from "@/components/CateringSection";
import { VolunteerBanner } from "@/components/Footer";
import { packages, serviceCategories } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أوبن لوب | Open Loop — تسويق واستشارات القطاع غير الربحي" },
      {
        name: "description",
        content:
          "أوبن لوب: مؤسسة تسويق واستشارات متكاملة تمكّن الجمعيات والقطاع غير الربحي من الاستدامة المالية والحوكمة المؤسسية وتعميق الأثر.",
      },
      { property: "og:title", content: "أوبن لوب | Open Loop" },
      {
        property: "og:description",
        content: "شريكك الاستراتيجي للاستدامة المالية والحوكمة المؤسسية في القطاع غير الربحي.",
      },
    ],
  }),
  component: Index,
});

const impact = [
  {
    icon: Target,
    value: "+250",
    title: "جمعية ومؤسسة أهلية",
    text: "تمكين أكثر من 250 جمعية ومؤسسة أهلية من الوصول إلى الاستدامة المالية ورفع مؤشرات الحوكمة الشاملة.",
  },
  {
    icon: TrendingUp,
    value: "+50 مليون ريال",
    title: "تنمية واسترداد",
    text: "تنمية واسترداد أكثر من ٥٠ مليون ريال لصالح القطاع غير الربحي عبر منصات المنح (إحسان، اعتماد) وبرامج الاسترداد الضريبي.",
  },
  {
    icon: Megaphone,
    value: "+300",
    title: "حملة تسويقية",
    text: "إدارة وتنفيذ أكثر من ٣٠٠ حملة تسويقية تستهدف تعميق الأثر المجتمعي ومضاعفة التفاعل الرقمي للكيانات الشريكة.",
  },
];

const segments = [
  {
    title: "كيانات غير ربحية تبحث عن التمويل والمنح",
    text: "صياغة مشاريع احترافية وتصميم ملفات متكاملة للمؤسسات المانحة وصندوق دعم الجمعيات.",
  },
  {
    title: "كيانات غير ربحية تسعى لرفع الإيرادات",
    text: "استفادة من منصات الدعم الحكومي والأهلي عبر التأهيل الفني والمالي والتنفيذي.",
  },
  {
    title: "كيانات غير ربحية ترغب في نمو حضورها وتأثيرها",
    text: "حلول تسويقية وإعلانية ممولة لجذب المانحين بثقة.",
  },
];

function Index() {
  return (
    <>
      {/* HERO — to change the background, replace src/assets/hero.jpg or swap the import above */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="فريق أوبن لوب أثناء جلسة عمل استشارية"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/95 via-ink/85 to-ink/60" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 py-24 text-ink-foreground sm:px-6 lg:px-8 lg:py-36">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden />
            شريك القطاع غير الربحي نحو رؤية السعودية 2030
          </span>
          <h1 className="mt-6 max-w-4xl text-3xl font-extrabold leading-[1.35] sm:text-4xl lg:text-5xl lg:leading-[1.3]">
            أوبن لوب: مؤسسة تسويق واستشارات تمكّن القطاع غير الربحي من الاستدامة وبناء الأثر، وفق
            رؤية 2030.
          </h1>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7 text-base font-bold">
              <a href="/open-loop-profile.pdf" download>
                <Download className="h-5 w-5" aria-hidden />
                حمل الملف التعريفي
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full px-7 text-base font-bold"
            >
              <Link to="/booking">احجز استشارتك</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT BRIEF */}
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:px-8">
          <div className="min-w-0">
            <SectionHeading
              align="start"
              eyebrow="من نحن"
              title="عن أوبن لوب (Open Loop)"
              description="منذ انطلاقتنا، جمعت أوبن لوب نخبة من خبراء التسويق الرقمي، والاستشاريين، وصنّاع الأثر في القطاع الثالث؛ لسد الفجوة بين الأهداف المجتمعية النبيلة والنمو المؤسسي المستدام."
            />
            <Button asChild variant="outline" className="mt-6 rounded-full font-bold">
              <Link to="/about">
                اقرأ قصتنا
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {serviceCategories.map((c) => (
              <Link
                key={c.slug}
                to="/services/$category"
                params={{ category: c.slug }}
                className="card-elevated block p-6"
              >
                <span className="text-xs font-bold text-primary">{c.order}</span>
                <h3 className="mt-1 text-base font-extrabold">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="section-pad bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="مصفوفة الباقات"
            title="باقات مصممة لاحتياجات الكيانات غير الربحية"
            description="قارن بين الباقات واختر ما يناسب مرحلة نمو جمعيتك. جميع الأسعار شاملة ضريبة القيمة المضافة."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CATERING */}
      <CateringSection />

      {/* IMPACT */}
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="المستهدف والأثر"
            title="أثرنا المستهدف حتى 2030"
            description="أرقام نعمل عليها مع شركائنا في القطاع الثالث لتحويل الفرص إلى استدامة حقيقية."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {impact.map((i) => (
              <div key={i.title} className="surface-ink rounded-[2rem] p-8">
                <i.icon className="h-8 w-8 opacity-90" aria-hidden />
                <p className="mt-5 text-3xl font-extrabold">{i.value}</p>
                <p className="mt-1 text-sm font-bold opacity-90">{i.title}</p>
                <p className="mt-4 text-sm leading-relaxed opacity-75">{i.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <SectionHeading title="حلولنا موجهة إلى الكيانات غير الربحية" />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {segments.map((s, idx) => (
                <div key={s.title} className="card-elevated p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-base font-extrabold text-accent-foreground">
                    {idx + 1}
                  </span>
                  <h3 className="mt-4 text-base font-extrabold leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section-pad bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="ثقة متبادلة" title="شركاؤنا" />
        </div>
        <div className="mt-10">
          <PartnersMarquee />
        </div>
      </section>

      <div className="pt-16">
        <VolunteerBanner />
      </div>
    </>
  );
}
