import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const RFQ_CATEGORIES = [
  "تغذية وإعاشة",
  "تقنية وأنظمة",
  "تسويق وإعلان",
  "استشارات وحوكمة",
  "تدريب وتأهيل",
  "لوجستيات ونقل",
  "مقاولات وصيانة",
  "أثاث وتجهيزات",
  "أخرى",
] as const;

export const ENTITY_KINDS = [
  "جمعية أهلية",
  "مؤسسة أهلية",
  "شركة تابعة لجمعية",
] as const;

export const SECTORS = [
  "التنمية الاجتماعية",
  "الإسكان والإيواء",
  "الصحة",
  "التعليم والتدريب",
  "الأيتام والأسر",
  "الإغاثة والإعاشة",
  "البيئة والاستدامة",
  "الأوقاف وتنمية الموارد",
  "أخرى",
] as const;

export const TERMS_VERSION = "v1.0";

export const LEGAL_DISCLAIMER =
  "تعمل أوبن لوب كمنصة وسيط رقمي لإدارة الفرص وتقديم عروض الأسعار والمتابعة، وليست طرفاً مباشراً في العقود النهائية ما لم يُنص على ذلك صراحةً.";

export const OPPORTUNITY_STATUS: Record<string, { label: string; tone: string }> = {
  draft: { label: "مسودة", tone: "bg-muted text-foreground" },
  pending: { label: "بانتظار اعتماد الإدارة", tone: "bg-amber-500/20 text-amber-700 dark:text-amber-300" },
  published: { label: "منشورة", tone: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" },
  rejected: { label: "مرفوضة", tone: "bg-destructive/20 text-destructive" },
  closed: { label: "مغلقة / تم التعميد", tone: "bg-primary/15 text-primary dark:text-gold" },
};

export const ACCOUNT_STATUS: Record<string, { label: string; tone: string }> = {
  pending: { label: "بانتظار الاعتماد", tone: "bg-amber-500/20 text-amber-700 dark:text-amber-300" },
  approved: { label: "معتمد", tone: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" },
  rejected: { label: "مرفوض", tone: "bg-destructive/20 text-destructive" },
};

export const QUOTE_STATUS: Record<string, { label: string; tone: string }> = {
  new: { label: "قيد الدراسة", tone: "bg-amber-500/20 text-amber-700 dark:text-amber-300" },
  shortlisted: { label: "ضمن القائمة المختصرة", tone: "bg-primary/15 text-primary dark:text-gold" },
  awarded: { label: "تم التعميد", tone: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" },
  rejected: { label: "غير مرشح", tone: "bg-destructive/20 text-destructive" },
};

export const COMMISSION_STATUS: Record<string, { label: string; tone: string }> = {
  pending: { label: "مستحقة", tone: "bg-amber-500/20 text-amber-700 dark:text-amber-300" },
  collected: { label: "محصلة", tone: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" },
  overdue: { label: "متأخرة", tone: "bg-destructive/20 text-destructive" },
};

export type Rfq = {
  id: string;
  owner_id: string;
  title: string;
  category: string;
  entity_name: string;
  entity_kind: string;
  region: string;
  city: string;
  sector: string;
  description: string;
  budget: string | null;
  deadline: string;
  is_open: boolean;
  status: string;
  rejection_reason: string;
  awarded_quote_id: string | null;
  created_at: string;
};

export type Quote = {
  id: string;
  rfq_id: string;
  supplier_id: string;
  supplier_name: string;
  amount: string;
  duration: string;
  note: string;
  contact: string;
  status: string;
  created_at: string;
};

export type SupplierProfile = {
  id: string;
  user_id: string;
  company_name: string;
  cr_number: string;
  category: string;
  region: string;
  contact_name: string;
  email: string;
  phone: string;
  about: string;
  status: string;
};

export async function fetchRfqs() {
  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("is_open", true)
    .eq("status", "published")
    .order("deadline", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Rfq[];
}

export async function fetchMyRfqs(userId: string) {
  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Rfq[];
}

export async function fetchQuotesForRfq(rfqId: string) {
  const { data, error } = await supabase
    .from("rfq_quotes")
    .select("*")
    .eq("rfq_id", rfqId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Quote[];
}

export async function fetchMySupplier(userId: string) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as SupplierProfile | null) ?? null;
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("opportunity_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchSettings() {
  const { data, error } = await supabase.from("platform_settings").select("*");
  if (error) throw error;
  const map: Record<string, Record<string, unknown>> = {};
  for (const row of data ?? []) map[row.key] = (row.value ?? {}) as Record<string, unknown>;
  return map;
}

/** Records a digital terms acceptance (user, version, type, action, timestamp). */
export async function logTermsAcceptance(input: {
  userId: string;
  acceptanceType: string;
  relatedAction: string;
  relatedId?: string | null;
}) {
  await supabase.from("user_terms_acceptances").insert({
    user_id: input.userId,
    terms_version: TERMS_VERSION,
    acceptance_type: input.acceptanceType,
    related_action: input.relatedAction,
    related_id: input.relatedId ?? null,
  });
}

export async function logAudit(input: {
  actorId: string;
  action: string;
  entityType?: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}) {
  await supabase.from("audit_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity_type: input.entityType ?? "",
    entity_id: input.entityId ?? null,
    meta: (input.meta ?? {}) as never,
  });
}

export function isExpired(deadline: string) {
  return new Date(deadline).getTime() < new Date().setHours(0, 0, 0, 0);
}

export function formatDeadline(deadline: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(deadline));
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 2 }).format(value);
}

/** Keeps unsent form input in local storage so drafts survive reloads or failed submissions. */
export function useFormDraft(key: string) {
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`draft:${key}`);
      if (raw) setDraft(JSON.parse(raw) as Record<string, string>);
    } catch {
      /* ignore unreadable drafts */
    }
  }, [key]);

  const save = useCallback(
    (form: HTMLFormElement) => {
      const values: Record<string, string> = {};
      new FormData(form).forEach((value, name) => {
        if (typeof value === "string") values[name] = value;
      });
      setDraft(values);
      try {
        window.localStorage.setItem(`draft:${key}`, JSON.stringify(values));
      } catch {
        /* storage may be unavailable */
      }
    },
    [key]
  );

  const clear = useCallback(() => {
    setDraft({});
    try {
      window.localStorage.removeItem(`draft:${key}`);
    } catch {
      /* ignore */
    }
  }, [key]);

  return { draft, save, clear };
}

/** Turns rows into a CSV (UTF-8 BOM) and triggers a browser download. */
export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]!);
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
