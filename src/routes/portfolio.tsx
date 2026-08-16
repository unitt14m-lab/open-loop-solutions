import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, FileText, ImageIcon, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/Sections";
import { JoinBanner } from "@/components/Footer";
import heroImg from "@/assets/hero.jpg";
import marketingImg from "@/assets/hero-marketing.jpg";
import reliefImg from "@/assets/hero-relief.jpg";
import governanceImg from "@/assets/work-governance.jpg";
import brandingImg from "@/assets/work-branding.jpg";
import fundraisingImg from "@/assets/work-fundraising.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "سابقة الأعمال | معرض مشاريع أوبن لوب" },
      {
        name: "description",
        content:
          "معرض تفاعلي لأعمال أوبن لوب: صور ومستندات ومقاطع من الحملات التسويقية، تأهيل منصات المنح، الحوكمة، ومشاريع الإعاشة الميدانية.",
      },
      { property: "og:title", content: "سابقة الأعمال | معرض مشاريع أوبن لوب" },
      {
        property: "og:description",
        content: "تصفّح مشاريع وحملات أوبن لوب عبر معرض وسائط تفاعلي داخل الصفحة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

type Media =
  | { kind: "image"; src: string }
  | { kind: "pdf"; src: string }
  | { kind: "video"; src: string; poster: string };

type Work = {
  title: string;
  client: string;
  text: string;
  tags: string[];
  cover: string;
  media: Media;
};

const works: Work[] = [
  {
    title: "تأهيل الجمعيات لمنصات المنح",
    client: "جمعيات ومؤسسات أهلية",
    text: "إعداد وصياغة مشاريع احترافية ورفعها على منصات (إحسان، اعتماد) مع متابعة الاعتماد والتحصيل.",
    tags: ["تنمية موارد", "منصات المنح", "استرداد ضريبي"],
    cover: fundraisingImg,
    media: { kind: "image", src: fundraisingImg },
  },
  {
    title: "حملات تسويقية رقمية متكاملة",
    client: "القطاع غير الربحي",
    text: "تخطيط وتنفيذ حملات إعلانية ممولة وإدارة حسابات التواصل مع محتوى بصري ومرئي عالي الجودة.",
    tags: ["إعلانات ممولة", "إدارة حسابات", "إنتاج محتوى"],
    cover: marketingImg,
    media: { kind: "image", src: marketingImg },
  },
  {
    title: "رفع مؤشرات الحوكمة والامتثال",
    client: "مؤسسات أهلية",
    text: "بناء الأدلة واللوائح الداخلية ورفع جاهزية الكيان لمتطلبات الجهات الإشرافية ومؤشرات الحوكمة.",
    tags: ["حوكمة", "امتثال", "أدلة ولوائح"],
    cover: governanceImg,
    media: { kind: "image", src: governanceImg },
  },
  {
    title: "هوية بصرية ومطبوعات مؤسسية",
    client: "جمعيات ومبادرات",
    text: "تصميم الهويات البصرية والملفات التعريفية والتقارير السنوية بأسلوب مؤسسي حديث.",
    tags: ["هوية بصرية", "ملف تعريفي", "تقرير سنوي"],
    cover: brandingImg,
    media: { kind: "image", src: brandingImg },
  },
  {
    title: "مشاريع إعاشة وتوزيع ميداني",
    client: "مبادرات مجتمعية",
    text: "تنفيذ مشاريع إفطار صائم وسقيا الماء والسلال الغذائية وفق خطط لوجستية واشتراطات سلامة معتمدة.",
    tags: ["إفطار صائم", "سقيا ماء", "سلال غذائية"],
    cover: reliefImg,
    media: { kind: "image", src: reliefImg },
  },
  {
    title: "الملف التعريفي لمؤسسة أوبن لوب",
    client: "أوبن لوب",
    text: "مستند تعريفي متكامل يعرض الخدمات والباقات ونماذج الأعمال والشراكات — يمكن تصفحه هنا مباشرة.",
    tags: ["مستند PDF", "ملف تعريفي", "شراكات"],
    cover: heroImg,
    media: { kind: "pdf", src: "/open-loop-profile.pdf" },
  },
];

function MediaIcon({ kind }: { kind: Media["kind"] }) {
  const Icon = kind === "pdf" ? FileText : kind === "video" ? Play : ImageIcon;
  return <Icon className="h-4 w-4" aria-hidden />;
}

const mediaLabel: Record<Media["kind"], string> = {
  image: "صورة",
  pdf: "مستند PDF",
  video: "مقطع مرئي",
};

function Portfolio() {
  const [active, setActive] = useState<Work | null>(null);

  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold">
            <Briefcase className="h-4 w-4" aria-hidden />
            سابقة الأعمال
          </span>
          <h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">معرض أعمالنا</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            اضغط على أي مشروع لتصفّح الوسائط المرفقة (صور عالية الدقة، مقاطع مرئية، أو مستندات)
            دون مغادرة الصفحة.
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
              <button
                key={w.title}
                type="button"
                onClick={() => setActive(w)}
                className="card-elevated group flex flex-col overflow-hidden p-0 text-start transition-transform hover:-translate-y-1"
              >
                <span className="relative block aspect-[3/2] overflow-hidden bg-secondary">
                  <img
                    src={w.cover}
                    alt={w.title}
                    loading="lazy"
                    width={1280}
                    height={853}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold text-gold-foreground">
                    <MediaIcon kind={w.media.kind} />
                    {mediaLabel[w.media.kind]}
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="text-lg font-extrabold leading-snug">{w.title}</span>
                  <span className="mt-1 text-xs font-bold text-muted-foreground">{w.client}</span>
                  <span className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {w.text}
                  </span>
                  <span className="mt-5 flex flex-wrap gap-2">
                    {w.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={Boolean(active)} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader className="text-start">
            <DialogTitle>{active?.title}</DialogTitle>
            <DialogDescription>{active?.client}</DialogDescription>
          </DialogHeader>
          {active && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl bg-secondary">
                {active.media.kind === "image" && (
                  <img
                    src={active.media.src}
                    alt={active.title}
                    width={1280}
                    height={853}
                    className="h-auto w-full object-contain"
                  />
                )}
                {active.media.kind === "video" && (
                  <video
                    src={active.media.src}
                    poster={active.media.poster}
                    controls
                    className="h-auto w-full"
                  />
                )}
                {active.media.kind === "pdf" && (
                  <iframe
                    src={active.media.src}
                    title={active.title}
                    className="h-[70vh] w-full"
                  />
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{active.text}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <JoinBanner />
    </>
  );
}
