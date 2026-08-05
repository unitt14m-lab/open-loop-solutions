import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, PenTool, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/Sections";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "تطوع معانا | أوبن لوب" },
      {
        name: "description",
        content: "انضم إلى شبكة متطوعي أوبن لوب وشارك في تمكين الجمعيات والقطاع غير الربحي.",
      },
      { property: "og:title", content: "تطوع معانا | أوبن لوب" },
      {
        property: "og:description",
        content: "فرص تطوع في التسويق والتصميم والمحتوى والاستشارات لصالح القطاع الثالث.",
      },
    ],
  }),
  component: Volunteer,
});

const tracks = [
  { icon: PenTool, title: "التصميم والهوية", text: "تصميم مواد بصرية وهويات للجمعيات الشريكة." },
  { icon: BarChart3, title: "التسويق الرقمي", text: "إدارة حملات ومحتوى يرفع الحضور الرقمي." },
  { icon: Users, title: "الاستشارات والحوكمة", text: "دعم السياسات واللوائح ورفع التقييم الذاتي." },
  { icon: HeartHandshake, title: "تنمية الموارد", text: "كتابة مشاريع ورفع فرص على منصات المنح." },
];

function Volunteer() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-5xl">تطوع معانا</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            ساهم بخبرتك في تمكين الجمعيات والمؤسسات الأهلية، وكن جزءاً من أثر يمتد إلى آلاف
            المستفيدين.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="مسارات التطوع" title="اختر المسار الأقرب لخبرتك" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t) => (
              <div key={t.title} className="card-elevated p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <t.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-extrabold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            ))}
          </div>

          <div className="card-elevated mx-auto mt-14 max-w-2xl p-8">
            <h2 className="text-xl font-extrabold">نموذج التسجيل للتطوع</h2>
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid gap-2">
                <Label htmlFor="v-name">الاسم الكامل</Label>
                <Input id="v-name" placeholder="اكتب اسمك" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="v-phone">رقم الجوال</Label>
                <Input id="v-phone" placeholder="05xxxxxxxx" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="v-email">البريد الإلكتروني</Label>
                <Input id="v-email" type="email" placeholder="name@email.com" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="v-about">مجال خبرتك وساعات التفرغ</Label>
                <Textarea id="v-about" rows={4} placeholder="أخبرنا عن خبرتك..." />
              </div>
              <Button type="submit" className="rounded-full font-bold sm:col-span-2">
                إرسال الطلب
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
