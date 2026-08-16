import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/Sections";
import { FreelancerJoinDialog } from "@/components/FreelancerJoinDialog";
import { ProjectsBoard } from "@/components/ProjectsBoard";
import { ExpertsDirectory } from "@/components/ExpertsDirectory";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "انضم إلينا | شبكة المستقلين ولوحة المشاريع — أوبن لوب" },
      {
        name: "description",
        content:
          "لوحة المشاريع المفتوحة ودليل خبراء أوبن لوب: تقدّم على مشاريع القطاع غير الربحي أو تصفّح المستقلين الموثقين في التسويق والمحتوى والتصميم والحوكمة.",
      },
      { property: "og:title", content: "شبكة المستقلين ولوحة المشاريع | أوبن لوب" },
      {
        property: "og:description",
        content: "مشاريع مفتوحة للتقديم ودليل خبراء موثوقين في القطاع غير الربحي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Careers,
});

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
            القطاع غير الربحي. سجّل في الشبكة، ثم تقدّم على المشاريع المفتوحة مباشرة من حسابك.
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

      <section id="projects" className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="لوحة المشاريع والفرص"
            title="المشاريع المفتوحة للتقديم"
            description="مشاريع نشطة ينشرها فريق أوبن لوب مع تفاصيل المخرجات والمتطلبات — يمكنك التقديم عليها من حسابك."
          />
          <ProjectsBoard />
        </div>
      </section>

      <section id="experts" className="section-pad bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="دليل الخبراء والمستقلين"
            title="كفاءات موثقة ضمن شبكة أوبن لوب"
            description="نخبة من المستقلين والمتخصصين المعتمدين لدينا في التسويق والمحتوى والتصميم والحوكمة وتنمية الموارد."
          />
          <ExpertsDirectory />
        </div>
      </section>
    </>
  );
}
