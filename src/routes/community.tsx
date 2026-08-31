import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Gavel, Send } from "lucide-react";
import { AuthGate } from "@/components/AuthGate";
import { CommunityDirectory } from "@/components/CommunityDirectory";
import { CommunityRegisterForm } from "@/components/CommunityRegisterForm";
import { CommunityTermsGate, useTermsAccepted } from "@/components/CommunityTerms";
import { MarketplaceForms } from "@/components/MarketplaceForms";
import { RfqBoard } from "@/components/RfqBoard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "مجتمع أوبن لوب | سوق المشتريات وعروض الأسعار للقطاع غير الربحي" },
      {
        name: "description",
        content:
          "منصة B2B تربط الجمعيات الأهلية والشركات التابعة لها بالموردين المعتمدين لطرح طلبات عروض الأسعار وتلقي العروض إلكترونياً.",
      },
      { property: "og:title", content: "مجتمع أوبن لوب — سوق المشتريات وعروض الأسعار" },
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
    body: "التقييم والمفاضلة بين العروض واختيار العرض الأنسب وإتمام التعميد والتواصل المباشر.",
  },
];

function CommunityPage() {
  const { accepted, ready, accept } = useTermsAccepted();

  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold">
            سوق إلكتروني للمشتريات غير الربحية
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            مجتمع أوبن لوب
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed opacity-85">
            حلقة وصل بين الكيانات غير الربحية، والشركات والمؤسسات التابعة للجمعيات الأهلية،
            والموردين؛ لتمكين عرض وطلب المشتريات وعروض الأسعار إلكترونياً.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="rounded-full font-bold">
              <a href="#rfq-board">تصفح الفرص المتاحة</a>
            </Button>
            <Button asChild variant="secondary" className="rounded-full font-bold">
              <Link to="/messages" search={{ c: undefined }}>الذهاب إلى المحادثات</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            كيف تعمل خدمة مجتمع أوبن لوب؟
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <article key={step.title} className="card-elevated relative p-7 transition hover:-translate-y-1">
                <span className="absolute end-6 top-6 text-3xl font-extrabold text-gold/40">
                  {i + 1}
                </span>
                <step.icon className="h-9 w-9 text-primary dark:text-gold" aria-hidden />
                <h3 className="mt-5 text-lg font-extrabold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <CommunityTermsGate accepted={accepted} ready={ready} onAccept={accept}>
            <div className="rounded-2xl border border-dashed border-primary/40 bg-background/60 p-5 text-center text-sm font-bold">
              تمت الموافقة على شروط المجتمع — يمكنك الآن تصفّح الفرص وتقديم العروض وطرح الطلبات.
            </div>
          </CommunityTermsGate>
        </div>
      </section>

      {accepted && (
        <>
          <section id="rfq-board" className="section-pad">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-extrabold sm:text-3xl">لوحة الفرص وطلبات عروض الأسعار</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                فرص شرائية مفتوحة من الجمعيات والمؤسسات والشركات التابعة لها — قدّم عرضك قبل انتهاء المدة.
              </p>
              <div className="mt-8">
                <AuthGate message="سجّل الدخول لعرض الفرص وتقديم عروض الأسعار.">
                  <RfqBoard />
                </AuthGate>
              </div>
            </div>
          </section>

          <section className="bg-secondary/50 py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
                التسجيل وطرح الفرص
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
                سجّل منشأتك كمورد معتمد، أو اطرح مشروعاً / طلب توريد جديد ليصل إلى الموردين مباشرة.
              </p>
              <div className="mt-8">
                <AuthGate message="سجّل الدخول للتسجيل كمورد أو طرح طلب عرض سعر.">
                  <MarketplaceForms />
                </AuthGate>
              </div>
            </div>
          </section>

          <section className="section-pad">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-extrabold sm:text-3xl">توثيق الجهة</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                يُعتمد ملف الجهة آلياً بعد التحقق من رقم الترخيص، ويتيح لك طرح طلبات عروض الأسعار.
              </p>
              <div className="mt-8">
                <AuthGate message="سجّل الدخول أولاً لتوثيق جهتك في مجتمع أوبن لوب.">
                  <CommunityRegisterForm />
                </AuthGate>
              </div>
            </div>
          </section>

          <section className="bg-secondary/50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-extrabold sm:text-3xl">دليل مجتمع أوبن لوب</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                الجهات المعتمدة داخل المجتمع — الدليل متاح للأعضاء المعتمدين فقط.
              </p>
              <div className="mt-8">
                <AuthGate message="سجّل الدخول لعرض دليل الجهات المعتمدة.">
                  <CommunityDirectory />
                </AuthGate>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
