import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABELS } from "@/lib/requests";

const empty = {
  title: "",
  field: "",
  brief: "",
  deliverables: "",
  requirements: "",
  budget: "",
  duration: "",
  image_url: "",
};

export function AdminProjects() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const projects = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const applications = useQuery({
    queryKey: ["admin-project-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_applications")
        .select("id,status,note,portfolio_url,created_at,projects(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 3 || form.brief.trim().length < 10) {
      toast.error("الرجاء تعبئة عنوان المشروع والوصف");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("projects").insert({
      title: form.title.trim(),
      field: form.field.trim(),
      brief: form.brief.trim(),
      deliverables: form.deliverables.trim(),
      requirements: form.requirements.trim(),
      budget: form.budget.trim() || null,
      duration: form.duration.trim() || null,
      image_url: form.image_url.trim() || null,
    });
    setBusy(false);
    if (error) {
      toast.error("تعذر نشر المشروع");
      return;
    }
    toast.success("تم نشر المشروع");
    setForm(empty);
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    queryClient.invalidateQueries({ queryKey: ["board-projects"] });
  };

  const toggleOpen = async (id: string, isOpen: boolean) => {
    const { error } = await supabase.from("projects").update({ is_open: isOpen }).eq("id", id);
    if (error) {
      toast.error("تعذر تحديث المشروع");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    queryClient.invalidateQueries({ queryKey: ["board-projects"] });
  };

  const updateApplication = async (id: string, status: string) => {
    const { error } = await supabase
      .from("project_applications")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("تعذر تحديث الحالة");
      return;
    }
    toast.success("تم تحديث الحالة");
    queryClient.invalidateQueries({ queryKey: ["admin-project-applications"] });
  };

  const field = (key: keyof typeof form, label: string, area = false) => (
    <div className="space-y-2">
      <Label htmlFor={`pr-${key}`}>{label}</Label>
      {area ? (
        <Textarea
          id={`pr-${key}`}
          rows={3}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      ) : (
        <Input
          id={`pr-${key}`}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="card-elevated p-7">
        <h2 className="text-lg font-extrabold">نشر مشروع جديد على لوحة المستقلين</h2>
        <form onSubmit={createProject} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field("title", "عنوان المشروع")}</div>
          {field("field", "المجال / التخصص")}
          {field("budget", "الميزانية")}
          {field("duration", "المدة الزمنية")}
          <div className="sm:col-span-2">
            {field("image_url", "رابط صورة المشروع (اختياري)")}
          </div>
          {form.image_url.trim() !== "" && (
            <img
              src={form.image_url}
              alt="معاينة صورة المشروع"
              className="h-32 w-full rounded-2xl object-cover sm:col-span-2"
            />
          )}
          <div className="sm:col-span-2">{field("brief", "وصف المشروع", true)}</div>
          <div className="sm:col-span-2">{field("deliverables", "المخرجات المطلوبة", true)}</div>
          <div className="sm:col-span-2">{field("requirements", "المتطلبات", true)}</div>
          <Button type="submit" disabled={busy} className="rounded-full font-bold sm:col-span-2">
            نشر المشروع
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-extrabold">المشاريع المنشورة</h2>
        <div className="mt-4 space-y-3">
          {projects.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد مشاريع بعد.</p>
          )}
          {projects.data?.map((p) => (
            <article
              key={p.id}
              className="card-elevated flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div className="min-w-0">
                <h3 className="text-base font-extrabold">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.field}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full">{p.is_open ? "مفتوح" : "مغلق"}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full font-bold"
                  onClick={() => toggleOpen(p.id, !p.is_open)}
                >
                  {p.is_open ? "إغلاق التقديم" : "إعادة الفتح"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-extrabold">طلبات التقديم على المشاريع</h2>
        <div className="mt-4 space-y-3">
          {applications.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد تقديمات بعد.</p>
          )}
          {applications.data?.map((a) => (
            <article key={a.id} className="card-elevated p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold">{a.projects?.title ?? "مشروع"}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString("ar-SA")}
                  </p>
                </div>
                <Select value={a.status} onValueChange={(v) => updateApplication(a.id, v)}>
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
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.note}</p>
              {a.portfolio_url && (
                <a
                  href={a.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="mt-2 block text-xs font-bold text-primary dark:text-gold hover:underline"
                >
                  {a.portfolio_url}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
