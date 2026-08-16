import { supabase } from "@/integrations/supabase/client";

export const REQUEST_TYPES = {
  package: "طلب باقة",
  catering: "مشروع إعاشة",
  service: "خدمة مخصصة",
  freelancer: "انضمام مستقل",
} as const;


export type RequestType = keyof typeof REQUEST_TYPES;

export const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  in_review: "قيد المراجعة",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  rejected: "مرفوض",
};

export async function uploadDocument(userId: string, file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("documents").upload(path, file, {
    contentType: file.type || "application/pdf",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function submitRequest(input: {
  userId: string;
  type: RequestType;
  title: string;
  details: Record<string, unknown>;
  file?: File | null;
}) {
  let documentPath: string | null = null;
  if (input.file) documentPath = await uploadDocument(input.userId, input.file);

  const { error } = await supabase.from("requests").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    details: input.details as never,
    document_path: documentPath,
  });
  if (error) throw error;
}
