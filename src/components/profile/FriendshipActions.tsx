import { UserPlus, UserCheck, Clock, ShieldBan, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FriendshipStatus } from "@/types/profile";

interface FriendshipActionsProps {
  status: FriendshipStatus;
  on_send_request: () => void;
  on_accept_request: () => void;
  on_block: () => void;
  is_loading?: boolean;
}

export function FriendshipActions({
  status,
  on_send_request,
  on_accept_request,
  on_block,
  is_loading = false,
}: FriendshipActionsProps) {
  if (status === "blocked") return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {status === "none" && (
        <Button onClick={on_send_request} disabled={is_loading} size="sm">
          {is_loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Enviar solicitud
        </Button>
      )}

      {status === "pending_sent" && (
        <Button variant="outline" size="sm" disabled>
          <Clock className="h-4 w-4" />
          Solicitud enviada
        </Button>
      )}

      {status === "pending_received" && (
        <Button onClick={on_accept_request} disabled={is_loading} size="sm">
          {is_loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
          Aceptar solicitud
        </Button>
      )}

      {status === "friends" && (
        <Button variant="outline" size="sm" disabled>
          <UserCheck className="h-4 w-4" />
          Amigos
        </Button>
      )}

      {status !== "friends" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={on_block}
          disabled={is_loading}
          className="text-destructive hover:text-destructive"
        >
          <ShieldBan className="h-4 w-4" />
          Bloquear
        </Button>
      )}
    </div>
  );
}
