import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { StreakStatus } from "@/types/streak";

interface StreakWidgetProps {
  days: number;
  status?: StreakStatus;
  next_milestone_days?: number;
  className?: string;
}

const STATUS_STYLES: Record<StreakStatus, { bg: string; text: string; flame: string }> = {
  active: {
    bg: "bg-orange-100 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800",
    text: "text-orange-700 dark:text-orange-300",
    flame: "text-orange-500",
  },
  at_risk: {
    bg: "bg-amber-100 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    flame: "text-amber-500",
  },
  lost: {
    bg: "bg-muted border-border",
    text: "text-muted-foreground",
    flame: "text-muted-foreground opacity-50",
  },
};

export function StreakWidget({
  days,
  status = days > 0 ? "active" : "lost",
  className,
}: StreakWidgetProps) {
  const styles = STATUS_STYLES[status];
  return (
    <Link
      to="/myspace/streaks"
      className={cn(
        "flex items-center gap-1 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
        className
      )}
      title={`Racha: ${days} días`}
    >
      <Flame className={cn("h-4 w-4", styles.flame)} />
      <span className={cn("text-xs font-bold tabular-nums", styles.text)}>
        {days}
      </span>
    </Link>
  );
}
