import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { UtensilsCrossed, Truck, ShieldCheck, Soup } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/lib/auth";
import { submitRequest } from "@/lib/requests";

const projectTypes = [
  "إفطار صائم",
  "سقيا ماء",
  "وجبات مجهزة / جافة",
  "سلال غذائية",
  "مشروع إعاشة آخر",
];

const schema = z.object({
  org: z.string().trim().min(2, "الرجاء إدخال اسم الجمعية / الجهة").max(120, "الاسم طويل جداً"),
  projectType: z.string().trim().min(2, "الرجاء اختيار نوع المشروع"),
  quantity: z.string().trim().min(1, "الرجاء إدخال العدد المستهدف").max(60),
  city: z.string().trim().min(2, "الرجاء إدخال المدينة / نطاق التوزيع").max(120),
  budget: z.string().trim().min(1, "الرجاء إدخال الميزانية التقديرية").max(60, "النص طويل جداً"),
  contact: z.string().trim().min(2, "الرجاء إدخال اسم مسؤول التواصل").max(100, "الاسم طويل جداً"),
  phone: z
    .string()
    .trim()
    .min(8, "رقم جوال غير صحيح")
    .max(20, "رقم جوال غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال يجب أن يحتوي أرقاماً فقط"),
});

type Values = z.infer<typeof schema>;

const initial: Values = {
  org: "",
  projectType: "",
  quantity: "",
  city: "",
  budget: "",
  contact: "",
  phone: "",
};


const highlights = [
  {
    icon: ShieldCheck,
    title: "مشاريع موسمية ومستدامة",
    text: "إدارة وتأمين مشاريع إفطار صائم، سقيا الماء، السلال الغذائية، وإطعام الطعام.",
  },
  {
    icon: Truck,
    title: "سلامة وتوزيع ميداني",
    text: "خطط لوجستية دقيقة واشتراطات صحية معتمدة لضمان الوصول الميداني السريع.",
  },
  {
    icon: Soup,
    title: "وجبات وقوائم متنوعة",
    text: "حلول مجهزة وجافة مرنة تتناسب مع احتياج وطبيعة كل مشروع ومستفيديه.",
  },
];

export function CateringSection() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    if (!user) return;
    setBusy(true);
    try {
      const d = parsed.data;
      await submitRequest({
        userId: user.id,
        type: "catering",
        title: `مشروع إعاشة — ${d.projectType}`,
        details: {
          "الجهة / الجمعية": d.org,
          "نوع المشروع": d.projectType,
          "العدد المستهدف": d.quantity,
          "المدينة / نطاق التوزيع": d.city,
          "مسؤول التواصل": d.contact,
          "رقم الجوال": d.phone,
        },
      });
      toast.success("تم إرسال طلبك بنجاح", { description: "يمكنك متابعته من لوحة حسابك." });
      setOpen(false);
      setValues(initial);
    } catch {
      toast.error("تعذر إرسال الطلب، حاول مرة أخرى");
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof Values, label: string, type = "text") => (
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
                مشاريع الإعاشة وتأمين المبادرات الميدانية
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
                نضمن لجمعيتكم تنفيذ وتأمين كافة مشاريع الإعاشة والإطعام الميداني (من مشاريع إفطار
                صائم، سقيا الماء، الوجبات المجهزة والجافة، والسلال الغذائية) وفق أعلى معايير الجودة
                والسلامة، لتصل مبادراتكم المجتمعية إلى مستحقيها بكفاءة عالية.
              </p>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="mt-8 rounded-full px-7 text-base font-bold">
                    اطلب الخدمة الآن
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                  <DialogHeader className="text-start">
                    <DialogTitle>طلب خدمة الإعاشة</DialogTitle>
                    <DialogDescription>
                      مشاريع الإعاشة وتأمين المبادرات الميدانية
                    </DialogDescription>
                  </DialogHeader>
                  <AuthGate>
                    <form onSubmit={submit} className="space-y-4">
                      {field("org", "اسم الجمعية / الجهة")}
                      <div className="space-y-2">
                        <Label htmlFor="catering-project-type">نوع المشروع</Label>
                        <Select
                          value={values.projectType}
                          onValueChange={(v) => setValues((s) => ({ ...s, projectType: v }))}
                        >
                          <SelectTrigger id="catering-project-type">
                            <SelectValue placeholder="اختر نوع المشروع" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors["projectType"] && (
                          <p className="text-xs font-semibold text-destructive">
                            {errors["projectType"]}
                          </p>
                        )}
                      </div>
                      {field("quantity", "العدد المستهدف / الكمية")}
                      {field("city", "المدينة / نطاق التوزيع")}
                      {field("contact", "اسم مسؤول التواصل")}
                      {field("phone", "رقم الجوال", "tel")}
                      <Button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-full font-bold"
                      >
                        إرسال الطلب
                      </Button>
                    </form>
                  </AuthGate>
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
