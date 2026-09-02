import { useState, type ReactNode } from "react";
import { CheckCircle2, ScrollText, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const RULES = [
  "المجتمع مخصص حصراً للجمعيات الأهلية، والمؤسسات والشركات التابعة للجمعيات الأهلية، والموردين المعتمدين.",
  "تطرح طلبات عروض أسعار (RFQ) بين الأعضاء بمرونة وشفافية.",
  "الالتزام بصحة البيانات النظامية (السجل التجاري / رقم الترخيص) وتحديثها عند تغيّرها.",
  "طلبات عروض الأسعار والعروض المقدَّمة تُستخدم للأغراض الشرائية فقط، ويُمنع استخدامها للتسويق العشوائي.",
  "التواصل بين الأعضاء يتم حصرياً عبر طلبات عروض الأسعار وتحديثات الحالة داخل المنصة.",
  "الالتزام بسرية بيانات الجهات الأخرى وعدم مشاركتها خارج المنصة.",
  "لأوبن لوب حق إيقاف أي حساب يخالف الشروط أو يقدّم بيانات غير صحيحة.",
];

/** Modal listing the community terms & conditions. */
export function TermsModal({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary dark:text-gold" aria-hidden />
            الشروط والأحكام
          </DialogTitle>
          <DialogDescription>شروط الانضمام وأهلية المشاركة في مجتمع أوبن لوب</DialogDescription>
        </DialogHeader>
        <ul className="mt-2 space-y-3">
          {RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-3 text-sm font-semibold leading-relaxed">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-gold"
                aria-hidden
              />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

/** Mandatory terms agreement checkbox with a clickable link to the terms modal. */
export function TermsAgreement({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string | undefined;
}) {
  const [bump, setBump] = useState(0);
  return (
    <div className="md:col-span-2">
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm font-bold">
        <Checkbox
          key={bump}
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          className="mt-0.5"
        />
        <span>
          بالضغط على إنشاء حساب، أنا أوافق على{" "}
          <TermsModal
            trigger={
              <button
                type="button"
                className="font-extrabold text-primary underline underline-offset-4 dark:text-gold"
                onClick={(e) => {
                  e.preventDefault();
                  setBump((n) => n + 1);
                }}
              >
                الشروط والأحكام
              </button>
            }
          />
        </span>
      </label>
      {error && <p className="mt-1.5 text-xs font-bold text-destructive">{error}</p>}
    </div>
  );
}

export function TermsBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-gold-foreground">
      <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden />
      عضو موافق على الشروط
    </span>
  );
}
