import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { League, LeagueTier } from "@/types/profile";

const TIER_STYLES: Record<LeagueTier, string> = {
  bronce: "bg-amber-100 text-amber-800 border-amber-300",
  plata: "bg-slate-100 text-slate-600 border-slate-300",
  oro: "bg-yellow-100 text-yellow-700 border-yellow-400",
  platino: "bg-cyan-100 text-cyan-700 border-cyan-400",
  diamante: "bg-blue-100 text-blue-700 border-blue-400",
  maestro: "bg-purple-100 text-purple-700 border-purple-400",
};

const TIER_ICONS: Record<LeagueTier, string> = {
  bronce: "🥉",
  plata: "🥈",
  oro: "🥇",
  platino: "💎",
  diamante: "💠",
  maestro: "👑",
};

interface LeagueBadgeProps {
  league: League;
  className?: string;
  show_position?: boolean;
}

export function LeagueBadge({
  league,
  className,
  show_position = false,
}: LeagueBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 px-3 py-1 text-sm",
        TIER_STYLES[league.tier],
        className
      )}
    >
      <span>{TIER_ICONS[league.tier]}</span>
      <span>{league.name}</span>
      {show_position && league.position && (
        <span className="text-xs opacity-70">#{league.position}</span>
      )}
    </Badge>
  );
}
