import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/Sections";
import { VolunteerBanner } from "@/components/Footer";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "سابقة الأعمال | أوبن لوب" },
      {
        name: "description",
        content:
          "نماذج من أعمال أوبن لوب مع الجمعيات والمؤسسات الأهلية: حملات تسويقية، تأهيل منصات المنح، حوكمة، ومشاريع إعاشة ميدانية.",
      },
      { property: "og:title", content: "سابقة الأعمال | أوبن لوب" },
      {
        property: "og:description",
        content: "مشاريع وحملات نفذتها أوبن لوب لصالح القطاع غير الربحي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const works = [
  {
    title: "تأهيل الجمعيات لمنصات المنح",
    client: "جمعيات ومؤسسات أهلية",
    text: "إعداد وصياغة مشاريع احترافية ورفعها على منصات (إحسان، اعتماد) مع متابعة الاعتماد والتحصيل.",
    tags: ["تنمية موارد", "منصات المنح", "استرداد ضريبي"],
  },
  {
    title: "حملات تسويقية رقمية متكاملة",
    client: "القطاع غير الربحي",
    text: "تخطيط وتنفيذ حملات إعلانية ممولة وإدارة حسابات التواصل مع محتوى بصري ومرئي عالي الجودة.",
    tags: ["إعلانات ممولة", "إدارة حسابات", "إنتاج محتوى"],
  },
  {
    title: "رفع مؤشرات الحوكمة والامتثال",
    client: "مؤسسات أهلية",
    text: "بناء الأدلة واللوائح الداخلية ورفع جاهزية الكيان لمتطلبات الجهات الإشرافية ومؤشرات الحوكمة.",
    tags: ["حوكمة", "امتثال", "أدلة ولوائح"],
  },
  {
    title: "هوية بصرية ومطبوعات مؤسسية",
    client: "جمعيات ومبادرات",
    text: "تصميم الهويات البصرية والملفات التعريفية والتقارير السنوية بأسلوب مؤسسي حديث.",
    tags: ["هوية بصرية", "ملف تعريفي", "تقرير سنوي"],
  },
  {
    title: "مشاريع إعاشة وتوزيع ميداني",
    client: "مبادرات مجتمعية",
    text: "تنفيذ مشاريع إفطار صائم وسقيا الماء والسلال الغذائية وفق خطط لوجستية واشتراطات سلامة معتمدة.",
    tags: ["إفطار صائم", "سقيا ماء", "سلال غذائية"],
  },
  {
    title: "استشارات تنمية الموارد المالية",
    client: "كيانات غير ربحية",
    text: "خطط استدامة مالية وتنويع مصادر الدخل مع بناء ملفات المانحين وبرامج الشراكات.",
    tags: ["استدامة مالية", "شراكات", "مانحون"],
  },
];

function Portfolio() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold">
            <Briefcase className="h-4 w-4" aria-hidden />
            سابقة الأعمال
          </span>
          <h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">أعمالنا مع القطاع غير الربحي</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            نماذج من المشاريع والحملات التي نفذتها أوبن لوب مع الجمعيات والمؤسسات الأهلية في مختلف
            مناطق المملكة.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="مشاريع مختارة"
            title="نماذج من أعمالنا"
            description="خبرات ميدانية ورقمية تجمع بين الاستشارات والتسويق والتنفيذ."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {works.map((w) => (
              <article key={w.title} className="card-elevated flex flex-col p-7">
                <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden />
                <h2 className="mt-4 text-lg font-extrabold leading-snug">{w.title}</h2>
                <p className="mt-1 text-xs font-bold text-muted-foreground">{w.client}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {w.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <VolunteerBanner />
    </>
  );
}
