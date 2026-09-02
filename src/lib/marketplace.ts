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

export type Rfq = {
  id: string;
  owner_id: string;
  title: string;
  category: string;
  entity_name: string;
  entity_kind: string;
  region: string;
  description: string;
  budget: string | null;
  deadline: string;
  is_open: boolean;
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
};



export async function fetchRfqs() {
  const { data, error } = await supabase
    .from("rfqs")
    .select("*")
    .eq("is_open", true)
    .order("deadline", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Rfq[];
}

export async function fetchMySupplier(userId: string) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as SupplierProfile | null) ?? null;
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
