import { useRef, useState } from "react";
import { z } from "zod";
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
import { openWhatsApp } from "@/lib/whatsapp";

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

export function FreelancerJoinDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cvName, setCvName] = useState("");
  const [cvError, setCvError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCvName("");
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setCvError("يُسمح بملفات PDF فقط");
      setCvName("");
      e.target.value = "";
      return;
    }
    setCvError("");
    setCvName(file.name);
  };

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
    const lines = [
      "مرحباً أوبن لوب، أود الانضمام إلى شبكة المستقلين لديكم:",
      `الاسم: ${d.name}`,
      `التخصص: ${d.field}`,
      `الجوال: ${d.phone}`,
      `البريد: ${d.email}`,
      `رابط الأعمال: ${d.portfolio || "غير متوفر"}`,
    ];
    if (cvName) lines.push("(ملاحظة: تمت إضافة السيرة الذاتية بصيغة PDF)");
    openWhatsApp(lines.join("\n"));
    setOpen(false);
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
        {trigger ?? (
          <Button className="rounded-full font-bold">انضم كمستقل إلى شبكتنا</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>انضم كـ مستعد/مستقل إلى شبكة أوبن لوب</DialogTitle>
          <DialogDescription>فرص للعمل الحر والشراكة مع أوبن لوب</DialogDescription>
        </DialogHeader>
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
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-3 text-start transition-colors hover:bg-secondary"
            >
              {cvName ? (
                <FileCheck2 className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              ) : (
                <Upload className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {cvName || "اختر ملف PDF من جهازك"}
              </span>
            </button>
            {cvError && <p className="text-xs font-semibold text-destructive">{cvError}</p>}
          </div>

          <Button type="submit" className="w-full rounded-full font-bold sm:col-span-2">
            إرسال طلب الانضمام
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
            بعد الإرسال سيتم تحويلك إلى واتساب لإكمال الطلب — يرجى إرفاق ملف السيرة الذاتية هناك.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
