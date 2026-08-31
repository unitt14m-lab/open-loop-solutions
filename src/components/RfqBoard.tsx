import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Building2, CalendarClock, Loader2, MapPin, Search, Tag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { REGIONS } from "@/lib/community";
import {
  ENTITY_KINDS,
  RFQ_CATEGORIES,
  fetchRfqs,
  formatDeadline,
  type Rfq,
} from "@/lib/marketplace";

const selectClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold";

const quoteSchema = z.object({
  supplier_name: z.string().trim().min(3, "اسم المنشأة مطلوب").max(160),
  amount: z.string().trim().min(1, "قيمة العرض مطلوبة").max(60),
  duration: z.string().trim().max(80).optional(),
  contact: z.string().trim().min(5, "وسيلة تواصل مطلوبة").max(160),
  note: z.string().trim().max(1000).optional(),
});

export function RfqBoard() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [kind, setKind] = useState("");
  const [active, setActive] = useState<Rfq | null>(null);

  const rfqs = useQuery({ queryKey: ["rfqs"], queryFn: fetchRfqs });

  const list = useMemo(() => {
    const term = q.trim();
    return (rfqs.data ?? []).filter(
      (r) =>
        (!category || r.category === category) &&
        (!region || r.region === region) &&
        (!kind || r.entity_kind === kind) &&
        (!term || r.title.includes(term) || r.entity_name.includes(term))
    );
  }, [rfqs.data, q, category, region, kind]);

  return (
    <div>
      <div className="card-elevated grid gap-4 p-5 md:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground" aria-hidden />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بعنوان الفرصة أو الجهة"
            className="ps-9"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          <option value="">كل التصنيفات</option>
          {RFQ_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
          <option value="">كل المناطق</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className={selectClass}>
          <option value="">كل أنواع الجهات</option>
          {ENTITY_KINDS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {rfqs.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">جارٍ تحميل الفرص...</p>
      ) : list.length === 0 ? (
        <div className="card-elevated mt-8 p-10 text-center">
          <p className="text-sm font-bold">لا توجد فرص مطابقة حالياً</p>
          <p className="mt-2 text-xs text-muted-foreground">
            تابع اللوحة باستمرار، أو اطرح طلب عرض سعر جديد إن كانت جهتك معتمدة.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((rfq) => (
            <article key={rfq.id} className="card-elevated flex flex-col p-6">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-extrabold text-primary dark:text-gold">
                <Tag className="h-3.5 w-3.5" aria-hidden />
                {rfq.category}
              </span>
              <h3 className="mt-4 text-base font-extrabold leading-relaxed">{rfq.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {rfq.description}
              </p>
              <dl className="mt-4 space-y-2 text-xs font-bold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5" aria-hidden />
                  <span>{rfq.entity_name} — {rfq.entity_kind}</span>
                </div>
                {rfq.region && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    <span>{rfq.region}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                  <span>ينتهي التقديم: {formatDeadline(rfq.deadline)}</span>
                </div>
              </dl>
              <Button
                className="mt-6 w-full rounded-full font-bold"
                onClick={() => setActive(rfq)}
                disabled={!user}
              >
                تقديم عرض سعر
              </Button>
            </article>
          ))}
        </div>
      )}

      <QuoteDialog rfq={active} onClose={() => setActive(null)} />
    </div>
  );
}

function QuoteDialog({ rfq, onClose }: { rfq: Rfq | null; onClose: () => void }) {
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const fd = new FormData(form);
      const parsed = quoteSchema.safeParse({
        supplier_name: String(fd.get("supplier_name") ?? ""),
        amount: String(fd.get("amount") ?? ""),
        duration: String(fd.get("duration") ?? ""),
        contact: String(fd.get("contact") ?? ""),
        note: String(fd.get("note") ?? ""),
      });
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next);
        throw new Error("validation");
      }
      setErrors({});
      const { error } = await supabase.from("rfq_quotes").insert({
        rfq_id: rfq!.id,
        supplier_id: user!.id,
        supplier_name: parsed.data.supplier_name,
        amount: parsed.data.amount,
        duration: parsed.data.duration ?? "",
        contact: parsed.data.contact,
        note: parsed.data.note ?? "",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم إرسال عرض السعر إلى الجهة الطارحة");
      onClose();
    },
    onError: (e: Error) => {
      if (e.message !== "validation") toast.error("تعذر إرسال العرض، حاول مرة أخرى");
    },
  });

  return (
    <Dialog open={Boolean(rfq)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تقديم عرض سعر</DialogTitle>
          <DialogDescription>{rfq?.title}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate(e.currentTarget);
          }}
        >
          <FormField label="اسم المنشأة / المورد" error={errors["supplier_name"]}>
            <Input name="supplier_name" maxLength={160} />
          </FormField>
          <FormField label="قيمة العرض (ريال)" error={errors["amount"]}>
            <Input name="amount" inputMode="numeric" maxLength={60} />
          </FormField>
          <FormField label="مدة التنفيذ" error={errors["duration"]}>
            <Input name="duration" maxLength={80} placeholder="مثال: 21 يوم عمل" />
          </FormField>
          <FormField label="وسيلة التواصل (جوال / بريد)" error={errors["contact"]}>
            <Input name="contact" dir="ltr" maxLength={160} />
          </FormField>
          <FormField label="تفاصيل العرض" error={errors["note"]}>
            <Textarea name="note" rows={4} maxLength={1000} />
          </FormField>
          <Button type="submit" disabled={submit.isPending} className="rounded-full font-bold">
            {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            إرسال العرض
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block text-xs font-bold">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs font-bold text-destructive">{error}</p>}
    </div>
  );
}
