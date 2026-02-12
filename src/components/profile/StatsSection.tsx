import {
  CheckCircle,
  Clock,
  Target,
  Trophy,
  BookOpen,
  Flame,
  Star,
  Coins,
} from "lucide-react";
import { StatCard } from "./StatCard";
import type { UserStats } from "@/types/profile";

interface StatsSectionProps {
  stats: UserStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    {
      icon: BookOpen,
      label: "Tests completados",
      value: stats.tests_completed,
    },
    {
      icon: CheckCircle,
      label: "Tests aprobados",
      value: stats.tests_passed,
    },
    {
      icon: Target,
      label: "Precisión",
      value: `${stats.accuracy_percentage}%`,
    },
    {
      icon: Clock,
      label: "Horas de estudio",
      value: stats.study_hours,
    },
    {
      icon: Flame,
      label: "Mejor racha",
      value: `${stats.best_streak} días`,
    },
    {
      icon: Trophy,
      label: "Posición ranking",
      value: `#${stats.current_position}`,
    },
    {
      icon: Star,
      label: "Puntos totales",
      value: stats.total_points.toLocaleString("es-ES"),
    },
    {
      icon: Coins,
      label: "Monedas",
      value: stats.coins,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <StatCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
        />
      ))}
    </div>
  );
}
