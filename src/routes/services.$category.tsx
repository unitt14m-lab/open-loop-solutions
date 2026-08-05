import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VolunteerBanner } from "@/components/Footer";
import { serviceCategories } from "@/data/site";

export const Route = createFileRoute("/services/$category")({
  loader: ({ params }) => {
    const category = serviceCategories.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "الخدمة غير متاحة | أوبن لوب" }, { name: "robots", content: "noindex" }],
      };
    }
    const { category } = loaderData;
    return {
      meta: [
        { title: `${category.title} | أوبن لوب` },
        { name: "description", content: category.description },
        { property: "og:title", content: `${category.title} | أوبن لوب` },
        { property: "og:description", content: category.description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();

  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold">
            {category.order}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">{category.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-80">{category.description}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item: string) => (
              <div key={item} className="card-elevated flex items-start gap-3 p-6">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                <p className="min-w-0 text-sm font-bold leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7 font-bold">
              <Link to="/booking">احجز استشارتك</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7 font-bold">
              <Link to="/services">كل الخدمات</Link>
            </Button>
          </div>
        </div>
      </section>

      <VolunteerBanner />
    </>
  );
}
