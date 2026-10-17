import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon, LegalPage, legalHead } from "@/components/LegalPage";

export const Route = createFileRoute("/competition-terms")({
  staticData: { sitemap: true },
  head: () => legalHead("شروط وأحكام المنافسات", "شروط وأحكام طرح المنافسات والتقديم عليها عبر فرص أوبن لوب."),
  component: () => (
    <LegalPage title="شروط وأحكام المنافسات">
      <ComingSoon />
    </LegalPage>
  ),
});
