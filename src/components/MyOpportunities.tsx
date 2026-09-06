import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, CalendarClock, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MarketplaceDisclaimer, StatusBadge } from "@/components/MarketplaceDisclaimer";
import { OpportunityQuestions } from "@/components/OpportunityQuestions";
import { FormField } from "@/components/RfqBoard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  OPPORTUNITY_STATUS,
  QUOTE_STATUS,
  fetchMyRfqs,
  fetchQuotesForRfq,
  fetchSettings,
  formatDeadline,
  formatMoney,
  logAudit,
  type Quote,
  type Rfq,
} from "@/lib/marketplace";

/** Project-owner workspace: track posted opportunities, review quotes and register the awarded contract. */
export function MyOpportunities() {
  const { user } = useAuth();
  const [award, setAward] = useState<{ rfq: Rfq; quote: Quote } | null>(null);

  const rfqs = useQuery({
    queryKey: ["my-rfqs", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchMyRfqs(user!.id),
  });

  if (rfqs.isLoading) return <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>;
  if (!rfqs.data?.length)
    return (
      <div className="card-elevated p-8 text-center">
        <p className="text-sm font-bold">لم تطرح أي فرصة بعد</p>
        <p className="mt-2 text-xs text-muted-foreground">
          اطرح طلب عرض سعر من صفحة فُرص Open Loop ليصل إلى مقدمي الخدمة المعتمدين.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <MarketplaceDisclaimer />
      {rfqs.data.map((rfq) => (
        <RfqRow key={rfq.id} rfq={rfq} onAward={(quote) => setAward({ rfq, quote })} />
      ))}
      <AwardDialog data={award} onClose={() => setAward(null)} />
    </div>
  );
}

function RfqRow({ rfq, onAward }: { rfq: Rfq; onAward: (quote: Quote) => void }) {
  const quotes = useQuery({
    queryKey: ["rfq-quotes", rfq.id],
    queryFn: () => fetchQuotesForRfq(rfq.id),
  });

  return (
    <article className="card-elevated p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-extrabold leading-snug">{rfq.title}</h3>
          {rfq.requires_openloop_review && (
            <p className="mt-2 w-fit rounded-full bg-gold/20 px-3 py-1 text-[11px] font-extrabold text-primary">
              طلبتَ من فُرص Open Loop دراسة العروض وترشيح أفضل 3
            </p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            ينتهي التقديم: {formatDeadline(rfq.deadline)}
          </p>
        </div>
        <StatusBadge status={rfq.status} map={OPPORTUNITY_STATUS} />
      </div>

      {rfq.status === "rejected" && rfq.rejection_reason && (
        <p className="mt-3 text-xs font-bold text-destructive">سبب الرفض: {rfq.rejection_reason}</p>
      )}

      <div className="mt-5 space-y-3">
        <h4 className="text-sm font-extrabold">العروض المقدَّمة ({quotes.data?.length ?? 0})</h4>
        {quotes.data?.map((q) => (
          <div
            key={q.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/50 p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-extrabold">{q.supplier_name}</p>
              <p className="mt-1 text-xs font-bold text-muted-foreground">
                القيمة: {q.amount} — المدة: {q.duration || "غير محددة"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={q.status} map={QUOTE_STATUS} />
              <Button
                size="sm"
                className="rounded-full font-bold"
                disabled={rfq.status !== "published" || q.status === "awarded"}
                onClick={() => onAward(q)}
              >
                <Award className="h-4 w-4" aria-hidden />
                التعميد وتسجيل العقد
              </Button>
            </div>
          </div>
        ))}
        {quotes.data?.length === 0 && (
          <p className="text-xs font-bold text-muted-foreground">لا توجد عروض حتى الآن.</p>
        )}
      </div>

      <div className="mt-5">
        <OpportunityQuestions rfqId={rfq.id} canAnswer />
      </div>
    </article>
  );
}

function AwardDialog({
  data,
  onClose,
}: {
  data: { rfq: Rfq; quote: Quote } | null;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const settings = useQuery({ queryKey: ["platform-settings"], queryFn: fetchSettings });
  const percent = Number(settings.data?.["commission"]?.["percent"] ?? 1);
  const maxMb = Number(settings.data?.["uploads"]?.["max_mb"] ?? 10);
  const numericAmount = Number(amount.replace(/[^0-9.]/g, "")) || 0;

  const save = useMutation({
    mutationFn: async () => {
      if (numericAmount <= 0) throw new Error("قيمة العقد غير صحيحة");
      if (file && file.size > maxMb * 1024 * 1024)
        throw new Error(`حجم الملف يتجاوز ${maxMb} ميجابايت`);

      const { data: contract, error } = await supabase
        .from("contracts")
        .insert({
          rfq_id: data!.rfq.id,
          quote_id: data!.quote.id,
          buyer_id: user!.id,
          provider_id: data!.quote.supplier_id,
          title: data!.rfq.title,
          amount: numericAmount,
        })
        .select("id")
        .single();
      if (error) throw error;

      if (file) {
        const path = `${user!.id}/contracts/${contract.id}-${Date.now()}-${file.name}`;
        const upload = await supabase.storage.from("community-files").upload(path, file);
        if (upload.error) throw new Error("تعذر رفع نسخة العقد — تم حفظ العقد بدون مرفق");
        await supabase.from("contract_documents").insert({
          contract_id: contract.id,
          owner_id: user!.id,
          file_path: path,
          file_name: file.name,
        });
      }

      await logAudit({
        actorId: user!.id,
        action: "opportunity.awarded",
        entityType: "rfq",
        entityId: data!.rfq.id,
        meta: { quote_id: data!.quote.id, amount: numericAmount },
      });
    },
    onSuccess: () => {
      toast.success("تم تسجيل العقد واحتساب نسبة الوساطة تلقائياً");
      queryClient.invalidateQueries({ queryKey: ["my-rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      setAmount("");
      setFile(null);
      onClose();
    },
    onError: (e: Error) => toast.error(e.message || "تعذر تسجيل العقد"),
  });

  return (
    <Dialog open={Boolean(data)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تسجيل العقد وتعميد العرض</DialogTitle>
          <DialogDescription>{data?.quote.supplier_name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <FormField label="قيمة العقد النهائية (ريال)">
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              dir="ltr"
            />
          </FormField>
          <FormField label="نسخة العقد (اختياري — ملف خاص لا يُنشر)">
            <Input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </FormField>
          <p className="rounded-2xl bg-secondary/60 p-4 text-xs font-bold leading-relaxed">
            نسبة الوساطة المحتسبة تلقائياً: {percent}% ={" "}
            {formatMoney((numericAmount * percent) / 100)} ريال. يُغلق الطلب بعد التعميد.
          </p>
          <Button
            className="rounded-full font-bold"
            disabled={save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            اعتماد وتسجيل العقد
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
