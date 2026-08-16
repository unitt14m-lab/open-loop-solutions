import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { CommunityDirectory } from "@/components/CommunityDirectory";
import { CommunityRegisterForm } from "@/components/CommunityRegisterForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "مجتمع أوبن لوب | شبكة الجهات غير الربحية المعتمدة" },
      {
        name: "description",
        content:
          "بوابة مجتمع أوبن لوب: سجّل جهتك، تحقّق آلياً من الترخيص، وتواصل مع الجمعيات والمؤسسات المعتمدة.",
      },
      { property: "og:title", content: "مجتمع أوبن لوب" },
      {
        property: "og:description",
        content: "شبكة تواصل ومحادثات بين الجمعيات والمؤسسات الأهلية المعتمدة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            مجتمع أوبن لوب
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed opacity-85">
            بوابة تفاعلية تجمع الجمعيات والمؤسسات الأهلية والشركات التابعة لها في شبكة واحدة
            للتعارف وتبادل الخبرات والتواصل المباشر عبر نظام محادثات داخلي.
          </p>
          <Button asChild variant="secondary" className="mt-7 rounded-full font-bold">
            <Link to="/messages" search={{ c: undefined }}>
              الذهاب إلى المحادثات
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">تسجيل الجهة والتحقق</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            جميع الحقول مطلوبة، ويُعتمد ملف الجهة آلياً بعد التحقق من رقم الترخيص.
          </p>
          <div className="mt-8">
            <AuthGate message="سجّل الدخول أولاً لتسجيل جهتك في مجتمع أوبن لوب.">
              <CommunityRegisterForm />
            </AuthGate>
          </div>
        </div>
      </section>

      <section className="section-pad">
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
  );
}
