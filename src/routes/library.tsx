import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, ShieldCheck, LayoutTemplate, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/Sections";
import { VolunteerBanner } from "@/components/Footer";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "مكتبة أوبن لوب | أدلة ونماذج مجانية للقطاع غير الربحي" },
      {
        name: "description",
        content:
          "مكتبة أوبن لوب: نماذج ولوائح وأدلة وأطر عمل مجانية قابلة للتحميل تساعد الجمعيات على الحوكمة والاستدامة المالية وبناء الأثر.",
      },
      { property: "og:title", content: "مكتبة أوبن لوب — موارد مجانية للجمعيات" },
      {
        property: "og:description",
        content: "حمّل نماذج ولوائح وأدلة وأطر عمل جاهزة مجاناً لتطوير عمل جمعيتك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

const resources = [
  {
    icon: ShieldCheck,
    title: "لائحة الحوكمة النموذجية",
    text: "نموذج جاهز للائحة الحوكمة يتوافق مع متطلبات المركز الوطني لتنمية القطاع غير الربحي.",
  },
  {
    icon: FileText,
    title: "نموذج خطة تشغيلية سنوية",
    text: "قالب لبناء الخطة التشغيلية مع مؤشرات الأداء والميزانية التقديرية.",
  },
  {
    icon: LayoutTemplate,
    title: "قالب ملف مشروع للمانحين",
    text: "هيكل احترافي لعرض المشاريع على المؤسسات المانحة وصناديق الدعم.",
  },
  {
    icon: BookOpen,
    title: "دليل الاستدامة المالية",
    text: "إطار عملي لتنويع مصادر الدخل وبناء أوقاف واستثمارات للجمعية.",
  },
  {
    icon: FileText,
    title: "نموذج تقرير الأثر الاجتماعي",
    text: "قالب لقياس الأثر وتوثيقه بلغة مقنعة للشركاء والمانحين.",
  },
  {
    icon: ShieldCheck,
    title: "حزمة سياسات الموارد البشرية",
    text: "سياسات جاهزة للتوظيف والتطوع والانضباط الوظيفي داخل الكيانات غير الربحية.",
  },
];

function LibraryPage() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold">
            <BookOpen className="h-4 w-4" aria-hidden />
            موارد مجانية
          </span>
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-[1.35] sm:text-4xl">
            مكتبة أوبن لوب
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed opacity-80 sm:text-base">
            نماذج ولوائح وأدلة وأطر عمل جاهزة للتحميل مجاناً، صُممت لمساعدة الجمعيات والمؤسسات
            الأهلية على رفع جاهزيتها المؤسسية وتسريع أثرها.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="تحميل مباشر"
            title="أحدث الملفات والنماذج"
            description="اختر الملف المناسب لجمعيتك وحمّله مباشرة دون تسجيل."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {resources.map((r) => (
              <article key={r.title} className="card-elevated flex flex-col p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <r.icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-5 text-base font-extrabold leading-snug">{r.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                <Button asChild variant="outline" className="mt-6 rounded-full font-bold">
                  <a href="/open-loop-profile.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" aria-hidden />
                    تحميل الملف
                  </a>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <VolunteerBanner />
    </>
  );
}
