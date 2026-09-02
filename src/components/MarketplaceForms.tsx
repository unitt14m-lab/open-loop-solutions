import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Handshake, Loader2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/RfqBoard";
import { TermsAgreement } from "@/components/CommunityTerms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { REGIONS } from "@/lib/community";
import { ENTITY_KINDS, RFQ_CATEGORIES, fetchMySupplier } from "@/lib/marketplace";

const selectClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold";

const supplierSchema = z.object({
  company_name: z.string().trim().min(3, "اسم المنشأة مطلوب").max(160),
  cr_number: z.string().regex(/^[0-9]{10}$/, "السجل التجاري يجب أن يكون 10 أرقام"),
  category: z.string().min(1, "اختر التصنيف"),
  region: z.string().min(1, "اختر المنطقة"),
  contact_name: z.string().trim().min(3, "اسم المسؤول مطلوب").max(120),
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(200),
  phone: z.string().trim().regex(/^0?5[0-9]{8}$/, "رقم جوال سعودي غير صحيح"),
  about: z.string().trim().max(1000).optional(),
});

const rfqSchema = z.object({
  title: z.string().trim().min(5, "عنوان الفرصة مطلوب").max(160),
  category: z.string().min(1, "اختر تصنيف المشتريات"),
  entity_name: z.string().trim().min(3, "اسم الجهة الطارحة مطلوب").max(160),
  entity_kind: z.string().min(1, "اختر نوع الجهة"),
  region: z.string().min(1, "اختر المنطقة"),
  deadline: z.string().min(1, "حدد تاريخ انتهاء التقديم"),
  budget: z.string().trim().max(80).optional(),
  description: z.string().trim().min(20, "أضف وصفاً لا يقل عن 20 حرفاً").max(2000),
});

export type MarketplaceTab = "rfq" | "supplier";

export function MarketplaceForms({
  tab,
  onTabChange,
}: {
  tab: MarketplaceTab;
  onTabChange: (tab: MarketplaceTab) => void;
}) {
  return (
    <div>
      <div className="mx-auto flex w-fit gap-2 rounded-full bg-secondary/70 p-1.5">
        <TabButton active={tab === "rfq"} onClick={() => onTabChange("rfq")}>
          <Megaphone className="h-4 w-4" aria-hidden />
          طرح طلب عرض سعر
        </TabButton>
        <TabButton active={tab === "supplier"} onClick={() => onTabChange("supplier")}>
          <Handshake className="h-4 w-4" aria-hidden />
          التسجيل كمورد
        </TabButton>
      </div>
      <div className="mt-8">{tab === "rfq" ? <RfqForm /> : <SupplierForm />}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function RfqForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const parsed = rfqSchema.safeParse({
        title: String(fd.get("title") ?? ""),
        category: String(fd.get("category") ?? ""),
        entity_name: String(fd.get("entity_name") ?? ""),
        entity_kind: String(fd.get("entity_kind") ?? ""),
        region: String(fd.get("region") ?? ""),
        deadline: String(fd.get("deadline") ?? ""),
        budget: String(fd.get("budget") ?? ""),
        description: String(fd.get("description") ?? ""),
      });
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next);
        throw new Error("validation");
      }
      setErrors({});
      const { error } = await supabase.from("rfqs").insert({
        ...parsed.data,
        budget: parsed.data.budget || null,
        description: parsed.data.description,
        owner_id: user!.id,
      });
      if (error) throw error;
      form.reset();
    },
    onSuccess: () => {
      toast.success("تم نشر طلب عرض السعر في لوحة الفرص");
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
    },
    onError: (e: Error) => {
      if (e.message !== "validation") {
        toast.error("تعذر النشر — تأكد من اعتماد جهتك في المجتمع أولاً");
      }
    },
  });

  return (
    <form
      className="card-elevated grid gap-5 p-7 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate(e.currentTarget);
      }}
    >
      <div className="md:col-span-2">
        <FormField label="عنوان المشروع / التوريد" error={errors["title"]}>
          <Input name="title" maxLength={160} placeholder="مثال: توريد سلال غذائية لموسم الشتاء" />
        </FormField>
      </div>
      <FormField label="تصنيف المشتريات" error={errors["category"]}>
        <select name="category" defaultValue="" className={selectClass}>
          <option value="">اختر التصنيف</option>
          {RFQ_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FormField>
      <FormField label="نوع الجهة الطارحة" error={errors["entity_kind"]}>
        <select name="entity_kind" defaultValue="" className={selectClass}>
          <option value="">اختر النوع</option>
          {ENTITY_KINDS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </FormField>
      <FormField label="اسم الجهة الطارحة" error={errors["entity_name"]}>
        <Input name="entity_name" maxLength={160} />
      </FormField>
      <FormField label="المنطقة المستهدفة" error={errors["region"]}>
        <select name="region" defaultValue="" className={selectClass}>
          <option value="">اختر المنطقة</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </FormField>
      <FormField label="تاريخ انتهاء التقديم" error={errors["deadline"]}>
        <Input name="deadline" type="date" dir="ltr" />
      </FormField>
      <FormField label="الميزانية التقديرية (اختياري)" error={errors["budget"]}>
        <Input name="budget" maxLength={80} placeholder="مثال: 50,000 - 80,000 ريال" />
      </FormField>
      <div className="md:col-span-2">
        <FormField label="وصف الطلب والمتطلبات" error={errors["description"]}>
          <Textarea name="description" rows={5} maxLength={2000} />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={submit.isPending} className="rounded-full font-bold">
          {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          نشر الفرصة
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          النشر متاح للجهات المعتمدة في المجتمع فقط بعد التحقق من الترخيص.
        </p>
      </div>
    </form>
  );
}

function SupplierForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mine = useQuery({
    queryKey: ["supplier", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchMySupplier(user!.id),
  });
  const supplier = mine.data;

  const submit = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const parsed = supplierSchema.safeParse({
        company_name: String(fd.get("company_name") ?? ""),
        cr_number: String(fd.get("cr_number") ?? "").replace(/\s|-/g, ""),
        category: String(fd.get("category") ?? ""),
        region: String(fd.get("region") ?? ""),
        contact_name: String(fd.get("contact_name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        about: String(fd.get("about") ?? ""),
      });
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next);
        throw new Error("validation");
      }
      setErrors({});
      const { error } = await supabase
        .from("suppliers")
        .upsert(
          { ...parsed.data, about: parsed.data.about ?? "", user_id: user!.id },
          { onConflict: "user_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حفظ ملف المورد بنجاح");
      queryClient.invalidateQueries({ queryKey: ["supplier", user?.id] });
    },
    onError: (e: Error) => {
      if (e.message !== "validation") toast.error("تعذر حفظ البيانات، حاول مرة أخرى");
    },
  });

  return (
    <form
      className="card-elevated grid gap-5 p-7 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate(e.currentTarget);
      }}
    >
      <FormField label="اسم المنشأة" error={errors["company_name"]}>
        <Input name="company_name" defaultValue={supplier?.company_name ?? ""} maxLength={160} />
      </FormField>
      <FormField label="رقم السجل التجاري" error={errors["cr_number"]}>
        <Input
          name="cr_number"
          inputMode="numeric"
          dir="ltr"
          defaultValue={supplier?.cr_number ?? ""}
          maxLength={12}
        />
      </FormField>
      <FormField label="تصنيف التوريد" error={errors["category"]}>
        <select name="category" defaultValue={supplier?.category ?? ""} className={selectClass}>
          <option value="">اختر التصنيف</option>
          {RFQ_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FormField>
      <FormField label="المنطقة" error={errors["region"]}>
        <select name="region" defaultValue={supplier?.region ?? ""} className={selectClass}>
          <option value="">اختر المنطقة</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </FormField>
      <FormField label="اسم المسؤول" error={errors["contact_name"]}>
        <Input name="contact_name" defaultValue={supplier?.contact_name ?? ""} maxLength={120} />
      </FormField>
      <FormField label="البريد الإلكتروني" error={errors["email"]}>
        <Input name="email" type="email" dir="ltr" defaultValue={supplier?.email ?? ""} maxLength={200} />
      </FormField>
      <FormField label="رقم الجوال" error={errors["phone"]}>
        <Input name="phone" inputMode="tel" dir="ltr" defaultValue={supplier?.phone ?? ""} maxLength={14} />
      </FormField>
      <div className="md:col-span-2">
        <FormField label="نبذة عن خدمات المنشأة" error={errors["about"]}>
          <Textarea name="about" rows={4} defaultValue={supplier?.about ?? ""} maxLength={1000} />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={submit.isPending} className="rounded-full font-bold">
          {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {supplier ? "تحديث ملف المورد" : "التسجيل كمورد"}
        </Button>
      </div>
    </form>
  );
}
