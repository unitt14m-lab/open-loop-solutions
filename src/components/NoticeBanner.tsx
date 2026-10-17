import { TOP_NOTICE } from "@/data/legal";

export function NoticeBanner() {
  return (
    <div className="bg-mist text-mist-foreground">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-bold leading-relaxed sm:px-6 sm:text-sm lg:px-8">
        {TOP_NOTICE}
      </p>
    </div>
  );
}
