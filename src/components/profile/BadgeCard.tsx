import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Trophy,
  Flame,
  Target,
  Zap,
  BookOpen,
  Swords,
  Shield,
  Award,
  Star,
  Crown,
  Medal,
  GraduationCap,
  Heart,
  Gem,
  type LucideIcon,
} from "lucide-react";
import type { ProfileBadge, BadgeRarity } from "@/types/profile";

const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  flame: Flame,
  target: Target,
  zap: Zap,
  "book-open": BookOpen,
  swords: Swords,
  shield: Shield,
  award: Award,
  star: Star,
  crown: Crown,
  medal: Medal,
  "graduation-cap": GraduationCap,
  heart: Heart,
  gem: Gem,
};

const RARITY_STYLES: Record<
  BadgeRarity,
  {
    ring: string;
    inner: string;
    ribbon: string;
    glow: string;
    icon: string;
    label: string;
  }
> = {
  comun: {
    ring: "from-slate-300 via-slate-200 to-slate-300",
    inner: "from-white to-slate-50 dark:from-slate-800 dark:to-slate-900",
    ribbon: "from-slate-300 to-slate-400",
    glow: "",
    icon: "text-slate-500",
    label: "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
  },
  raro: {
    ring: "from-blue-400 via-sky-300 to-blue-400",
    inner: "from-white to-blue-50 dark:from-blue-950 dark:to-blue-900",
    ribbon: "from-blue-400 to-blue-600",
    glow: "shadow-md shadow-blue-200/40 dark:shadow-blue-900/40",
    icon: "text-blue-500",
    label: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
  },
  epico: {
    ring: "from-purple-500 via-violet-400 to-purple-500",
    inner: "from-white to-purple-50 dark:from-purple-950 dark:to-purple-900",
    ribbon: "from-purple-400 to-purple-600",
    glow: "shadow-md shadow-purple-200/40 dark:shadow-purple-900/40",
    icon: "text-purple-500",
    label: "text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400",
  },
  legendario: {
    ring: "from-yellow-400 via-amber-200 to-yellow-400",
    inner: "from-white to-amber-50 dark:from-amber-950 dark:to-amber-900",
    ribbon: "from-amber-400 to-amber-600",
    glow: "shadow-lg shadow-amber-200/50 dark:shadow-amber-900/50",
    icon: "text-amber-500",
    label: "text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400",
  },
};

const RARITY_LABELS: Record<BadgeRarity, string> = {
  comun: "Común",
  raro: "Raro",
  epico: "Épico",
  legendario: "Legendario",
};

interface BadgeCardProps {
  badge: ProfileBadge;
  className?: string;
}

export function BadgeCard({ badge, className }: BadgeCardProps) {
  const styles = RARITY_STYLES[badge.rarity];
  const is_legendary = badge.rarity === "legendario";
  const Icon = ICON_MAP[badge.icon] ?? Award;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "group flex flex-col items-center gap-1.5 py-6 px-3 rounded-xl cursor-default",
              "transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-muted/50",
              className
            )}
          >
            {/* Medal + Ribbon assembly */}
            <div className="relative mb-1">
              {/* Ribbon tails behind medal */}
              <div
                className={cn(
                  "absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-7 bg-gradient-to-b opacity-90",
                  styles.ribbon
                )}
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%)",
                }}
              />

              {/* Medal */}
              <div className={cn("relative rounded-full", styles.glow)}>
                {/* Outer gradient ring */}
                <div
                  className={cn(
                    "p-[3px] rounded-full bg-gradient-to-br",
                    styles.ring
                  )}
                >
                  {/* Inner circle */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br shadow-inner",
                      styles.inner
                    )}
                  >
                    <Icon
                      className={cn("h-7 w-7 stroke-[1.75]", styles.icon)}
                    />
                  </div>
                </div>

                {/* Legendary shimmer overlay */}
                {is_legendary && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <span className="text-sm font-semibold text-center leading-tight mt-2">
              {badge.name}
            </span>

            {/* Rarity label */}
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5",
                styles.label
              )}
            >
              {RARITY_LABELS[badge.rarity]}
            </span>
          </div>
        </TooltipTrigger>

        <TooltipContent side="bottom" sideOffset={6} className="max-w-56 px-4 py-3">
          <div className="text-center space-y-1.5">
            <p className="font-bold text-sm">{badge.name}</p>
            <p className="text-xs opacity-80 leading-relaxed">
              {badge.description}
            </p>
            <p className="text-[11px] opacity-50">
              Obtenida el{" "}
              {new Date(badge.earned_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
