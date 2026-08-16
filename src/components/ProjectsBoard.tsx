import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, CalendarClock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export type ProjectRow = {
  id: string;
  title: string;
  brief: string;
  deliverables: string;
  requirements: string;
  field: string;
  budget: string | null;
  duration: string | null;
};

const schema = z.object({
  note: z
    .string()
    .trim()
    .min(10, "اكتب نبذة لا تقل عن 10 أحرف عن خبرتك في هذا المشروع")
    .max(1000, "النص طويل جداً"),
  portfolio: z
    .string()
    .trim()
    .max(300, "الرابط طويل جداً")
    .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "الرجاء إدخال رابط صحيح يبدأ بـ http"),
});

export function ProjectsBoard() {
  const { user } = useAuth();
  const [active, setActive] = useState<ProjectRow | null>(null);
  const [note, setNote] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const projects = useQuery({
    queryKey: ["open-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id,title,brief,deliverables,requirements,field,budget,duration")
        .eq("is_open", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProjectRow[];
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ note, portfolio });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    if (!user || !active) return;
    setBusy(true);
    const { error } = await supabase.from("project_applications").insert({
      project_id: active.id,
      user_id: user.id,
      note: parsed.data.note,
      portfolio_url: parsed.data.portfolio || null,
    });
    setBusy(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "سبق أن تقدّمت على هذا المشروع" : "تعذر إرسال الطلب، حاول مرة أخرى",
      );
      return;
    }
    toast.success("تم إرسال طلب التقديم", { description: "تابع حالته من لوحة حسابك." });
    setActive(null);
    setNote("");
    setPortfolio("");
  };

  return (
    <>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.isLoading && <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>}
        {projects.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد مشاريع مفتوحة حالياً.</p>
        )}
        {projects.data?.map((p) => (
          <article key={p.id} className="card-elevated flex flex-col p-7">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
              <Briefcase className="h-3.5 w-3.5" aria-hidden />
              {p.field || "مشروع مفتوح"}
            </span>
            <h3 className="mt-4 text-lg font-extrabold leading-snug">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.brief}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-xs font-bold text-muted-foreground">المخرجات المطلوبة</dt>
                <dd className="mt-0.5 leading-relaxed">{p.deliverables}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground">المتطلبات</dt>
                <dd className="mt-0.5 leading-relaxed">{p.requirements}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
              {p.budget && (
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" aria-hidden />
                  {p.budget}
                </span>
              )}
              {p.duration && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4" aria-hidden />
                  {p.duration}
                </span>
              )}
            </div>
            <Button
              className="mt-6 rounded-full font-bold"
              onClick={() => {
                setActive(p);
                setErrors({});
              }}
            >
              تقدّم على المشروع
            </Button>
          </article>
        ))}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader className="text-start">
            <DialogTitle>التقديم على المشروع</DialogTitle>
            <DialogDescription>{active?.title}</DialogDescription>
          </DialogHeader>
          <AuthGate>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-note">نبذة عن خبرتك ومقترحك للتنفيذ</Label>
                <Textarea
                  id="app-note"
                  rows={5}
                  maxLength={1000}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {errors["note"] && (
                  <p className="text-xs font-semibold text-destructive">{errors["note"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-portfolio">رابط معرض الأعمال (اختياري)</Label>
                <Input
                  id="app-portfolio"
                  dir="ltr"
                  placeholder="https://"
                  maxLength={300}
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
                {errors["portfolio"] && (
                  <p className="text-xs font-semibold text-destructive">{errors["portfolio"]}</p>
                )}
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full font-bold">
                إرسال التقديم
              </Button>
            </form>
          </AuthGate>
        </DialogContent>
      </Dialog>
    </>
  );
}
