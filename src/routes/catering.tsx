import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/catering")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "طلب مشاريع الاعاشة | أوبن لوب" },
      {
        name: "description",
        content:
          "اطلب تنفيذ مشاريع الاعاشة مع أوبن لوب: سقيا ماء، وجبات جاهزة ساخنة، ووجبات جافة للجمعيات والجهات.",
      },
      { property: "og:title", content: "مشاريع الاعاشة | أوبن لوب" },
      {
        property: "og:description",
        content: "سقيا ماء، وجبات جاهزة ساخنة، ووجبات جافة — قدّم طلبك الآن.",
      },
    ],
  }),
  component: Catering,
});

function Catering() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-5xl">طلب مشاريع الاعاشة</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            أخبرنا عن جهتك ونوع المشروع، وسيتواصل معك فريقنا لترتيب التفاصيل.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <div className="card-elevated p-8">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-2">
                <Label htmlFor="b-name">الاسم الكامل</Label>
                <Input id="b-name" placeholder="اكتب اسمك" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="b-entity">اسم الجمعية / الكيان</Label>
                <Input id="b-entity" placeholder="اسم الكيان غير الربحي" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="b-phone">رقم الجوال</Label>
                <Input id="b-phone" placeholder="05xxxxxxxx" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="b-email">البريد الإلكتروني</Label>
                <Input id="b-email" type="email" placeholder="name@email.com" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="b-service">نوع المشروع</Label>
                <Select>
                  <SelectTrigger id="b-service" className="w-full">
                    <SelectValue placeholder="اختر نوع المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    {["سقيا ماء", "وجبات جاهزة ساخنة", "وجبات جافة"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="b-note">تفاصيل الاحتياج</Label>
                <Textarea id="b-note" rows={5} placeholder="اشرح لنا وضعكم الحالي وأهدافكم..." />
              </div>
              <Button type="submit" size="lg" className="rounded-full font-bold sm:col-span-2">
                إرسال الطلب
              </Button>
            </form>
          </div>

          <aside className="card-elevated h-fit p-8">
            <CalendarClock className="h-8 w-8 text-primary dark:text-gold" aria-hidden />
            <h2 className="mt-4 text-lg font-extrabold">تواصل مباشر</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              الاحد الى الخميس سيقوم فريقنا بالرد خلال 24 ساعة
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary dark:text-gold" />
                <a href="mailto:openloop2030@gmail.com" className="hover:text-primary dark:hover:text-gold">
                  openloop2030@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary dark:text-gold" />
                <a href="https://wa.me/966556006142" target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-primary dark:hover:text-gold">
                  0556006142
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
