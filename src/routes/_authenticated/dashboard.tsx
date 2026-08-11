import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
              <TabsList className="rounded-full">
                <TabsTrigger value="orders" className="rounded-full font-bold">
                  الطلبات والخدمات
                </TabsTrigger>
                <TabsTrigger value="applications" className="rounded-full font-bold">
                  طلبات الانضمام والتطوع
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

              <TabsContent value="applications" className="mt-5 space-y-4">
                {applications.length === 0 && !requests.isLoading && (
                  <p className="text-sm text-muted-foreground">
                    لا توجد طلبات انضمام أو تطوع حتى الآن.
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
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}
