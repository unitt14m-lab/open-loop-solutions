import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
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
  org: z.string().trim().min(2, "الرجاء إدخال اسم الجهة").max(120, "الاسم طويل جداً"),
  phone: z
    .string()
    .trim()
    .min(8, "رقم جوال غير صحيح")
    .max(20, "رقم جوال غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال يجب أن يحتوي أرقاماً فقط"),
});

export function PackageRequestDialog({ packageName }: { packageName: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState({ name: "", org: "", phone: "" });
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
      await submitRequest({
        userId: user.id,
        type: "package",
        title: packageName,
        details: {
          "الاسم": parsed.data.name,
          "الجهة": parsed.data.org,
          "الجوال": parsed.data.phone,
        },
      });
      toast.success("تم إرسال طلبك بنجاح", { description: "يمكنك متابعته من لوحة حسابك." });
      setOpen(false);
      setValues({ name: "", org: "", phone: "" });
    } catch {
      toast.error("تعذر إرسال الطلب، حاول مرة أخرى");
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof typeof values, label: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={`${key}-${packageName}`}>{label}</Label>
      <Input
        id={`${key}-${packageName}`}
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full rounded-full font-bold">طلب الباقة</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>طلب الباقة</DialogTitle>
          <DialogDescription>{packageName}</DialogDescription>
        </DialogHeader>
        <AuthGate>
          <form onSubmit={submit} className="space-y-4">
            {field("name", "الاسم الكامل")}
            {field("org", "اسم الجهة / الجمعية")}
            {field("phone", "رقم الجوال", "tel")}
            <Button type="submit" disabled={busy} className="w-full rounded-full font-bold">
              إرسال الطلب
            </Button>
          </form>
        </AuthGate>
      </DialogContent>
    </Dialog>
  );
}
