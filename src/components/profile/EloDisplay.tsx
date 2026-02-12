import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EloDisplayProps {
  elo: number;
  className?: string;
}

export function EloDisplay({ elo, className }: EloDisplayProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-3 py-1 text-sm bg-emerald-100 border-emerald-300 text-emerald-700",
        className
      )}
    >
      <TrendingUp className="h-4 w-4" />
      <span>{elo} ELO</span>
    </Badge>
  );
}
