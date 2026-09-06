import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { CommunityDirectory } from "@/components/CommunityDirectory";
import { CommunityRegisterForm } from "@/components/CommunityRegisterForm";
import { MarketplaceForms, type MarketplaceTab } from "@/components/MarketplaceForms";
import { MarketplaceDisclaimer } from "@/components/MarketplaceDisclaimer";
import { RfqBoard } from "@/components/RfqBoard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "فُرص Open Loop | سوق المشتريات وعروض الأسعار للقطاع غير الربحي" },
      {
        name: "description",
        content:
          "منصة B2B تربط الجمعيات الأهلية والشركات التابعة لها بالموردين المعتمدين لطرح طلبات عروض الأسعار وتلقي العروض إلكترونياً.",
      },
      { property: "og:title", content: "فُرص Open Loop — سوق المشتريات وعروض الأسعار" },
      {
        property: "og:description",
        content: "اطرح طلب عرض سعر، استقبل عروض الموردين المعتمدين، وأتمم الترسية إلكترونياً.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPage,
});

const STEPS = [
  {
    title: "طرح الفرصة / الطلب",
    body: "تقوم الجمعية أو المؤسسة التابعة لها بطرح طلب عرض سعر (RFQ) لمشروع، توريد، أو خدمة.",
  },
  {
    title: "تقديم العروض",
    body: "تطّلع المنشآت والموردون المعتمدون على الطلبات ويقدمون عروض أسعارهم إلكترونياً وبكل سهولة.",
  },
  {
    title: "الترسية والتواصل",
    body: "التقييم والمفاضلة بين العروض واختيار العرض الأنسب وإتمام التعميد.",
  },
];

const NAVY = "#0F2331";
const OFF_WHITE = "#F8FAFC";

function CommunityPage() {
  const [formsTab, setFormsTab] = useState<MarketplaceTab>("rfq");

  const goToForms = (tab: MarketplaceTab) => {
    setFormsTab(tab);
    document.getElementById("marketplace-forms")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-slate-800" style={{ backgroundColor: OFF_WHITE }}>
      {/* Hero — dark navy, typography only */}
      <section style={{ backgroundColor: NAVY }}>
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-wide text-white/60">
            سوق إلكتروني للمشتريات غير الربحية
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            كيف تعمل خدمة فُرص Open Loop؟
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            منصة فُرص Open Loop هي حلقة وصل بين الكيانات غير الربحية، والشركات والمؤسسات
            التابعة للجمعيات الأهلية، والموردين؛ بحيث تمكّن من الاطلاع وتقديم عروض الأسعار
            إلكترونياً، وتتيح للجمعيات ومؤسساتها طرح طلبات عروض الأسعار فيما بينهم.
          </p>
        </div>
      </section>

      {/* Dual portal cards — text only, white cards */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Buyers */}
            <article className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-extrabold" style={{ color: NAVY }}>مشتريين</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">
                الجمعيات الأهلية والشركات التابعة لها
              </p>
              <Button
                onClick={() => goToForms("rfq")}
                className="mt-8 w-full rounded-full font-bold text-white hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                طرح فرصة / طلب توريد
              </Button>
            </article>

            {/* Suppliers */}
            <article className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-2xl font-extrabold" style={{ color: NAVY }}>موردين</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">
                الشركات والمؤسسات المعتمدة والقطاع الخاص
              </p>
              <Button
                onClick={() => goToForms("supplier")}
                className="mt-8 w-full rounded-full font-bold text-white hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                تصفح الفرص / تقديم عرض
              </Button>
            </article>
          </div>
        </div>
      </section>

      {/* How it works — numbered text cards */}
      <section className="border-t border-slate-200 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-7">
                <span className="text-3xl font-extrabold text-slate-300">{i + 1}</span>
                <h3 className="mt-4 text-lg font-extrabold" style={{ color: NAVY }}>
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RFQ board */}
      <section id="rfq-board" className="border-t border-slate-200 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: NAVY }}>
            لوحة الفرص وطلبات عروض الأسعار
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            فرص شرائية مفتوحة من الجمعيات والمؤسسات والشركات التابعة لها — قدّم عرضك قبل انتهاء المدة.
          </p>
          <div className="mt-8">
            <AuthGate variant="minimal" message="سجّل الدخول لعرض الفرص وتقديم عروض الأسعار.">
              <RfqBoard />
            </AuthGate>
          </div>
        </div>
      </section>

      {/* Registration & posting forms */}
      <section id="marketplace-forms" className="border-t border-slate-200 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: NAVY }}>
            التسجيل وطرح الفرص
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500">
            سجّل منشأتك كمورد معتمد، أو اطرح مشروعاً / طلب توريد جديد ليصل إلى الموردين مباشرة.
          </p>
          <div className="mt-8">
            <AuthGate variant="minimal" message="سجّل الدخول للتسجيل كمورد أو طرح طلب عرض سعر.">
              <MarketplaceForms tab={formsTab} onTabChange={setFormsTab} />
            </AuthGate>
          </div>
        </div>
      </section>

      {/* Entity verification */}
      <section className="border-t border-slate-200 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: NAVY }}>توثيق الجهة</h2>
          <p className="mt-3 text-sm text-slate-500">
            يُعتمد ملف الجهة آلياً بعد التحقق من رقم الترخيص، ويتيح لك طرح طلبات عروض الأسعار.
          </p>
          <div className="mt-8">
            <AuthGate variant="minimal" message="سجّل الدخول أولاً لتوثيق جهتك في فُرص Open Loop.">
              <CommunityRegisterForm />
            </AuthGate>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="border-t border-slate-200 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ color: NAVY }}>
            دليل فُرص Open Loop
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            الجهات المعتمدة داخل المجتمع — الدليل متاح للأعضاء المعتمدين فقط.
          </p>
          <div className="mt-8">
            <AuthGate variant="minimal" message="سجّل الدخول لعرض دليل الجهات المعتمدة.">
              <CommunityDirectory />
            </AuthGate>
          </div>
        </div>
      </section>
    </div>
  );
}
