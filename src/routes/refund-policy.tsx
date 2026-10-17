import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/LegalPage";
import { REFUND_POLICY } from "@/data/legal";

export const Route = createFileRoute("/refund-policy")({
  staticData: { sitemap: true },
  head: () => legalHead("سياسة الإلغاء والاسترجاع", "سياسة إلغاء الطلبات واسترجاع رسوم خدمات أوبن لوب."),
  component: () => (
    <LegalPage title="سياسة الإلغاء والاسترجاع لرسوم الخدمات">
      <ol className="list-decimal space-y-3 ps-6 font-semibold">
        {REFUND_POLICY.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>
    </LegalPage>
  ),
});
