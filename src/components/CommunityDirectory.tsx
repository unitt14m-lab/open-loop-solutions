import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Loader2, MessageCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { ENTITY_TYPES, FIELDS, REGIONS, fetchDirectory, openConversation } from "@/lib/community";

const selectClass =
  "h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold";

export function CommunityDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [field, setField] = useState("");
  const [type, setType] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const directory = useQuery({
    queryKey: ["community-directory"],
    queryFn: fetchDirectory,
  });

  const rows = useMemo(() => {
    const term = q.trim();
    return (directory.data ?? []).filter(
      (e) =>
        (!term || e.entity_name.includes(term) || e.representative_name.includes(term)) &&
        (!region || e.region === region) &&
        (!field || e.field === field) &&
        (!type || e.entity_type === type),
    );
  }, [directory.data, q, region, field, type]);

  const contact = async (otherUserId: string) => {
    if (!user) return;
    setBusy(otherUserId);
    try {
      const conversationId = await openConversation(user.id, otherUserId);
      navigate({ to: "/messages", search: { c: conversationId } });
    } catch {
      toast.error("تعذر بدء المحادثة، تأكد من اعتماد جهتك.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="relative md:col-span-1">
          <Search
            className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث باسم الجهة أو الممثل"
            className="pe-9"
            maxLength={80}
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          <option value="">كل أنواع الكيانات</option>
          {ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
          <option value="">كل المناطق</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={field} onChange={(e) => setField(e.target.value)} className={selectClass}>
          <option value="">كل المجالات</option>
          {FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {directory.isLoading && <p className="text-sm text-muted-foreground">جارٍ التحميل...</p>}
        {!directory.isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد جهات مطابقة للبحث.</p>
        )}
        {rows.map((e) => (
          <article key={e.id} className="card-elevated flex flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-extrabold leading-snug">{e.entity_name}</h3>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold text-gold-foreground">
                <BadgeCheck className="h-3.5 w-3.5 text-gold" aria-hidden />
                جهة معتمدة
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-primary dark:text-gold">{e.entity_type}</p>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              {e.region} — {e.field}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              ممثل الجهة: <span className="font-bold text-foreground">{e.representative_name}</span>
              {" — "}
              {e.job_title}
            </p>
            {e.user_id !== user?.id && (
              <Button
                onClick={() => contact(e.user_id)}
                disabled={busy === e.user_id}
                className="mt-5 rounded-full font-bold"
              >
                {busy === e.user_id ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <MessageCircle className="h-4 w-4" aria-hidden />
                )}
                تواصل الآن
              </Button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
