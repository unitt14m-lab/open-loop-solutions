import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, FileText, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { REQUEST_TYPES, STATUS_LABELS, type RequestType } from "@/lib/requests";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة حسابي | أوبن لوب" },
      { name: "description", content: "تابع طلباتك ومستنداتك وحالتها لدى أوبن لوب." },
      { property: "og:title", content: "لوحة حسابي | أوبن لوب" },
      { property: "og:description", content: "إدارة الطلبات والمستندات والبيانات الشخصية." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const profile = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const requests = useQuery({
    queryKey: ["my-requests", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const projectApplications = useQuery({
    queryKey: ["my-project-applications", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_applications")
        .select("id,status,note,created_at,projects(title,field)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const all = requests.data ?? [];
  const applications = all.filter((r) => r.type === "freelancer");
  const orders = all.filter((r) => r.type !== "freelancer");



  const openDocument = async (path: string) => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 60);
    if (error || !data) {
      toast.error("تعذر فتح المستند");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
  };

  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-14 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold sm:text-4xl">لوحة حسابي</h1>
            <p className="mt-3 text-base opacity-80">
              مرحباً {profile.data?.full_name || user?.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (

              <Button asChild variant="secondary" className="rounded-full font-bold">
                <Link to="/admin">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  لوحة الإدارة
                </Link>
              </Button>
            )}
            <Button onClick={handleSignOut} variant="outline" className="rounded-full font-bold">
              <LogOut className="h-4 w-4" aria-hidden />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] lg:px-8">
          <div className="card-elevated h-fit p-7">
            <h2 className="text-lg font-extrabold">بياناتي</h2>
            <dl className="mt-5 space-y-4 text-sm">
              {[
                ["الاسم", profile.data?.full_name],
                ["البريد الإلكتروني", profile.data?.email ?? user?.email],
                ["رقم الجوال", profile.data?.phone],
                ["الجهة / الجمعية", profile.data?.organization],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-semibold">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <Tabs defaultValue="orders">
              <TabsList className="flex flex-wrap rounded-full">
                <TabsTrigger value="orders" className="rounded-full font-bold">
                  الطلبات والخدمات
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="rounded-full font-bold">
                  فرصي وعروض الأسعار
                </TabsTrigger>
                <TabsTrigger value="applications" className="rounded-full font-bold">
                  طلبات الانضمام
                </TabsTrigger>
                <TabsTrigger value="projects" className="rounded-full font-bold">
                  تقديماتي على المشاريع
                </TabsTrigger>
              </TabsList>



              {requests.isLoading && (
                <p className="mt-4 text-sm text-muted-foreground">جارٍ التحميل...</p>
              )}

              <TabsContent value="orders" className="mt-5 space-y-4">
                {orders.length === 0 && !requests.isLoading && (
                  <p className="text-sm text-muted-foreground">لا توجد طلبات حتى الآن.</p>
                )}
                {orders.map((r) => (
                  <RequestCard key={r.id} request={r} onOpenDocument={openDocument} />
                ))}
              </TabsContent>

              <TabsContent value="opportunities" className="mt-5">
                <MyOpportunities />
              </TabsContent>



              <TabsContent value="applications" className="mt-5 space-y-4">
                {applications.length === 0 && !requests.isLoading && (
                  <p className="text-sm text-muted-foreground">
                    لا توجد طلبات انضمام حتى الآن.
                  </p>
                )}
                {applications.map((r) => (
                  <RequestCard
                    key={r.id}
                    request={r}
                    onOpenDocument={openDocument}
                    tracker
                  />
                ))}
              </TabsContent>

              <TabsContent value="projects" className="mt-5 space-y-4">
                {projectApplications.isLoading && (
                  <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>
                )}
                {projectApplications.data?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    لم تتقدّم على أي مشروع بعد. تصفّح لوحة المشاريع من صفحة «انضم إلينا».
                  </p>
                )}
                {projectApplications.data?.map((a) => (
                  <article key={a.id} className="card-elevated p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-primary dark:text-gold">
                          {a.projects?.field || "مشروع"}
                        </p>
                        <h3 className="mt-1 text-base font-extrabold leading-snug">
                          {a.projects?.title ?? "مشروع"}
                        </h3>
                      </div>
                      <Badge className="rounded-full">{STATUS_LABELS[a.status] ?? a.status}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.note}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString("ar-SA")}
                    </p>
                  </article>
                ))}
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </section>
    </>
  );
}

type RequestRow = {
  id: string;
  type: string;
  title: string;
  status: string;
  details: unknown;
  document_path: string | null;
  created_at: string;
};

const STAGES = ["تم الاستلام", "قيد المراجعة", "تم القبول / الموافقة"];

function stageIndex(status: string) {
  if (status === "completed") return 2;
  if (status === "in_review" || status === "in_progress") return 1;
  return 0;
}

function RequestCard({
  request: r,
  onOpenDocument,
  tracker = false,
}: {
  request: RequestRow;
  onOpenDocument: (path: string) => void;
  tracker?: boolean;
}) {
  const current = stageIndex(r.status);
  const rejected = r.status === "rejected";

  return (
    <article className="card-elevated p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-primary dark:text-gold">
            {REQUEST_TYPES[r.type as RequestType] ?? r.type}
          </p>
          <h3 className="mt-1 text-base font-extrabold leading-snug">{r.title}</h3>
        </div>
        <Badge className="rounded-full">{STATUS_LABELS[r.status] ?? r.status}</Badge>
      </div>

      {tracker && (
        <div className="mt-5">
          <div className="flex items-center">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                      rejected
                        ? "bg-destructive text-destructive-foreground"
                        : i <= current
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {i <= current && !rejected ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                  </span>
                  <span className="whitespace-nowrap text-[11px] font-bold text-muted-foreground">
                    {stage}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <span
                    className={`mx-2 mb-5 h-1 flex-1 rounded-full ${
                      i < current && !rejected ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          {rejected && (
            <p className="mt-3 text-xs font-bold text-destructive">تم رفض الطلب.</p>
          )}
        </div>
      )}

      <pre className="mt-4 whitespace-pre-wrap break-words rounded-2xl bg-secondary p-4 text-xs leading-relaxed text-secondary-foreground">
        {Object.entries((r.details ?? {}) as Record<string, unknown>)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join("، ") : String(v)}`)
          .join("\n")}
      </pre>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>{new Date(r.created_at).toLocaleString("ar-SA")}</span>
        {r.document_path && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full font-bold"
            onClick={() => onOpenDocument(r.document_path!)}
          >
            <FileText className="h-4 w-4" aria-hidden />
            عرض المستند
          </Button>
        )}
      </div>
    </article>
  );
}
