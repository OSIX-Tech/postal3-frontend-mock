import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ActivityDay } from "@/types/streak";

interface ActivityCalendarProps {
  data: ActivityDay[];
  className?: string;
}

const LEVEL_COLORS: Record<ActivityDay["level"], string> = {
  0: "bg-muted",
  1: "bg-emerald-200 dark:bg-emerald-900/40",
  2: "bg-emerald-400 dark:bg-emerald-700/60",
  3: "bg-emerald-500 dark:bg-emerald-600",
  4: "bg-emerald-700 dark:bg-emerald-500",
};

const DAY_LABELS = ["", "L", "", "X", "", "V", ""];
const MONTH_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function format_date_es(date_str: string): string {
  const date = new Date(date_str + "T00:00:00");
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ActivityCalendar({ data, className }: ActivityCalendarProps) {
  const { weeks, month_positions } = useMemo(() => {
    const result_weeks: (ActivityDay | null)[][] = [];
    let current_week: (ActivityDay | null)[] = [];

    if (data.length === 0) return { weeks: [], month_positions: [] };

    // Pad the first week with nulls
    const first_date = new Date(data[0].date + "T00:00:00");
    const first_day_of_week = (first_date.getDay() + 6) % 7; // Monday = 0
    for (let i = 0; i < first_day_of_week; i++) {
      current_week.push(null);
    }

    // Track month positions
    const positions: { label: string; col: number }[] = [];
    let last_month = -1;

    for (const day of data) {
      const date = new Date(day.date + "T00:00:00");
      const month = date.getMonth();
      const week_index = result_weeks.length;

      if (month !== last_month) {
        positions.push({
          label: MONTH_LABELS[month],
          col: current_week.length === 7 ? week_index + 1 : week_index,
        });
        last_month = month;
      }

      current_week.push(day);

      if (current_week.length === 7) {
        result_weeks.push(current_week);
        current_week = [];
      }
    }

    if (current_week.length > 0) {
      while (current_week.length < 7) current_week.push(null);
      result_weeks.push(current_week);
    }

    return { weeks: result_weeks, month_positions: positions };
  }, [data]);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <TooltipProvider delayDuration={100}>
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {month_positions.map((mp, i) => (
            <span
              key={i}
              className="text-[10px] text-muted-foreground"
              style={{
                position: "relative",
                left: `${mp.col * 14}px`,
                marginRight: i < month_positions.length - 1
                  ? `${((month_positions[i + 1]?.col ?? mp.col) - mp.col) * 14 - 24}px`
                  : undefined,
              }}
            >
              {mp.label}
            </span>
          ))}
        </div>

        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1">
            {DAY_LABELS.map((label, i) => (
              <span
                key={i}
                className="w-6 h-[12px] text-[10px] text-muted-foreground leading-[12px]"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => {
                if (!day) {
                  return <div key={di} className="w-[12px] h-[12px]" />;
                }

                return (
                  <Tooltip key={di}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "w-[12px] h-[12px] rounded-[2px] transition-colors",
                          LEVEL_COLORS[day.level]
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs px-3 py-2">
                      <p className="font-medium">{format_date_es(day.date)}</p>
                      {day.tests_completed > 0 ? (
                        <p className="text-muted-foreground">
                          {day.tests_completed} test{day.tests_completed > 1 ? "s" : ""} &middot; {day.points_earned} pts
                        </p>
                      ) : (
                        <p className="text-muted-foreground">Sin actividad</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted-foreground">
          <span>Menos</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <div
              key={level}
              className={cn("w-[12px] h-[12px] rounded-[2px]", LEVEL_COLORS[level])}
            />
          ))}
          <span>Más</span>
        </div>
      </TooltipProvider>
    </div>
  );
}
