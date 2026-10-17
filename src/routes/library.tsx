import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/Sections";
import { JoinBanner } from "@/components/Footer";

export const Route = createFileRoute("/library")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "المكتبة | أوبن لوب — منتجات وأدلة للقطاع غير الربحي" },
      {
        name: "description",
        content:
          "المكتبة من أوبن لوب: منتجات رقمية وأدلة ولوائح جاهزة للجمعيات والمؤسسات الأهلية بأسعار واضحة ودفع إلكتروني.",
      },
      { property: "og:title", content: "المكتبة | أوبن لوب" },
      {
        property: "og:description",
        content: "منتجات رقمية جاهزة لتطوير عمل جمعيتك، بأسعار واضحة ودفع إلكتروني آمن.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

type Product = { sku: string; title: string; text: string; price: number; vatIncluded: boolean };

// Product catalog — `sku` is the key to map to accounting software / payment gateway later.
const products: Product[] = [
  {
    sku: "OL-LIB-001",
    title: "فهرس اللوائح والسياسات الأساسية للجمعيات الأهلية",
    text: "فهرس شامل يحصر اللوائح والسياسات الأساسية التي تحتاجها الجمعيات والمؤسسات الأهلية لرفع جاهزيتها المؤسسية ومؤشرات الحوكمة والامتثال.",
    price: 99,
    vatIncluded: true,
  },
];

const fmt = (n: number) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(n);

function LibraryPage() {
  return (
    <>
      <section className="surface-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.35] sm:text-4xl">المكتبة</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed opacity-80 sm:text-base">
            منتجات رقمية وأدلة ونماذج جاهزة، صُممت لمساعدة الجمعيات والمؤسسات الأهلية على رفع
            جاهزيتها المؤسسية.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="المنتجات" description="اختر المنتج المناسب وأكمل الدفع الإلكتروني بأمان." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p.sku} className="card-elevated flex flex-col p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <ShoppingBag className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-5 text-base font-extrabold leading-snug">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                <div className="mt-6 flex items-end justify-between gap-3 border-t border-border pt-5">
                  <div>
                    <p className="text-2xl font-extrabold">{fmt(p.price)} ريال</p>
                    <p className="text-xs text-muted-foreground">
                      {p.vatIncluded ? "شامل ضريبة القيمة المضافة" : "غير شامل الضريبة"}
                    </p>
                  </div>
                  <Button
                    className="rounded-full font-bold"
                    onClick={() => toast("بوابة الدفع قيد التفعيل — سيتواصل معك فريقنا لإتمام الشراء.")}
                  >
                    <CreditCard className="h-4 w-4" aria-hidden />
                    اشترِ الآن
                  </Button>
                </div>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  دفع آمن: مدى، فيزا، ماستركارد، Apple Pay
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JoinBanner />
    </>
  );
}
