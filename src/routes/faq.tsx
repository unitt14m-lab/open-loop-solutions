import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/LegalPage";
import { FAQ } from "@/data/legal";

export const Route = createFileRoute("/faq")({
  staticData: { sitemap: true },
  head: () => legalHead("الأسئلة الشائعة", "إجابات عن دور أوبن لوب في المنافسات والفرص والخدمات المساندة والخصوصية."),
  component: () => (
    <LegalPage title="الأسئلة الشائعة">
      <div className="space-y-4">
        {FAQ.map((f) => (
          <details key={f.q} className="rounded-2xl border border-border bg-card p-5" open>
            <summary className="cursor-pointer font-extrabold">س: {f.q}</summary>
            <p className="mt-3 text-muted-foreground">ج: {f.a}</p>
          </details>
        ))}
      </div>
    </LegalPage>
  ),
});
