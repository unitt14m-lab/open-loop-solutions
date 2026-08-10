import { useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { FileCheck2, Upload } from "lucide-react";
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
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/lib/auth";
import { submitRequest } from "@/lib/requests";

const schema = z.object({
  name: z.string().trim().min(2, "الرجاء إدخال الاسم الكامل").max(100, "الاسم طويل جداً"),
  field: z.string().trim().min(2, "الرجاء إدخال التخصص").max(120, "النص طويل جداً"),
  phone: z
    .string()
    .trim()
    .min(8, "رقم جوال غير صحيح")
    .max(20, "رقم جوال غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال يجب أن يحتوي أرقاماً فقط"),
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255, "البريد طويل جداً"),
  portfolio: z
    .string()
    .trim()
    .max(300, "الرابط طويل جداً")
    .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "الرجاء إدخال رابط صحيح يبدأ بـ http"),
});

type Values = z.infer<typeof schema>;

const initial: Values = { name: "", field: "", phone: "", email: "", portfolio: "" };

export function FreelancerJoinDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
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
        type: "freelancer",
        title: `طلب انضمام مستقل — ${d.field}`,
        details: {
          "الاسم": d.name,
          "التخصص": d.field,
          "الجوال": d.phone,
          "البريد": d.email,
          "رابط الأعمال": d.portfolio || "غير متوفر",
        },
        file: cv,
      });
      toast.success("تم إرسال طلب الانضمام", { description: "يمكنك متابعته من لوحة حسابك." });
      setOpen(false);
      setValues(initial);
      setCv(null);
    } catch {
      toast.error("تعذر إرسال الطلب، حاول مرة أخرى");
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof Values, label: string, type = "text", placeholder?: string) => (
    <div className="space-y-2">
      <Label htmlFor={`fl-${key}`}>{label}</Label>
      <Input
        id={`fl-${key}`}
        type={type}
        value={values[key]}
        placeholder={placeholder}
        maxLength={key === "phone" ? 20 : 300}
        dir={key === "phone" || key === "email" || key === "portfolio" ? "ltr" : undefined}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      />
      {errors[key] && <p className="text-xs font-semibold text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button className="rounded-full font-bold">انضم كمستقل إلى شبكتنا</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>انضم كـ مستعد/مستقل إلى شبكة أوبن لوب</DialogTitle>
          <DialogDescription>فرص للعمل الحر والشراكة مع أوبن لوب</DialogDescription>
        </DialogHeader>
        <AuthGate>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">{field("name", "الاسم الكامل")}</div>
            <div className="sm:col-span-2">
              {field("field", "التخصص / مجال العمل", "text", "مثال: كتابة محتوى، تصميم، حوكمة")}
            </div>
            {field("phone", "رقم الجوال", "tel")}
            {field("email", "البريد الإلكتروني", "email")}
            <div className="sm:col-span-2">
              {field("portfolio", "رابط معرض الأعمال (اختياري)", "url", "https://")}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fl-cv">رفع السيرة الذاتية (PDF فقط)</Label>
              <input
                ref={fileRef}
                id="fl-cv"
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
              إرسال طلب الانضمام
            </Button>
          </form>
        </AuthGate>
      </DialogContent>
    </Dialog>
  );
}
