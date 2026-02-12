import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border bg-card p-5 text-center",
        className
      )}
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
