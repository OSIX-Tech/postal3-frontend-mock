import {
  Flame,
  Zap,
  Target,
  Trophy,
  Crown,
  Gem,
  Check,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StreakMilestone } from "@/types/streak";

interface StreakMilestonesProps {
  milestones: StreakMilestone[];
  current_days: number;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  flame: Flame,
  zap: Zap,
  target: Target,
  trophy: Trophy,
  crown: Crown,
  gem: Gem,
};

export function StreakMilestones({
  milestones,
  current_days,
  className,
}: StreakMilestonesProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {milestones.map((milestone) => {
        const Icon = ICON_MAP[milestone.icon] ?? Trophy;
        const progress = milestone.achieved
          ? 100
          : Math.min((current_days / milestone.days) * 100, 99);

        return (
          <div
            key={milestone.days}
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg border transition-colors",
              milestone.achieved
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                : "bg-card border-border"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0",
                milestone.achieved
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : "bg-muted"
              )}
            >
              {milestone.achieved ? (
                <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Icon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "font-medium text-sm",
                    milestone.achieved
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-foreground"
                  )}
                >
                  {milestone.name}
                </p>
                <span
                  className={cn(
                    "text-xs font-medium flex-shrink-0",
                    milestone.achieved
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  {milestone.days} días
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {milestone.description}
              </p>
              {!milestone.achieved && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {current_days}/{milestone.days}
                  </span>
                </div>
              )}
            </div>

            {/* Lock indicator */}
            {!milestone.achieved && progress < 50 && (
              <Lock className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
