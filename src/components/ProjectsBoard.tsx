import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, CalendarClock, CheckCircle2, Sparkles, Wallet } from "lucide-react";
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
import { cn } from "@/lib/utils";

export type ProjectRow = {
  id: string;
  title: string;
  brief: string;
  deliverables: string;
  requirements: string;
  field: string;
  budget: string | null;
  duration: string | null;
  image_url: string | null;
  is_open: boolean;
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

const tabs = [
  { key: "open", label: "المهام المتاحة" },
  { key: "done", label: "الطلبات المنتهية" },
] as const;

export function ProjectsBoard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("open");
  const [active, setActive] = useState<ProjectRow | null>(null);
  const [note, setNote] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const projects = useQuery({
    queryKey: ["board-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id,title,brief,deliverables,requirements,field,budget,duration,image_url,is_open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProjectRow[];
    },
  });

  const list = (projects.data ?? []).filter((p) => (tab === "open" ? p.is_open : !p.is_open));

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
        error.code === "23505" ? "سبق أن تقدّمت على هذه المهمة" : "تعذر إرسال الطلب، حاول مرة أخرى",
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
      <div className="mt-10 inline-flex rounded-full border border-border bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-bold transition-colors",
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {projects.isLoading && <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>}
        {!projects.isLoading && list.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {tab === "open" ? "لا توجد مهام مفتوحة حالياً." : "لا توجد مهام منتهية لعرضها بعد."}
          </p>
        )}
        {list.map((p) => (
          <article key={p.id} className="card-elevated flex flex-col overflow-hidden">
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.title}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden />
                  {p.field || "مهمة"}
                </span>
                <span
                  className={cn(
                    "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                    p.is_open
                      ? "bg-gold text-gold-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {p.is_open ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      متاح للتقديم
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      مهمة منتهية
                    </>
                  )}
                </span>
              </div>
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
              {p.is_open ? (
                <Button
                  className="mt-6 rounded-full font-bold"
                  onClick={() => {
                    setActive(p);
                    setErrors({});
                  }}
                >
                  التقديم على المهمة
                </Button>
              ) : (
                <span className="mt-6 rounded-full border border-border px-4 py-2 text-center text-sm font-bold text-muted-foreground">
                  تم إنجاز هذه المهمة
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {tab === "open" && (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-surface px-6 py-5 text-center text-sm font-bold text-muted-foreground">
          قريباً.. سيتم إدراج المزيد من المهام والمشاريع الجديدة.
        </div>
      )}

      <Dialog open={Boolean(active)} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader className="text-start">
            <DialogTitle>التقديم على المهمة</DialogTitle>
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
