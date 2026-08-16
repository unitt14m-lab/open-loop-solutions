import { useQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Expert = {
  id: string;
  full_name: string;
  specialty: string;
  avatar_url: string | null;
  years_experience: number;
  bio: string;
  is_verified: boolean;
};

function initials(name: string) {
  return name
    .replace(/^(م\.|د\.|أ\.)\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}

export function ExpertsDirectory() {
  const experts = useQuery({
    queryKey: ["experts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experts")
        .select("id,full_name,specialty,avatar_url,years_experience,bio,is_verified")
        .eq("is_published", true)
        .order("years_experience", { ascending: false });
      if (error) throw error;
      return data as Expert[];
    },
  });

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {experts.isLoading && <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>}
      {experts.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">سيتم عرض الخبراء قريباً.</p>
      )}
      {experts.data?.map((e) => (
        <article key={e.id} className="card-elevated flex gap-4 p-6">
          {e.avatar_url ? (
            <img
              src={e.avatar_url}
              alt={e.full_name}
              loading="lazy"
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-accent text-lg font-extrabold text-accent-foreground">
              {initials(e.full_name)}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 text-base font-extrabold leading-snug">
              {e.full_name}
              {e.is_verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-gold" aria-label="موثّق" />
              )}
            </h3>
            <p className="mt-1 text-sm font-bold text-primary">{e.specialty}</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              {e.years_experience} سنوات خبرة
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.bio}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
