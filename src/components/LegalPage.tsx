import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-background">
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-extrabold">{title}</h1>
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-4 py-12 text-sm leading-loose sm:px-6">{children}</div>
    </div>
  );
}

export function ComingSoon() {
  return (
    <p className="rounded-2xl border border-dashed border-border p-8 text-center font-bold text-muted-foreground">
      سيتم نشر النص الكامل قريباً.
    </p>
  );
}

export function legalHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | أوبن لوب` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | أوبن لوب` },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
