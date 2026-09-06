import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

/**
 * Renders children only for signed-in users; otherwise shows a sign-in prompt.
 */
export function AuthGate({
  children,
  message = "يجب تسجيل الدخول أولاً لإرسال الطلب.",
  variant = "default",
}: {
  children: ReactNode;
  message?: string;
  variant?: "default" | "glass";
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className={`text-sm ${variant === "glass" ? "text-[#E2E8F0]/70" : "text-muted-foreground"}`}>جارٍ التحقق من الحساب...</p>;
  }

  if (!user) {
    if (variant === "glass") {
      return (
        <div className="glass-panel border-dashed p-8 text-center">
          <LogIn className="mx-auto h-6 w-6 text-gold" aria-hidden />
          <p className="mt-3 text-sm font-bold text-white">{message}</p>
          <Button asChild className="glow-gold mt-4 rounded-full bg-gold font-bold text-gold-foreground hover:bg-gold/90">
            <Link to="/auth" search={{ redirect: undefined }}>تسجيل الدخول / إنشاء حساب</Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-dashed border-primary/40 bg-secondary/60 p-6 text-center">
        <LogIn className="mx-auto h-6 w-6 text-primary dark:text-gold" aria-hidden />
        <p className="mt-3 text-sm font-bold">{message}</p>
        <Button asChild className="mt-4 rounded-full font-bold">
          <Link to="/auth" search={{ redirect: undefined }}>تسجيل الدخول / إنشاء حساب</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
