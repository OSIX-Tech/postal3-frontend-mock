import { cn } from "@/lib/utils";
import { ProfileAvatar } from "./ProfileAvatar";
import { EloDisplay } from "./EloDisplay";
import { LeagueBadge } from "./LeagueBadge";
import { StreakDisplay } from "./StreakDisplay";
import type { League, Oposicion } from "@/types/profile";

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  bio?: string;
  oposicion?: Oposicion;
  elo?: number;
  league?: League;
  streak_days?: number;
  is_own_profile?: boolean;
  on_edit_avatar?: () => void;
  className?: string;
}

export function ProfileHeader({
  name,
  avatar,
  bio,
  oposicion,
  elo,
  league,
  streak_days,
  is_own_profile = false,
  on_edit_avatar,
  className,
}: ProfileHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 rounded-lg border bg-card px-8 py-12 text-center",
        className
      )}
    >
      <ProfileAvatar
        name={name}
        avatar={avatar}
        is_own_profile={is_own_profile}
        on_edit={on_edit_avatar}
      />

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold">{name}</h2>
        {oposicion && (
          <p className="text-sm text-muted-foreground">
            {oposicion.icon} {oposicion.name}
          </p>
        )}
        {bio && (
          <p className="text-sm text-muted-foreground max-w-md">{bio}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        {elo !== undefined && <EloDisplay elo={elo} />}
        {league && <LeagueBadge league={league} show_position />}
        {streak_days !== undefined && <StreakDisplay days={streak_days} />}
      </div>
    </div>
  );
}
