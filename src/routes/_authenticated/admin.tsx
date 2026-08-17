import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { REQUEST_TYPES, STATUS_LABELS, type RequestType } from "@/lib/requests";
import { AdminProjects } from "@/components/AdminProjects";


export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | أوبن لوب" },
      { name: "description", content: "متابعة جميع طلبات العملاء وتحديث حالتها." },
      { property: "og:title", content: "لوحة الإدارة | أوبن لوب" },
      { property: "og:description", content: "إدارة الطلبات الواردة من الموقع." },
    ],
  }),
  component: AdminPanel,
});

function AdminPanel() {
  const { isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();

  const requests = useQuery({
    queryKey: ["all-requests"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("requests").update({ status }).eq("id", id);
    if (error) {
      toast.error("تعذر تحديث الحالة");
      return;
    }
    toast.success("تم تحديث الحالة");
    queryClient.invalidateQueries({ queryKey: ["all-requests"] });
  };

  const openDocument = async (path: string) => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 60);
    if (error || !data) {
      toast.error("تعذر فتح المستند");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">لوحة الإدارة</h1>
          <p className="mt-3 text-base opacity-80">جميع الطلبات الواردة من الموقع وحالتها.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!loading && !isAdmin && (
            <p className="text-sm font-bold text-destructive">
              هذه الصفحة مخصصة للمشرفين فقط.
            </p>
          )}

          {isAdmin && (
            <div className="mb-12">
              <AdminProjects />
            </div>
          )}

          <h2 className="mb-4 text-lg font-extrabold">طلبات الموقع</h2>
          <div className="space-y-4">

            {requests.data?.map((r) => (
              <article key={r.id} className="card-elevated p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-primary dark:text-gold">
                      {REQUEST_TYPES[r.type as RequestType] ?? r.type}
                    </p>
                    <h2 className="mt-1 text-base font-extrabold leading-snug">{r.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("ar-SA")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full">{STATUS_LABELS[r.status] ?? r.status}</Badge>
                    <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                      <SelectTrigger className="w-40 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([k, label]) => (
                          <SelectItem key={k} value={k}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <pre className="mt-4 whitespace-pre-wrap break-words rounded-2xl bg-secondary p-4 text-xs leading-relaxed text-secondary-foreground">
                  {Object.entries(r.details as Record<string, unknown>)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join("، ") : String(v)}`)
                    .join("\n")}
                </pre>
                {r.document_path && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-4 rounded-full font-bold"
                    onClick={() => openDocument(r.document_path!)}
                  >
                    <FileText className="h-4 w-4" aria-hidden />
                    عرض المستند
                  </Button>
                )}
              </article>
            ))}
            {requests.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
