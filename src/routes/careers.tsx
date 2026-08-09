import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/Sections";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "انضم إلينا | أوبن لوب" },
      {
        name: "description",
        content: "الفرص الوظيفية في أوبن لوب — انضم لفريق التسويق والاستشارات للقطاع غير الربحي.",
      },
      { property: "og:title", content: "انضم إلى فريق أوبن لوب" },
      {
        property: "og:description",
        content: "فرص عمل في التسويق الرقمي، المحتوى، التصميم، والاستشارات المؤسسية.",
      },
    ],
  }),
  component: Careers,
});

const roles = [
  { title: "أخصائي تسويق رقمي", type: "دوام كامل — الرياض" },
  { title: "مصمم جرافيك / موشن", type: "دوام كامل — عن بُعد" },
  { title: "كاتب محتوى", type: "دوام جزئي — عن بُعد" },
  { title: "استشاري حوكمة وامتثال", type: "تعاقد مشاريع" },
  { title: "أخصائي تنمية موارد", type: "دوام كامل — الرياض" },
];

function Careers() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-5xl">انضم إلينا</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            نبحث دائماً عن كفاءات تؤمن بأثر القطاع الثالث وتملك شغف التميز المهني.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="الفرص المتاحة" title="وظائف مفتوحة" />
          <div className="mt-12 grid gap-4">
            {roles.map((r) => (
              <div
                key={r.title}
                className="card-elevated grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-base font-extrabold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.type}</p>
                </div>
                <Button asChild variant="outline" className="rounded-full font-bold">
                  <a href="mailto:openloop2030@gmail.com">تقديم</a>
                </Button>
              </div>
            ))}
          </div>

          <div className="card-elevated mx-auto mt-14 max-w-2xl p-8">
            <h2 className="text-xl font-extrabold">أرسل سيرتك الذاتية</h2>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-2">
                <Label htmlFor="c-name">الاسم الكامل</Label>
                <Input id="c-name" placeholder="اكتب اسمك" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-role">الوظيفة المستهدفة</Label>
                <Input id="c-role" placeholder="مثال: أخصائي تسويق رقمي" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="c-email">البريد الإلكتروني</Label>
                <Input id="c-email" type="email" placeholder="name@email.com" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="c-note">نبذة عنك ورابط أعمالك</Label>
                <Textarea id="c-note" rows={4} placeholder="اكتب نبذة مختصرة..." />
              </div>
              <Button type="submit" className="rounded-full font-bold sm:col-span-2">
                إرسال
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
