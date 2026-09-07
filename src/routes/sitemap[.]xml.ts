import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapStaticPaths,
  sitemapXML,
  type SitemapEntry,
} from "@/lib/sitemap";
import { serviceCategories } from "@/data/site";

const BASE_URL = "https://open-loop-solutions.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        if (!BASE_URL) {
          return new Response("Sitemap domain not configured", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        // Public service category pages backed by local data
        const categoryRoute = router.routesById["/services/$category"];
        if (isSitemapRouteIncluded(categoryRoute)) {
          for (const category of serviceCategories) {
            const location = router.buildLocation({
              to: "/services/$category",
              params: { category: category.slug },
              search: () => ({}),
              hash: "",
            });
            const path = sitemapPathForLocation(router, location, "/services/$category");
            if (path) entries.push({ path });
          }
        }

        if (entries.length === 0)
          return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
