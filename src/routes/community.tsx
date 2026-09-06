import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Gavel, Send, ShoppingCart, Store } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { CommunityDirectory } from "@/components/CommunityDirectory";
import { CommunityRegisterForm } from "@/components/CommunityRegisterForm";
import { MarketplaceForms, type MarketplaceTab } from "@/components/MarketplaceForms";
import { MarketplaceDisclaimer } from "@/components/MarketplaceDisclaimer";

import { RfqBoard } from "@/components/RfqBoard";
import { Button } from "@/components/ui/button";
import portalIllustration from "@/assets/community-portal.png";

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
    icon: ClipboardList,
    title: "طرح الفرصة / الطلب",
    body: "تقوم الجمعية أو المؤسسة التابعة لها بطرح طلب عرض سعر (RFQ) لمشروع، توريد، أو خدمة.",
  },
  {
    icon: Send,
    title: "تقديم العروض",
    body: "تطّلع المنشآت والموردون المعتمدون على الطلبات ويقدمون عروض أسعارهم إلكترونياً وبكل سهولة.",
  },
  {
    icon: Gavel,
    title: "الترسية والتواصل",
    body: "التقييم والمفاضلة بين العروض واختيار العرض الأنسب وإتمام التعميد.",
  },
];

function CommunityPage() {
  const [formsTab, setFormsTab] = useState<MarketplaceTab>("rfq");

  const goToForms = (tab: MarketplaceTab) => {
    setFormsTab(tab);
    document.getElementById("marketplace-forms")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="surface-ink min-h-screen">
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold">
            سوق إلكتروني للمشتريات غير الربحية
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            كيف تعمل خدمة فُرص Open Loop؟
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed opacity-85">
            منصة فُرص Open Loop هي حلقة وصل بين الكيانات غير الربحية، والشركات والمؤسسات
            التابعة للجمعيات الأهلية، والموردين؛ بحيث تمكّن من الاطلاع وتقديم عروض الأسعار
            إلكترونياً، وتتيح للجمعيات ومؤسساتها طرح طلبات عروض الأسعار فيما بينهم.
          </p>

          <MarketplaceDisclaimer className="mt-6 max-w-3xl bg-white/5 text-white/80" />



          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            {/* Buyers — right card (first in RTL flow) */}
            <article className="glass-panel flex flex-col items-center p-8 text-center">
              <span className="glow-teal flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/40">
                <ShoppingCart className="h-8 w-8 text-white" aria-hidden />
              </span>
              <h2 className="mt-4 text-xl font-extrabold text-white">مشترين</h2>
              <p className="mt-1 text-sm font-bold text-[#E2E8F0]/80">
                الجمعيات الأهلية والشركات التابعة لها
              </p>
              <Button
                onClick={() => goToForms("rfq")}
                className="glow-teal mt-6 w-full rounded-full bg-accent font-bold text-white hover:bg-accent/90"
              >
                ابدأ الشراء / طرح فرصة
              </Button>
            </article>

            <div className="mx-auto flex items-center justify-center">
              <img
                src={portalIllustration}
                alt="مستخدم يعمل على جهاز حاسوب داخل منصة فُرص Open Loop"
                loading="lazy"
                width={768}
                height={768}
                className="h-44 w-44 object-contain opacity-90 mix-blend-screen drop-shadow-[0_0_30px_rgb(224_159_72/25%)] lg:h-56 lg:w-56"
              />
            </div>

            {/* Suppliers — left card */}
            <article className="glass-panel flex flex-col items-center p-8 text-center">
              <span className="glow-gold flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/20">
                <Store className="h-8 w-8 text-gold" aria-hidden />
              </span>
              <h2 className="mt-4 text-xl font-extrabold text-white">موردين</h2>
              <p className="mt-1 text-sm font-bold text-[#E2E8F0]/80">
                الشركات والمؤسسات المعتمدة والقطاع الخاص
              </p>
              <Button
                onClick={() => goToForms("supplier")}
                className="glow-gold mt-6 w-full rounded-full bg-gold font-bold text-gold-foreground hover:bg-gold/90"
              >
                ابدأ البيع / تقديم عرض
              </Button>
            </article>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <article key={step.title} className="glass-panel relative p-7">
                <span className="absolute end-6 top-6 text-3xl font-extrabold text-gold/50">
                  {i + 1}
                </span>
                <step.icon className="h-9 w-9 text-gold" aria-hidden />
                <h3 className="mt-5 text-lg font-extrabold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#E2E8F0]/75">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="rfq-board" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">لوحة الفرص وطلبات عروض الأسعار</h2>
          <p className="mt-3 text-sm text-[#E2E8F0]/75">
            فرص شرائية مفتوحة من الجمعيات والمؤسسات والشركات التابعة لها — قدّم عرضك قبل انتهاء المدة.
          </p>
          <div className="mt-8">
            <AuthGate message="سجّل الدخول لعرض الفرص وتقديم عروض الأسعار.">
              <RfqBoard />
            </AuthGate>
          </div>
        </div>
      </section>

      <section id="marketplace-forms" className="section-pad">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            التسجيل وطرح الفرص
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#E2E8F0]/75">
            سجّل منشأتك كمورد معتمد، أو اطرح مشروعاً / طلب توريد جديد ليصل إلى الموردين مباشرة.
          </p>
          <div className="mt-8">
            <AuthGate message="سجّل الدخول للتسجيل كمورد أو طرح طلب عرض سعر.">
              <MarketplaceForms tab={formsTab} onTabChange={setFormsTab} />
            </AuthGate>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">توثيق الجهة</h2>
          <p className="mt-3 text-sm text-[#E2E8F0]/75">
            يُعتمد ملف الجهة آلياً بعد التحقق من رقم الترخيص، ويتيح لك طرح طلبات عروض الأسعار.
          </p>
          <div className="mt-8">
            <AuthGate message="سجّل الدخول أولاً لتوثيق جهتك في فُرص Open Loop.">
              <CommunityRegisterForm />
            </AuthGate>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">دليل فُرص Open Loop</h2>
          <p className="mt-3 text-sm text-[#E2E8F0]/75">
            الجهات المعتمدة داخل المجتمع — الدليل متاح للأعضاء المعتمدين فقط.
          </p>
          <div className="mt-8">
            <AuthGate message="سجّل الدخول لعرض دليل الجهات المعتمدة.">
              <CommunityDirectory />
            </AuthGate>
          </div>
        </div>
      </section>
    </div>
  );
}
