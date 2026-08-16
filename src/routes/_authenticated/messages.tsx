import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CommunityChat } from "@/components/CommunityChat";

type MessagesSearch = { c?: string | undefined };

export const Route = createFileRoute("/_authenticated/messages")({
  validateSearch: (search: Record<string, unknown>): MessagesSearch => ({
    c: typeof search["c"] === "string" ? search["c"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "محادثات مجتمع أوبن لوب" },
      {
        name: "description",
        content: "مساحة محادثات آمنة بين الجهات المعتمدة في مجتمع أوبن لوب.",
      },
      { property: "og:title", content: "محادثات مجتمع أوبن لوب" },
      {
        property: "og:description",
        content: "راسل الجهات المعتمدة وشارك المستندات داخل مجتمع أوبن لوب.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const { c } = Route.useSearch();
  const navigate = useNavigate();

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold sm:text-4xl">المحادثات</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          تواصل مباشرة مع الجهات المعتمدة في مجتمع أوبن لوب وشارك الملفات بأمان.
        </p>
        <div className="mt-8">
          <CommunityChat
            activeId={c ?? null}
            onSelect={(id) => navigate({ to: "/messages", search: { c: id } })}
          />
        </div>
      </div>
    </section>
  );
}
