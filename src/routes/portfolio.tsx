import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { JoinBanner } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portfolio")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "أعمالنا | أوبن لوب" },
      {
        name: "description",
        content:
          "تصفّح نماذج مختارة من أعمال أوبن لوب المرئية والإبداعية.",
      },
      { property: "og:title", content: "أعمالنا | أوبن لوب" },
      {
        property: "og:description",
        content: "تصفّح نماذج مختارة من أعمال أوبن لوب المرئية والإبداعية.",
      },

      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});


function Portfolio() {
  const items = useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id,title,drive_url,sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-bold opacity-75">نماذج مختارة</p>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">أعمالنا</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">
            مجموعة من أعمالنا المرئية والإبداعية. اختر أي عمل لعرضه عبر Google Drive.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-border border-y border-border">
            {items.data?.map((item) => (
              <a
                key={item.id}
                href={item.drive_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-20 items-center justify-between gap-4 px-2 py-5 transition-colors hover:text-primary sm:px-4"
              >
                <span className="text-base font-extrabold leading-relaxed sm:text-lg">{item.title}</span>
                <ExternalLink
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden
                />
                <span className="sr-only">يفتح في تبويب جديد</span>
              </a>
            ))}
          </div>
          {items.data?.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">ستُضاف أعمالنا قريباً.</p>
          )}
        </div>
      </section>
      <JoinBanner />
    </>
  );
}
