import { useParams } from "react-router-dom";
import {
  ProfileHeader,
  BadgeGrid,
  StatsSection,
  FriendshipActions,
} from "@/components/profile";
import { use_user_profile } from "@/hooks/use-profile";
import { LoadingState, ErrorState } from "@/components/feedback";
import { Lock } from "lucide-react";

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const {
    profile,
    is_loading,
    is_error,
    send_friend_request,
    send_friend_request_pending,
    accept_friend_request,
    accept_friend_request_pending,
    block_user,
    block_user_pending,
  } = use_user_profile(id ?? "");

  if (is_loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <LoadingState text="Cargando perfil..." />
      </div>
    );
  }

  if (is_error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <ErrorState
          description="No se pudo cargar el perfil del usuario"
          on_retry={() => window.location.reload()}
        />
      </div>
    );
  }

  const is_friend = profile.friendship_status === "friends";
  const can_see_badges = profile.show_badges_publicly || is_friend;
  const can_see_stats = is_friend;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-6">
        {/* Siempre visible: avatar, nombre, oposicion, bio */}
        {/* Solo si amigos: ELO, liga, racha */}
        <ProfileHeader
          name={profile.name}
          avatar={profile.avatar}
          bio={profile.bio}
          oposicion={profile.active_oposicion}
          elo={is_friend ? profile.elo : undefined}
          league={is_friend ? profile.league : undefined}
          streak_days={is_friend ? profile.streak_days : undefined}
        />

        <FriendshipActions
          status={profile.friendship_status}
          on_send_request={send_friend_request}
          on_accept_request={accept_friend_request}
          on_block={block_user}
          is_loading={
            send_friend_request_pending ||
            accept_friend_request_pending ||
            block_user_pending
          }
        />

        {/* Badges: si show_badges_publicly O si amigos */}
        {can_see_badges && profile.badges && profile.badges.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              Insignias ({profile.badges.length})
            </h3>
            <BadgeGrid badges={profile.badges} />
          </div>
        )}

        {/* Stats: solo si amigos */}
        {can_see_stats && profile.stats && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Estadísticas</h3>
            <StatsSection stats={profile.stats} />
          </div>
        )}

        {/* Si no puede ver nada */}
        {!can_see_badges && !can_see_stats && (
          <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-8 text-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              Este perfil es privado. Envía una solicitud de amistad para ver su
              contenido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
