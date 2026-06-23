import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
}

export function KpiCard({ label, value, delta, hint }: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elegant)]">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {typeof delta === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md",
              positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {positive ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
