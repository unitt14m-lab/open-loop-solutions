import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | أوبن لوب" },
      {
        name: "description",
        content: "سجّل الدخول أو أنشئ حساباً في أوبن لوب لمتابعة طلباتك وخدماتك.",
      },
      { property: "og:title", content: "تسجيل الدخول | أوبن لوب" },
      { property: "og:description", content: "حساب أوبن لوب لإدارة طلباتك ومتابعة حالتها." },
    ],
  }),
  component: AuthPage,
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "الرجاء إدخال الاسم الكامل").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255),
  phone: z.string().trim().min(8, "رقم جوال غير صحيح").max(20),
  organization: z.string().trim().max(120).optional(),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const search = useSearch({ from: "/auth" });
  const [busy, setBusy] = useState(false);

  const dest = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/dashboard";

  useEffect(() => {
    if (user) navigate({ to: dest, replace: true });
  }, [user, dest, navigate]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    setBusy(false);
    if (error) {
      toast.error("تعذر تسجيل الدخول", { description: error.message });
      return;
    }
    toast.success("تم تسجيل الدخول بنجاح");
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      organization: form.get("organization") ?? "",
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "بيانات غير صحيحة");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: parsed.data.fullName,
          phone: parsed.data.phone,
          organization: parsed.data.organization ?? "",
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error("تعذر إنشاء الحساب", { description: error.message });
      return;
    }
    if (!data.session) {
      toast.success("تم إنشاء الحساب", {
        description: "تفقّد بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.",
      });
      return;
    }
    toast.success("تم إنشاء الحساب بنجاح");
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setBusy(false);
    if (result.error) {
      toast.error("تعذر تسجيل الدخول عبر Google");
      return;
    }
    if (result.redirected) return;
    toast.success("تم تسجيل الدخول بنجاح");
  };

  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">حساب أوبن لوب</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed opacity-80">
            أنشئ حسابك لإرسال الطلبات ومتابعة حالتها ومستنداتك من لوحة تحكم واحدة.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="card-elevated p-7">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 rounded-full">
                <TabsTrigger value="signin" className="rounded-full font-bold">
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full font-bold">
                  إنشاء حساب
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={signIn} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">البريد الإلكتروني</Label>
                    <Input id="si-email" name="email" type="email" dir="ltr" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-pass">كلمة المرور</Label>
                    <Input id="si-pass" name="password" type="password" dir="ltr" required />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full rounded-full font-bold">
                    دخول
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signUp} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">الاسم الكامل</Label>
                    <Input id="su-name" name="fullName" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-org">اسم الجهة / الجمعية (اختياري)</Label>
                    <Input id="su-org" name="organization" maxLength={120} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-phone">رقم الجوال</Label>
                    <Input id="su-phone" name="phone" type="tel" dir="ltr" required maxLength={20} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">البريد الإلكتروني</Label>
                    <Input id="su-email" name="email" type="email" dir="ltr" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pass">كلمة المرور</Label>
                    <Input id="su-pass" name="password" type="password" dir="ltr" required />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full rounded-full font-bold">
                    إنشاء الحساب
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              أو
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={google}
              className="w-full rounded-full font-bold"
            >
              المتابعة عبر Google
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
