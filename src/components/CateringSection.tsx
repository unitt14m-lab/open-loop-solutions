import { useState } from "react";
import { z } from "zod";
import { UtensilsCrossed, Truck, ShieldCheck, Soup } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { openWhatsApp } from "@/lib/whatsapp";

const schema = z.object({
  org: z.string().trim().min(2, "الرجاء إدخال اسم الجمعية / الجهة").max(120, "الاسم طويل جداً"),
  project: z.string().trim().min(2, "الرجاء إدخال اسم المشروع").max(120, "الاسم طويل جداً"),
  contact: z.string().trim().min(2, "الرجاء إدخال اسم مسؤول التواصل").max(100, "الاسم طويل جداً"),
  phone: z
    .string()
    .trim()
    .min(8, "رقم جوال غير صحيح")
    .max(20, "رقم جوال غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال يجب أن يحتوي أرقاماً فقط"),
});

const highlights = [
  { icon: ShieldCheck, title: "سلامة غذائية", text: "التزام بمعايير الجودة والاشتراطات الصحية المعتمدة." },
  { icon: Truck, title: "توزيع ميداني", text: "خطط لوجستية دقيقة لإيصال الوجبات في وقتها." },
  { icon: Soup, title: "وجبات متنوعة", text: "قوائم مرنة تناسب طبيعة كل مشروع ومستفيديه." },
];

export function CateringSection() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ org: "", project: "", contact: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    const d = parsed.data;
    openWhatsApp(
      `مرحباً أوبن لوب، نود طلب تنفيذ مشروع إعاشة:\nالجهة / الجمعية: ${d.org}\nاسم المشروع: ${d.project}\nمسؤول التواصل: ${d.contact}\nرقم الجوال: ${d.phone}`,
    );
    setOpen(false);
  };

  const field = (key: keyof typeof values, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={`catering-${key}`}>{label}</Label>
      <Input
        id={`catering-${key}`}
        type={type}
        value={values[key]}
        maxLength={key === "phone" ? 20 : 120}
        dir={key === "phone" ? "ltr" : undefined}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      />
      {errors[key] && <p className="text-xs font-semibold text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <section id="catering" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-ink relative isolate overflow-hidden rounded-[2rem] p-8 sm:p-12">
          <UtensilsCrossed
            className="pointer-events-none absolute -left-10 -top-10 -z-10 h-56 w-56 opacity-10"
            aria-hidden
          />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-extrabold text-gold-foreground">
                <UtensilsCrossed className="h-4 w-4" aria-hidden />
                خدمات الإعاشة
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                مشاريع الإعاشة وتأمين الوجبات
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
                نضمن لجمعيتكم تنفيذ مشاريع الإعاشة والإطعام الميداني وفق أعلى معايير الجودة والسلامة
                الغذائية، لتصل مساهماتكم ومبادراتكم المجتمعية إلى مستحقيها بأفضل صورة.
              </p>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="mt-8 rounded-full px-7 text-base font-bold">
                    اطلب خدمة الإعاشة الآن
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="text-start">
                    <DialogTitle>طلب خدمة الإعاشة</DialogTitle>
                    <DialogDescription>مشاريع الإعاشة وتأمين الوجبات</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={submit} className="space-y-4">
                    {field("org", "اسم الجمعية / الجهة")}
                    {field("project", "اسم المشروع")}
                    {field("contact", "اسم مسؤول التواصل")}
                    {field("phone", "رقم الجوال", "tel")}
                    <Button type="submit" className="w-full rounded-full font-bold">
                      إرسال الطلب عبر الواتساب
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="flex gap-4 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur"
                >
                  <h.icon className="mt-0.5 h-6 w-6 shrink-0 text-gold" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold">{h.title}</p>
                    <p className="mt-1 text-sm leading-relaxed opacity-75">{h.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
