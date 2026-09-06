import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { ENTITY_TYPES, FIELDS, REGIONS, fetchDirectory } from "@/lib/community";

const selectClass =
  "h-11 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 px-3 text-sm font-semibold";

export function CommunityDirectory() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [field, setField] = useState("");
  const [type, setType] = useState("");

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

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث باسم الجهة أو الممثل"
          maxLength={80}
        />
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
        {directory.isLoading && <p className="text-sm text-slate-500">جارٍ التحميل...</p>}
        {!directory.isLoading && rows.length === 0 && (
          <p className="text-sm text-slate-500">لا توجد جهات مطابقة للبحث.</p>
        )}
        {rows.map((e) => (
          <article key={e.id} className="rounded-2xl border border-slate-200 bg-white flex flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-extrabold leading-snug">{e.entity_name}</h3>
              <span className="inline-flex shrink-0 items-center rounded-full border border-slate-300 px-3 py-1 text-[11px] font-bold text-slate-600">
                جهة معتمدة
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-primary dark:text-gold">{e.entity_type}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              {e.region} — {e.field}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              ممثل الجهة: <span className="font-bold text-foreground">{e.representative_name}</span>
              {" — "}
              {e.job_title}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
