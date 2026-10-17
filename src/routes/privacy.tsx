import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, LegalPage, legalHead } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => legalHead("سياسة الخصوصية", "سياسة الخصوصية لدى أوبن لوب وفق نظام حماية البيانات الشخصية."),
  component: () => (
    <LegalPage title="سياسة الخصوصية وفق نظام حماية البيانات الشخصية">
      <ComingSoon />
    </LegalPage>
  ),
});
