import { useState } from "react";
import { ShieldAlert, Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { StreakRecovery } from "@/types/streak";

interface StreakRecoveryCardProps {
  recovery: StreakRecovery;
  on_recover: () => Promise<void>;
  is_loading?: boolean;
  className?: string;
}

export function StreakRecoveryCard({
  recovery,
  on_recover,
  is_loading = false,
  className,
}: StreakRecoveryCardProps) {
  const [show_confirm, set_show_confirm] = useState(false);

  if (!recovery.can_recover && !recovery.lost_streak_days) {
    return null;
  }

  const remaining_recoveries =
    recovery.max_recoveries_per_month - recovery.recoveries_used_this_month;

  const time_remaining = recovery.recovery_window_expires_at
    ? get_time_remaining(recovery.recovery_window_expires_at)
    : null;

  return (
    <>
      <div
        className={cn(
          "rounded-xl border-2 p-6",
          recovery.can_recover
            ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20"
            : "border-border bg-muted/50",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0",
              recovery.can_recover
                ? "bg-amber-100 dark:bg-amber-900/30"
                : "bg-muted"
            )}
          >
            <ShieldAlert
              className={cn(
                "h-6 w-6",
                recovery.can_recover
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </div>

          <div className="flex-1">
            {recovery.can_recover ? (
              <>
                <h3 className="font-semibold text-foreground mb-1">
                  Perdiste tu racha de {recovery.lost_streak_days} días
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Puedes recuperarla hoy. Tienes{" "}
                  <span className="font-medium text-foreground">
                    {remaining_recoveries}
                  </span>{" "}
                  recuperación{remaining_recoveries !== 1 ? "es" : ""} disponible
                  {remaining_recoveries !== 1 ? "s" : ""} este mes.
                </p>
                {time_remaining && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Ventana de recuperación: {time_remaining}
                  </p>
                )}
                <Button
                  onClick={() => set_show_confirm(true)}
                  disabled={is_loading}
                  className="mt-3 gap-1.5"
                  size="sm"
                >
                  <Flame className="h-4 w-4" />
                  Recuperar racha
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-foreground mb-1">
                  Racha perdida
                </h3>
                <p className="text-sm text-muted-foreground">
                  {remaining_recoveries <= 0
                    ? "Ya has usado tu recuperación gratuita este mes. Empieza una nueva racha hoy."
                    : "La ventana de recuperación ha expirado. Empieza una nueva racha hoy."}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={show_confirm} onOpenChange={set_show_confirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              Recuperar racha
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vas a usar 1 de tus {recovery.max_recoveries_per_month}{" "}
              recuperaciones mensuales para restaurar tu racha de{" "}
              {recovery.lost_streak_days} días. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                set_show_confirm(false);
                await on_recover();
              }}
              disabled={is_loading}
            >
              {is_loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirmar recuperación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function get_time_remaining(expires_at: string): string {
  const now = new Date();
  const expires = new Date(expires_at);
  const diff_ms = expires.getTime() - now.getTime();

  if (diff_ms <= 0) return "Expirada";

  const hours = Math.floor(diff_ms / (1000 * 60 * 60));
  const minutes = Math.floor((diff_ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m restantes`;
  return `${minutes}m restantes`;
}
