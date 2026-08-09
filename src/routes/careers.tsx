import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/Sections";
import { FreelancerJoinDialog } from "@/components/FreelancerJoinDialog";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "انضم إلينا | فرص العمل الحر مع أوبن لوب" },
      {
        name: "description",
        content:
          "انضم إلى شبكة المستقلين في أوبن لوب: فرص للعمل الحر والشراكة في التسويق الرقمي، المحتوى، التصميم، والحوكمة.",
      },
      { property: "og:title", content: "انضم إلى شبكة المستقلين في أوبن لوب" },
      {
        property: "og:description",
        content: "فرص للعمل الحر والشراكة مع أوبن لوب في القطاع غير الربحي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Careers,
});

const tracks = [
  { title: "تسويق رقمي وإعلانات ممولة", type: "عمل حر — عن بُعد" },
  { title: "تصميم جرافيك وموشن جرافيك", type: "عمل حر — عن بُعد" },
  { title: "كتابة محتوى وصياغة مشاريع", type: "عمل حر — عن بُعد" },
  { title: "استشارات حوكمة وامتثال", type: "تعاقد مشاريع" },
  { title: "تنمية موارد ومنح", type: "تعاقد مشاريع" },
];

function Careers() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold">
            فرص للعمل الحر والشراكة مع أوبن لوب
          </span>
          <h1 className="mt-6 text-3xl font-extrabold sm:text-5xl">انضم إلينا</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            شبكة أوبن لوب للمستقلين تجمع الكفاءات المهنية التي تعمل بنموذج العمل الحر مع مشاريع
            القطاع غير الربحي.
          </p>
          <div className="mt-8">
            <FreelancerJoinDialog
              trigger={
                <Button
                  size="lg"
                  className="rounded-full bg-gold px-7 font-bold text-gold-foreground hover:bg-gold/90"
                >
                  انضم كمستقل إلى شبكتنا
                </Button>
              }
            />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="مجالات العمل الحر" title="التخصصات المطلوبة" />
          <div className="mt-12 grid gap-4">
            {tracks.map((r) => (
              <div
                key={r.title}
                className="card-elevated grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6"
              >
                <div className="min-w-0">
                  <h2 className="truncate text-base font-extrabold">{r.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{r.type}</p>
                </div>
                <FreelancerJoinDialog
                  trigger={
                    <Button variant="outline" className="rounded-full font-bold">
                      تقديم
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

