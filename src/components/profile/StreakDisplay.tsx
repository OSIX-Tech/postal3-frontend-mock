import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StreakDisplayProps {
  days: number;
  className?: string;
}

export function StreakDisplay({ days, className }: StreakDisplayProps) {
  const is_active = days > 0;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-3 py-1 text-sm",
        is_active
          ? "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <Flame
        className={cn("h-4 w-4", is_active ? "text-orange-500" : "opacity-50")}
      />
      <span>
        {days} {days === 1 ? "día" : "días"}
      </span>
    </Badge>
  );
}
