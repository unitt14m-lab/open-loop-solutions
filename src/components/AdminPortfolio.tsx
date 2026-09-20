import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { getPortfolioIcon, portfolioIconOptions, type PortfolioIconType } from "@/lib/portfolio-icons";

type FormState = { title: string; driveUrl: string; iconType: PortfolioIconType };

const emptyForm: FormState = { title: "", driveUrl: "", iconType: "project_file" };

function isGoogleDriveUrl(value: string) {
  try {
    return new URL(value).hostname === "drive.google.com";
  } catch {
    return false;
  }
}

export function AdminPortfolio() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const items = useQuery({
    queryKey: ["admin-portfolio-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id,title,drive_url,sort_order,icon_type")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-portfolio-items"] });
    queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const driveUrl = form.driveUrl.trim();
    if (!title) {
      toast.error("أدخل عنوان العمل");
      return;
    }
    if (!isGoogleDriveUrl(driveUrl)) {
      toast.error("أدخل رابط Google Drive صحيحاً");
      return;
    }

    setBusy(true);
    const result = editingId
      ? await supabase
          .from("portfolio_items")
          .update({ title, drive_url: driveUrl, icon_type: form.iconType })
          .eq("id", editingId)
      : await supabase.from("portfolio_items").insert({
          title,
          drive_url: driveUrl,
          icon_type: form.iconType,
          sort_order: items.data?.length ?? 0,
        });
    setBusy(false);

    if (result.error) {
      toast.error(editingId ? "تعذر تعديل العمل" : "تعذر إضافة العمل");
      return;
    }
    toast.success(editingId ? "تم تعديل العمل" : "تمت إضافة العمل");
    reset();
    refresh();
  };

  const startEditing = (item: NonNullable<typeof items.data>[number]) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      driveUrl: item.drive_url,
      iconType: item.icon_type as PortfolioIconType,
    });
  };

  const remove = async (id: string) => {
    if (!window.confirm("هل تريد حذف هذا العمل؟")) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) {
      toast.error("تعذر حذف العمل");
      return;
    }
    if (editingId === id) reset();
    toast.success("تم حذف العمل");
    refresh();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const current = items.data?.[index];
    const adjacent = items.data?.[index + direction];
    if (!current || !adjacent) return;

    const { error: currentError } = await supabase
      .from("portfolio_items")
      .update({ sort_order: adjacent.sort_order })
      .eq("id", current.id);
    if (currentError) {
      toast.error("تعذر تغيير الترتيب");
      return;
    }
    const { error: adjacentError } = await supabase
      .from("portfolio_items")
      .update({ sort_order: current.sort_order })
      .eq("id", adjacent.id);
    if (adjacentError) {
      await supabase
        .from("portfolio_items")
        .update({ sort_order: current.sort_order })
        .eq("id", current.id);
      toast.error("تعذر تغيير الترتيب");
      return;
    }
    refresh();
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold">إدارة أعمالنا</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          أضف عناوين الأعمال وروابطها، ثم رتّب ظهورها في الصفحة.
        </p>
      </div>

      <form onSubmit={save} className="card-elevated grid gap-4 p-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="portfolio-title">عنوان العمل / الفيديو</Label>
          <Input
            id="portfolio-title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="فيديو تعريفي بالذكاء الاصطناعي"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="portfolio-icon-type">أيقونة العمل</Label>
          <Select
            value={form.iconType}
            onValueChange={(value: PortfolioIconType) =>
              setForm((current) => ({ ...current, iconType: value }))
            }
          >
            <SelectTrigger id="portfolio-icon-type" className="max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {portfolioIconOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" aria-hidden />
                      {option.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio-drive-url">رابط Google Drive</Label>
          <Input
            id="portfolio-drive-url"
            type="url"
            dir="ltr"
            value={form.driveUrl}
            onChange={(event) => setForm((current) => ({ ...current, driveUrl: event.target.value }))}
            placeholder="https://drive.google.com/file/d/.../view"
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" disabled={busy} className="font-bold">
            {editingId ? "حفظ التعديل" : "إضافة العمل"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={reset}>
              إلغاء
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {items.data?.map((item, index) => {
          const WorkIcon = getPortfolioIcon(item.icon_type).icon;
          return (
          <article
            key={item.id}
            className="card-elevated flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <a
              href={item.drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 items-center gap-2 font-bold hover:text-primary"
            >
              <WorkIcon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{item.title}</span>
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
            </a>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="تحريك لأعلى"
                title="تحريك لأعلى"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => move(index, 1)}
                disabled={index === (items.data?.length ?? 0) - 1}
                aria-label="تحريك لأسفل"
                title="تحريك لأسفل"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => startEditing(item)}
                aria-label="تعديل"
                title="تعديل"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => remove(item.id)}
                aria-label="حذف"
                title="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </article>
          );
        })}
        {items.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد أعمال مضافة بعد.</p>
        )}
      </div>
    </section>
  );
}