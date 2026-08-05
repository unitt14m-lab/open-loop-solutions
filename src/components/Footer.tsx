import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Mail, Phone, MapPin, Twitter, HeartHandshake } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/data/site";

export function VolunteerBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="surface-ink grid gap-6 rounded-[2rem] p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold">
            <HeartHandshake className="h-4 w-4" aria-hidden />
            تطوع معانا
          </span>
          <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
            وقتك وخبرتك قادرة على مضاعفة أثر القطاع غير الربحي
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-80 sm:text-base">
            انضم إلى شبكة متطوعي أوبن لوب من المسوّقين والمصممين وكتّاب المحتوى والاستشاريين،
            وشارك في تمكين الجمعيات من الاستدامة المالية والحوكمة المؤسسية.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary" className="rounded-full px-8 text-base font-bold">
          <Link to="/volunteer">سجّل كمتطوع</Link>
        </Button>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            مؤسسة تسويق واستشارات متكاملة، تمكّن الجمعيات والقطاع غير الربحي من الاستدامة المالية
            والحوكمة المؤسسية.
          </p>
          <div className="mt-5 flex gap-2">
            {[Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="حساب التواصل الاجتماعي"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold">الخدمات</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {serviceCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/services/$category"
                  params={{ category: c.slug }}
                  className="transition-colors hover:text-primary"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold">روابط سريعة</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="transition-colors hover:text-primary">
                عن أوبن لوب
              </Link>
            </li>
            <li>
              <Link to="/packages" className="transition-colors hover:text-primary">
                الباقات
              </Link>
            </li>
            <li>
              <Link to="/volunteer" className="transition-colors hover:text-primary">
                تطوع معانا
              </Link>
            </li>
            <li>
              <Link to="/careers" className="transition-colors hover:text-primary">
                انضم إلينا
              </Link>
            </li>
            <li>
              <Link to="/booking" className="transition-colors hover:text-primary">
                احجز استشارتك
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold">تواصل معنا</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:info@openloop.sa" className="hover:text-primary">
                info@openloop.sa
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href="tel:+966500000000" dir="ltr" className="hover:text-primary">
                +966 50 000 0000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              الرياض، المملكة العربية السعودية
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} أوبن لوب | Open Loop — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
