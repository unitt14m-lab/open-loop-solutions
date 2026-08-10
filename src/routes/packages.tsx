import { createFileRoute } from "@tanstack/react-router";
import { PackageCard, SectionHeading } from "@/components/Sections";
import { VolunteerBanner } from "@/components/Footer";
import { packages } from "@/data/site";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "الباقات | أوبن لوب" },
      {
        name: "description",
        content:
          "باقات أوبن لوب: إدارة السوشال ميديا، الحملات الممولة، الاسترداد الضريبي، تنمية الموارد المالية، والامتثال والحوكمة.",
      },
      { property: "og:title", content: "باقات أوبن لوب للقطاع غير الربحي" },
      {
        property: "og:description",
        content: "قارن بين باقات التسويق والاستشارات المتكاملة.",
      },
    ],
  }),
  component: Packages,
});

function Packages() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-5xl">مصفوفة الباقات</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            باقات متكاملة تغطي التسويق الرقمي، تنمية الموارد، الاسترداد الضريبي، والحوكمة
            المؤسسية.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="مقارنة"
            title="اختر الباقة المناسبة لمرحلة نمو كيانك"
            description="كل باقة تشمل جلسات استشارية ومتابعة تنفيذية من فريق أوبن لوب."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      <VolunteerBanner />
    </>
  );
}
