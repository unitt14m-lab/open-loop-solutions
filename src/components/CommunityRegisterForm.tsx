import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  ENTITY_TYPES,
  FIELDS,
  REGIONS,
  checkRegistryNumber,
  fetchMyEntity,
} from "@/lib/community";

const OTHER_FIELD = "أخرى";

const schema = z
  .object({
    entity_type: z.string().min(1, "اختر نوع الكيان"),
    license_number: z.string().regex(/^[0-9]{10}$/, "رقم الترخيص / السجل يجب أن يكون 10 أرقام"),
    entity_name: z.string().trim().min(3, "اسم الكيان مطلوب").max(160),
    representative_name: z.string().trim().min(3, "اسم الممثل مطلوب").max(120),
    job_title: z.string().trim().min(2, "المسمى الوظيفي مطلوب").max(120),
    official_email: z.string().trim().email("بريد إلكتروني غير صحيح").max(200),
    phone: z.string().trim().regex(/^0?5[0-9]{8}$/, "رقم جوال سعودي غير صحيح"),
    region: z.string().min(1, "اختر المنطقة"),
    field: z.string().min(1, "اختر مجال العمل"),
    field_other: z.string().optional(),
  })
  .refine(
    (data) =>
      data.field !== OTHER_FIELD ||
      (data.field_other && data.field_other.trim().length >= 2),
    {
      message: "اذكر مجال العمل",
      path: ["field_other"],
    }
  );

const selectClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold";

export function CommunityRegisterForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [license, setLicense] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldValue, setFieldValue] = useState("");
  const [otherField, setOtherField] = useState("");

  const myEntity = useQuery({
    queryKey: ["community-entity", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchMyEntity(user!.id),
  });

  const entity = myEntity.data;

  useEffect(() => {
    if (!entity) {
      setFieldValue("");
      setOtherField("");
      return;
    }
    if (FIELDS.includes(entity.field as (typeof FIELDS)[number])) {
      setFieldValue(entity.field);
      setOtherField("");
    } else {
      setFieldValue(OTHER_FIELD);
      setOtherField(entity.field);
    }
  }, [entity]);

  const registryCheck = license ? checkRegistryNumber(license) : null;

  const submit = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const rawField = String(fd.get("field") ?? "");
      const parsed = schema.safeParse({
        entity_type: String(fd.get("entity_type") ?? ""),
        license_number: String(fd.get("license_number") ?? "").replace(/\s|-/g, ""),
        entity_name: String(fd.get("entity_name") ?? ""),
        representative_name: String(fd.get("representative_name") ?? ""),
        job_title: String(fd.get("job_title") ?? ""),
        official_email: String(fd.get("official_email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        region: String(fd.get("region") ?? ""),
        field: rawField,
        field_other: rawField === OTHER_FIELD ? String(fd.get("field_other") ?? "") : "",
      });
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next);
        throw new Error("validation");
      }
      setErrors({});
      const { field, field_other, ...rest } = parsed.data;
      const effectiveField = field === OTHER_FIELD ? (field_other ?? "").trim() : field;
      const { error } = await supabase
        .from("community_entities")
        .upsert({ ...rest, field: effectiveField, user_id: user!.id }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم إرسال بيانات الجهة والتحقق منها");
      queryClient.invalidateQueries({ queryKey: ["community-entity", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["community-directory"] });
    },
    onError: (e: Error) => {
      if (e.message !== "validation") toast.error("تعذر حفظ البيانات، حاول مرة أخرى");
    },
  });

  if (entity?.is_verified) {
    return (
      <div className="card-elevated flex items-start gap-4 p-7">
        <BadgeCheck className="mt-0.5 h-7 w-7 shrink-0 text-gold" aria-hidden />
        <div>
          <h3 className="text-lg font-extrabold">جهة معتمدة في فُرص Open Loop</h3>
          <p className="mt-2 text-sm font-bold">{entity.entity_name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {entity.entity_type} — {entity.region} — {entity.field}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">{entity.verification_note}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card-elevated grid gap-5 p-7 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate(e.currentTarget);
      }}
    >
      {entity && !entity.is_verified && (
        <p className="md:col-span-2 flex items-center gap-2 rounded-2xl bg-destructive/10 p-4 text-sm font-bold text-destructive">
          <ShieldAlert className="h-4 w-4" aria-hidden />
          {entity.verification_note}
        </p>
      )}

      <Field label="نوع الكيان" error={errors["entity_type"]}>
        <select
          name="entity_type"
          defaultValue={entity?.entity_type ?? ""}
          className={selectClass}
        >
          <option value="">اختر النوع</option>
          {ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="رقم الترخيص / السجل التجاري"
        error={errors["license_number"]}
        hint={registryCheck?.message}
        hintOk={registryCheck?.ok}
      >
        <Input
          name="license_number"
          inputMode="numeric"
          maxLength={12}
          defaultValue={entity?.license_number ?? ""}
          onChange={(e) => setLicense(e.target.value)}
          placeholder="1010XXXXXX"
        />
      </Field>

      <Field label="اسم الكيان (كما في الترخيص)" error={errors["entity_name"]}>
        <Input name="entity_name" defaultValue={entity?.entity_name ?? ""} maxLength={160} />
      </Field>

      <Field label="اسم ممثل الجهة" error={errors["representative_name"]}>
        <Input
          name="representative_name"
          defaultValue={entity?.representative_name ?? ""}
          maxLength={120}
        />
      </Field>

      <Field label="المسمى الوظيفي" error={errors["job_title"]}>
        <Input name="job_title" defaultValue={entity?.job_title ?? ""} maxLength={120} />
      </Field>

      <Field label="البريد الرسمي للجهة" error={errors["official_email"]}>
        <Input
          name="official_email"
          type="email"
          dir="ltr"
          defaultValue={entity?.official_email ?? ""}
          maxLength={200}
        />
      </Field>

      <Field label="رقم الجوال" error={errors["phone"]}>
        <Input name="phone" inputMode="tel" dir="ltr" defaultValue={entity?.phone ?? ""} maxLength={14} />
      </Field>

      <Field label="المنطقة" error={errors["region"]}>
        <select name="region" defaultValue={entity?.region ?? ""} className={selectClass}>
          <option value="">اختر المنطقة</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>

      <Field label="مجال العمل" error={errors["field"]}>
        <select
          name="field"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className={selectClass}
        >
          <option value="">اختر المجال</option>
          {FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Field>

      {fieldValue === OTHER_FIELD && (
        <Field label="اذكر مجال العمل" error={errors["field_other"]}>
          <Input
            name="field_other"
            value={otherField}
            onChange={(e) => setOtherField(e.target.value)}
            maxLength={120}
            placeholder="اكتب مجال عمل الجهة"
          />
        </Field>
      )}

      <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={submit.isPending}
          className="w-full rounded-full font-bold sm:w-auto"
        >
          {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          تحقق وانضم للمجتمع
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          يتم التحقق آلياً من رقم الترخيص / السجل التجاري، وعند نجاح التحقق يُعتمد ملف الجهة
          مباشرة ويظهر في دليل المجتمع.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  hintOk,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  hintOk?: boolean | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block text-xs font-bold">{label}</Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-bold text-destructive">{error}</p>
      ) : hint ? (
        <p className={`mt-1.5 text-xs font-bold ${hintOk ? "text-primary dark:text-gold" : "text-destructive"}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
