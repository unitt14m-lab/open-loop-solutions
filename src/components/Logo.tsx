import { Link } from "@tanstack/react-router";
import logo from "@/assets/openloop-logo.png.asset.json";

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={`flex shrink-0 items-center ${className}`} aria-label="أوبن لوب | Open Loop">
      <img
        src={logo.url}
        alt="شعار أوبن لوب Open Loop"
        width={1712}
        height={777}
        className={`h-10 w-auto sm:h-12 ${light ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}
