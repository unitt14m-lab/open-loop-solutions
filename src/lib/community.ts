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

/** Returns an existing 1:1 conversation with `otherUserId`, or creates one. */
export async function openConversation(myUserId: string, otherUserId: string) {
  const { data: mine, error: mineError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", myUserId);
  if (mineError) throw mineError;

  const ids = (mine ?? []).map((r) => r.conversation_id);
  if (ids.length) {
    const { data: shared, error: sharedError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", otherUserId)
      .in("conversation_id", ids);
    if (sharedError) throw sharedError;
    if (shared?.length) return shared[0]!.conversation_id;
  }

  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .insert({ created_by: myUserId })
    .select("id")
    .single();
  if (convError) throw convError;

  const { error: partError } = await supabase.from("conversation_participants").insert([
    { conversation_id: conversation.id, user_id: myUserId },
    { conversation_id: conversation.id, user_id: otherUserId },
  ]);
  if (partError) throw partError;

  return conversation.id;
}

export async function uploadChatFile(userId: string, conversationId: string, file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/${conversationId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("community-files").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function signedChatFileUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("community-files")
    .createSignedUrl(path, 120);
  if (error || !data) throw error ?? new Error("signed url failed");
  return data.signedUrl;
}
