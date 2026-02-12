import { ShieldOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BlockedUser } from "@/types/profile";

interface BlockedUsersListProps {
  blocked_users: BlockedUser[];
  on_unblock: (user_id: string) => Promise<void>;
  is_loading?: boolean;
}

function get_initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function BlockedUsersList({
  blocked_users,
  on_unblock,
  is_loading = false,
}: BlockedUsersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Usuarios bloqueados</CardTitle>
      </CardHeader>
      <CardContent>
        {blocked_users.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tienes usuarios bloqueados.
          </p>
        ) : (
          <ul className="space-y-3">
            {blocked_users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {get_initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Bloqueado el{" "}
                      {new Date(user.blocked_at).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => on_unblock(user.id)}
                  disabled={is_loading}
                >
                  {is_loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldOff className="h-4 w-4" />
                  )}
                  Desbloquear
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
