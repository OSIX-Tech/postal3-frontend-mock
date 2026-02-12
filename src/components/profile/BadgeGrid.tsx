import { BadgeCard } from "./BadgeCard";
import type { ProfileBadge } from "@/types/profile";

interface BadgeGridProps {
  badges: ProfileBadge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aún no tienes insignias. ¡Sigue estudiando para conseguirlas!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
