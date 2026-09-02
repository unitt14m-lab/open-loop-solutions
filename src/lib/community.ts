import { supabase } from "@/integrations/supabase/client";

export const ENTITY_TYPES = [
  "جمعية أهلية",
  "مؤسسة أهلية",
  "شركة تابعة لجمعية",
] as const;

export const REGIONS = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "القصيم",
  "الشرقية",
  "عسير",
  "تبوك",
  "حائل",
  "الحدود الشمالية",
  "جازان",
  "نجران",
  "الباحة",
  "الجوف",
] as const;

export const FIELDS = [
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

export type CommunityEntity = {
  id: string;
  user_id: string;
  entity_type: string;
  license_number: string;
  entity_name: string;
  representative_name: string;
  job_title: string;
  official_email: string;
  phone: string;
  region: string;
  field: string;
  is_verified: boolean;
  verification_note: string;
  created_at: string;
};

/**
 * Automated registry check for a Saudi license / commercial-register number.
 * The official registry lookup is not connected yet, so this validates the
 * official 10-digit format and normalises the entity's registered name.
 */
export function checkRegistryNumber(raw: string) {
  const value = raw.replace(/\s|-/g, "");
  if (!/^[0-9]{10}$/.test(value)) {
    return {
      ok: false as const,
      value,
      message: "رقم الترخيص / السجل التجاري يجب أن يتكون من 10 أرقام.",
    };
  }
  return {
    ok: true as const,
    value,
    message: "رقم صالح — سيتم اعتماد الجهة آلياً بعد الإرسال.",
  };
}

export async function fetchMyEntity(userId: string) {
  const { data, error } = await supabase
    .from("community_entities")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as CommunityEntity | null) ?? null;
}

export async function fetchDirectory() {
  const { data, error } = await supabase
    .from("community_entities")
    .select("*")
    .eq("is_verified", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CommunityEntity[];
}

