import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Bot,
  Award,
  Swords,
  UserPlus,
  Trophy,
  AlertTriangle,
  Info,
  CheckCheck,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notification_service } from "@/services/notification-service";
import { cn } from "@/lib/utils";
import { MySpaceLayout } from "@/components/layout/MySpaceLayout";
import type { AppNotification } from "@/types/notification";

const ICON_MAP: Record<string, LucideIcon> = {
  flame: Flame,
  bot: Bot,
  award: Award,
  swords: Swords,
  "user-plus": UserPlus,
  trophy: Trophy,
  "alert-triangle": AlertTriangle,
  info: Info,
};

const TYPE_COLORS: Record<AppNotification["type"], string> = {
  streak: "bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400",
  coach: "bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400",
  badge: "bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  challenge: "bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400",
  social: "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
  league: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  system: "bg-muted text-muted-foreground",
};

function format_relative_time(date_str: string): string {
  const now = new Date();
  const date = new Date(date_str);
  const diff_ms = now.getTime() - date.getTime();
  const diff_minutes = Math.floor(diff_ms / (1000 * 60));
  const diff_hours = Math.floor(diff_minutes / 60);
  const diff_days = Math.floor(diff_hours / 24);

  if (diff_minutes < 1) return "Ahora";
  if (diff_minutes < 60) return `Hace ${diff_minutes}m`;
  if (diff_hours < 24) return `Hace ${diff_hours}h`;
  if (diff_days < 7) return `Hace ${diff_days}d`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export function AlertsPage() {
  const query_client = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notification_service.list_notifications(),
  });

  const mark_read_mutation = useMutation({
    mutationFn: (id: string) => notification_service.mark_as_read(id),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const mark_all_mutation = useMutation({
    mutationFn: () => notification_service.mark_all_as_read(),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handle_click = (notification: AppNotification) => {
    if (!notification.read) {
      mark_read_mutation.mutate(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  return (
    <MySpaceLayout title="Alertas" description="Tus notificaciones recientes">
      <div className="space-y-4">
        {/* Header actions */}
        {data && data.unread_count > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.unread_count} sin leer
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => mark_all_mutation.mutate()}
              disabled={mark_all_mutation.isPending}
              className="gap-1.5"
            >
              <CheckCheck className="h-4 w-4" />
              Marcar todo como leído
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        )}

        {/* Empty state */}
        {data && data.notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              No tienes notificaciones
            </p>
          </div>
        )}

        {/* Notification list */}
        {data && data.notifications.length > 0 && (
          <div className="space-y-2">
            {data.notifications.map((notification) => {
              const Icon = ICON_MAP[notification.icon ?? "info"] ?? Info;
              const colors = TYPE_COLORS[notification.type];

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-muted/50",
                    !notification.read && "border-l-2 border-l-violet-500"
                  )}
                  onClick={() => handle_click(notification)}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0",
                        colors
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm",
                            !notification.read
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground"
                          )}
                        >
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {format_relative_time(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.body}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MySpaceLayout>
  );
}
