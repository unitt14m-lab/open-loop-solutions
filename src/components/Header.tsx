import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, LogIn, Menu, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/data/site";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";
import { NoticeBanner } from "./NoticeBanner";

const beforeServices = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "عن أوبن لوب" },
] as const;

const afterServices = [
  { to: "/packages", label: "الباقات" },
  { to: "/portfolio", label: "لمحة عنا" },
  { to: "/library", label: "المكتبة" },
  { to: "/careers", label: "انضم إلينا" },
  { to: "/booking", label: "احجز استشارتك" },
] as const;

const opportunityLinks = [
  { to: "/community", hash: "rfq-board", label: "تصفح الفرص" },
  { to: "/community", hash: "marketplace-forms", label: "طرح فرصة جديدة" },
  { to: "/packages", hash: "", label: "باقة التسويق المجاني" },
  { to: "/community", hash: "support-services", label: "الخدمات المساندة وحوكمة العقود" },
] as const;

const linkClass =
  "rounded-full px-3 py-2 text-sm font-semibold text-primary-foreground/80 transition-colors hover:bg-primary-foreground/12 hover:text-primary-foreground";

export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [oppsOpen, setOppsOpen] = useState(false);

  const displayName =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <header className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="order-2 min-w-0">
          <Logo light />
        </div>

        <nav className="order-1 hidden items-center gap-1 lg:flex">
          {beforeServices.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={linkClass}
              activeProps={{ className: "bg-primary-foreground/15 text-primary-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link to="/services" className={`${linkClass} inline-flex items-center gap-1`}>
              الخدمات
              <ChevronDown className="h-4 w-4" aria-hidden />
            </Link>
            {servicesOpen && (
              <div className="absolute end-0 top-full w-[26rem] pt-2">
                <div className="max-h-[75vh] overflow-y-auto rounded-3xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
                  {serviceCategories.map((c) => (
                    <div key={c.slug} className="rounded-2xl px-3 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to="/services/$category"
                          params={{ category: c.slug }}
                          className="text-sm font-bold hover:text-primary dark:hover:text-gold"
                          onClick={() => setServicesOpen(false)}
                        >
                          {c.order}: {c.title}
                        </Link>
                        <Link
                          to="/services/$category"
                          params={{ category: c.slug }}
                          search={{ service: "all" }}
                          className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground dark:text-gold"
                          onClick={() => setServicesOpen(false)}
                        >
                          اختيار الكل
                        </Link>
                      </div>
                      <div className="mt-1.5 flex flex-col border-s-2 border-border ps-2">
                        {c.items.map((it) => (
                          <Link
                            key={it}
                            to="/services/$category"
                            params={{ category: c.slug }}
                            search={{ service: it }}
                            className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            onClick={() => setServicesOpen(false)}
                          >
                            {it}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/catering"
                    className="block rounded-2xl px-3 py-3 transition-colors hover:bg-secondary"
                    onClick={() => setServicesOpen(false)}
                  >
                    <span className="block text-sm font-bold">06: مشاريع الاعاشة</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      سقيا ماء – وجبات جاهزة ساخنة – وجبات جافة
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOppsOpen(true)}
            onMouseLeave={() => setOppsOpen(false)}
          >
            <Link to="/community" className={`${linkClass} inline-flex items-center gap-1`}>
              فرص أوبن لوب
              <ChevronDown className="h-4 w-4" aria-hidden />
            </Link>
            {oppsOpen && (
              <div className="absolute end-0 top-full w-72 pt-2">
                <div className="rounded-3xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
                  {opportunityLinks.map((o) => (
                    <Link
                      key={o.label}
                      to={o.to}
                      {...(o.hash ? { hash: o.hash } : {})}
                      className="block rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors hover:bg-secondary"
                      onClick={() => setOppsOpen(false)}
                    >
                      {o.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {afterServices.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={linkClass}
              activeProps={{ className: "bg-primary-foreground/15 text-primary-foreground" }}
            >
              {l.label}
            </Link>
          ))}

          <ThemeToggle className="ms-2" />

          <Button
            asChild
            size="sm"
            className="ms-2 rounded-full bg-gold px-5 font-bold text-gold-foreground hover:bg-gold/90"
          >
            <Link {...(user ? { to: "/dashboard" as const } : { to: "/auth" as const, search: { redirect: undefined } })}>
              {user ? (
                <>
                  <UserRound className="h-4 w-4" aria-hidden />
                  أهلاً، {displayName}
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" aria-hidden />
                  تسجيل الدخول
                </>
              )}
            </Link>
          </Button>
        </nav>

        <div className="order-1 flex items-center gap-2 lg:hidden">
          <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
          className="order-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary-foreground/25 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        </div>
      </div>
      <NoticeBanner />

      {open && (
        <div className="border-t border-primary-foreground/15 bg-primary lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {beforeServices.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link to="/services" className={linkClass} onClick={() => setOpen(false)}>
              الخدمات
            </Link>
            <div className="mb-1 flex flex-col ps-4">
              {serviceCategories.map((c) => (
                <Link
                  key={c.slug}
                  to="/services/$category"
                  params={{ category: c.slug }}
                  className="rounded-full px-3 py-1.5 text-sm text-primary-foreground/70"
                  onClick={() => setOpen(false)}
                >
                  — {c.title}
                </Link>
              ))}
              <Link
                to="/catering"
                className="rounded-full px-3 py-1.5 text-sm text-primary-foreground/70"
                onClick={() => setOpen(false)}
              >
                — مشاريع الاعاشة
              </Link>
            </div>
            <Link to="/community" className={linkClass} onClick={() => setOpen(false)}>
              فرص أوبن لوب
            </Link>
            <div className="mb-1 flex flex-col ps-4">
              {opportunityLinks.map((o) => (
                <Link key={o.label} to={o.to} {...(o.hash ? { hash: o.hash } : {})} className="rounded-full px-3 py-1.5 text-sm text-primary-foreground/70" onClick={() => setOpen(false)}>
                  — {o.label}
                </Link>
              ))}
            </div>
            {afterServices.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Button
              asChild
              className="mt-2 rounded-full bg-gold font-bold text-gold-foreground hover:bg-gold/90"
            >
              <Link
                {...(user ? { to: "/dashboard" as const } : { to: "/auth" as const, search: { redirect: undefined } })}
                onClick={() => setOpen(false)}
              >
                {user ? (
                  <>
                    <UserRound className="h-4 w-4" aria-hidden />
                    أهلاً، {displayName}
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" aria-hidden />
                    تسجيل الدخول
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
