import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { HeartHandshake, PenTool, BarChart3, Users, FileCheck2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/Sections";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/lib/auth";
import { submitRequest } from "@/lib/requests";

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

const schema = z.object({
  name: z.string().trim().min(2, "الرجاء إدخال الاسم الكامل").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255),
  phone: z
    .string()
    .trim()
    .min(8, "رقم جوال غير صحيح")
    .max(20, "رقم جوال غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال يجب أن يحتوي أرقاماً فقط"),
  field: z.string().trim().min(2, "الرجاء إدخال المجال / التخصص التطوعي").max(120),
});

type Values = z.infer<typeof schema>;
const initial: Values = { name: "", email: "", phone: "", field: "" };

function Volunteer() {
  const { user } = useAuth();
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCv(null);
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setCvError("يُسمح بملفات PDF فقط");
      setCv(null);
      e.target.value = "";
      return;
    }
    setCvError("");
    setCv(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    if (!cv) {
      setCvError("الرجاء رفع السيرة الذاتية بصيغة PDF");
      return;
    }
    setErrors({});
    if (!user) return;
    setBusy(true);
    try {
      const d = parsed.data;
      await submitRequest({
        userId: user.id,
        type: "volunteer",
        title: `طلب تطوع — ${d.field}`,
        details: {
          "الاسم": d.name,
          "البريد": d.email,
          "الجوال": d.phone,
          "المجال التطوعي": d.field,
        },
        file: cv,
      });
      toast.success("تم إرسال طلب التطوع", { description: "يمكنك متابعته من لوحة حسابك." });
      setValues(initial);
      setCv(null);
    } catch {
      toast.error("تعذر إرسال الطلب، حاول مرة أخرى");
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof Values, label: string, type = "text", full = false) => (
    <div className={`grid gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <Label htmlFor={`v-${key}`}>{label}</Label>
      <Input
        id={`v-${key}`}
        type={type}
        value={values[key]}
        maxLength={key === "phone" ? 20 : 255}
        dir={key === "phone" || key === "email" ? "ltr" : undefined}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      />
      {errors[key] && <p className="text-xs font-semibold text-destructive">{errors[key]}</p>}
    </div>
  );

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
            <div className="mt-6">
              <AuthGate>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
                  {field("name", "الاسم الكامل", "text", true)}
                  {field("email", "البريد الإلكتروني", "email")}
                  {field("phone", "رقم الجوال", "tel")}
                  {field("field", "المجال / التخصص التطوعي", "text", true)}

                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="v-cv">رفع السيرة الذاتية (PDF فقط)</Label>
                    <input
                      ref={fileRef}
                      id="v-cv"
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      onChange={onFile}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start rounded-2xl font-bold"
                      onClick={() => fileRef.current?.click()}
                    >
                      {cv ? (
                        <>
                          <FileCheck2 className="h-4 w-4 text-primary" aria-hidden />
                          {cv.name}
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" aria-hidden />
                          اختر ملف PDF
                        </>
                      )}
                    </Button>
                    {cvError && <p className="text-xs font-semibold text-destructive">{cvError}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={busy}
                    className="rounded-full font-bold sm:col-span-2"
                  >
                    إرسال الطلب
                  </Button>
                </form>
              </AuthGate>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
