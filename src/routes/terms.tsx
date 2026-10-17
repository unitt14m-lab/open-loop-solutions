import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, LegalPage, legalHead } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => legalHead("الشروط والأحكام العامة", "الشروط والأحكام العامة لاستخدام موقع أوبن لوب وخدماته."),
  component: () => (
    <LegalPage title="الشروط والأحكام العامة">
      <ComingSoon />
    </LegalPage>
  ),
});
