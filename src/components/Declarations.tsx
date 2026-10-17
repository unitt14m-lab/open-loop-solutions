import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DECLARATIONS, type DeclarationSet } from "@/data/legal";

/** Mandatory declaration checkboxes; reports true only when every box is ticked. */
export function Declarations({
  sets,
  onChange,
  error,
  resetKey,
}: {
  sets: DeclarationSet[];
  onChange: (allChecked: boolean) => void;
  error?: string | undefined;
  resetKey?: number;
}) {
  const items = sets.flatMap((s) => DECLARATIONS[s] as readonly string[]);
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    setChecked(items.map(() => false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return (
    <div className="space-y-2 md:col-span-2">
      {items.map((text, i) => (
        <label
          key={text}
          className="flex cursor-pointer items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm font-bold leading-relaxed"
        >
          <Checkbox
            checked={checked[i] ?? false}
            onCheckedChange={(v) => {
              const next = [...checked];
              next[i] = v === true;
              setChecked(next);
              onChange(next.length === items.length && next.every(Boolean));
            }}
            className="mt-1"
          />
          <span>{text}</span>
        </label>
      ))}
      {error && <p className="text-xs font-bold text-destructive">{error}</p>}
    </div>
  );
}
