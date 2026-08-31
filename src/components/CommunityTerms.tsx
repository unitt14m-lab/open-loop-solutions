import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, ScrollText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TERMS_KEY } from "@/lib/marketplace";

const RULES = [
  "المجتمع مخصص حصرياً للجمعيات الأهلية، والمؤسسات والشركات التابعة للجمعيات الأهلية، والموردين المعتمدين.",
  "الالتزام بصحة البيانات النظامية (السجل التجاري / رقم الترخيص) وتحديثها عند تغيّرها.",
  "طلبات عروض الأسعار والعروض المقدَّمة تُستخدم للأغراض الشرائية فقط، ويُمنع استخدامها للتسويق العشوائي.",
  "الالتزام بسرية بيانات الجهات الأخرى وعدم مشاركتها خارج المنصة.",
  "لأوبن لوب حق إيقاف أي حساب يخالف الشروط أو يقدّم بيانات غير صحيحة.",
];

export function useTermsAccepted() {
  const [accepted, setAccepted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAccepted(localStorage.getItem(TERMS_KEY) === "1");
    setReady(true);
  }, []);

  const accept = () => {
    localStorage.setItem(TERMS_KEY, "1");
    setAccepted(true);
  };

  return { accepted, ready, accept };
}

/** Onboarding step: shows community rules and requires agreement before access. */
export function CommunityTermsGate({
  accepted,
  ready,
  onAccept,
  children,
}: {
  accepted: boolean;
  ready: boolean;
  onAccept: () => void;
  children: ReactNode;
}) {
  const [checked, setChecked] = useState(false);

  if (!ready) {
    return <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>;
  }

  if (accepted) return <>{children}</>;

  return (
    <div className="card-elevated mx-auto max-w-3xl p-7">
      <div className="flex items-center gap-3">
        <ScrollText className="h-6 w-6 text-primary dark:text-gold" aria-hidden />
        <h3 className="text-lg font-extrabold">شروط الانضمام وأهلية المشاركة</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        قبل الاطلاع على الفرص أو طرح طلبات عروض الأسعار، يرجى الاطلاع على شروط المجتمع
        والموافقة عليها.
      </p>
      <ul className="mt-5 space-y-3">
        {RULES.map((rule) => (
          <li key={rule} className="flex items-start gap-3 text-sm font-semibold leading-relaxed">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-gold" aria-hidden />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm font-bold">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
          className="mt-0.5"
        />
        <span>أقر بأن جهتي مؤهلة للانضمام، وأوافق على جميع الشروط أعلاه.</span>
      </label>
      <Button
        className="mt-5 rounded-full font-bold"
        disabled={!checked}
        onClick={onAccept}
      >
        <ShieldCheck className="h-4 w-4" aria-hidden />
        الموافقة والمتابعة
      </Button>
    </div>
  );
}
