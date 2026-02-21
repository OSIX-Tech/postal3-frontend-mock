import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Flame,
  TrendingUp,
  Calendar,
  Trophy,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityCalendar } from "@/components/streaks/ActivityCalendar";
import { StreakMilestones } from "@/components/streaks/StreakMilestones";
import { StreakRecoveryCard } from "@/components/streaks/StreakRecoveryCard";
import { streak_service } from "@/services/streak-service";
import { cn } from "@/lib/utils";
import { MySpaceLayout } from "@/components/layout/MySpaceLayout";
import { LOCALE_MAP } from "@/i18n/config";
import type { SupportedLanguage } from "@/i18n/config";

export function StreakDetailPage() {
  const { t, i18n } = useTranslation('profile');
  const query_client = useQueryClient();

  const { data: streak, isLoading } = useQuery({
    queryKey: ["streak-detail"],
    queryFn: () => streak_service.get_streak_detail(),
  });

  const recover_mutation = useMutation({
    mutationFn: () => streak_service.recover_streak(),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["streak-detail"] });
      toast.success(t('streaks.recovery_success'));
    },
    onError: () => {
      toast.error(t('streaks.recovery_error'));
    },
  });

  if (isLoading || !streak) {
    return (
      <MySpaceLayout title={t('streaks.title')} description={t('streaks.description')}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </MySpaceLayout>
    );
  }

  const STATUS_LABELS = {
    active: t('streaks.status_active'),
    at_risk: t('streaks.status_at_risk'),
    lost: t('streaks.status_lost'),
  };

  const locale = LOCALE_MAP[i18n.language as SupportedLanguage] ?? 'es-ES';

  return (
    <MySpaceLayout title={t('streaks.title')} description={t('streaks.description')}>
      <div className="space-y-6">
        {/* Current streak hero */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Flame + number */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "relative flex items-center justify-center w-24 h-24 rounded-full",
                    streak.status === "active"
                      ? "bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20"
                      : streak.status === "at_risk"
                        ? "bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20"
                        : "bg-muted"
                  )}
                >
                  <Flame
                    className={cn(
                      "h-10 w-10",
                      streak.status === "active"
                        ? "text-orange-500"
                        : streak.status === "at_risk"
                          ? "text-amber-500 animate-pulse"
                          : "text-muted-foreground"
                    )}
                  />
                  {streak.status === "active" && streak.current_days >= 7 && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-orange-300 dark:ring-orange-700 animate-pulse" />
                  )}
                </div>
                <span className="text-4xl font-bold text-foreground mt-3">
                  {streak.current_days}
                </span>
                <span className="text-sm text-muted-foreground">
                  {streak.current_days === 1 ? t('streaks.day_one') : t('streaks.day_other')} {t('streaks.consecutive')}
                </span>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 gap-4 w-full sm:w-auto">
                <div className="text-center sm:text-left p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground mb-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-xs">{t('streaks.best_streak')}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {t('streaks.days_count', { count: streak.best_streak })}
                  </p>
                </div>

                <div className="text-center sm:text-left p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">{t('streaks.status_label')}</span>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      streak.status === "active" && "text-emerald-600 dark:text-emerald-400",
                      streak.status === "at_risk" && "text-amber-600 dark:text-amber-400",
                      streak.status === "lost" && "text-muted-foreground"
                    )}
                  >
                    {STATUS_LABELS[streak.status]}
                  </p>
                </div>

                {streak.next_milestone && (
                  <div className="col-span-2 text-center sm:text-left p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground mb-1">
                      <Trophy className="h-3.5 w-3.5" />
                      <span className="text-xs">{t('streaks.next_milestone')}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {streak.next_milestone.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('streaks.days_remaining', { remaining: streak.next_milestone.days - streak.current_days })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recovery card (if applicable) */}
        <StreakRecoveryCard
          recovery={streak.recovery}
          on_recover={async () => { await recover_mutation.mutateAsync(); }}
          is_loading={recover_mutation.isPending}
        />

        {/* Activity calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('streaks.activity_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityCalendar data={streak.activity_calendar} />
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              {t('streaks.milestones_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakMilestones
              milestones={streak.milestones}
              current_days={streak.current_days}
            />
          </CardContent>
        </Card>

        {/* Streak history */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('streaks.history_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {streak.history.map((entry) => (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    entry.reason === "current"
                      ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                      : "bg-card border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Flame
                      className={cn(
                        "h-4 w-4",
                        entry.reason === "current"
                          ? "text-orange-500"
                          : entry.reason === "recovered"
                            ? "text-amber-500"
                            : "text-muted-foreground"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {t('streaks.days_count', { count: entry.days })}
                        {entry.reason === "current" && (
                          <span className="ml-1.5 text-xs font-normal text-orange-600 dark:text-orange-400">
                            {t('streaks.current')}
                          </span>
                        )}
                        {entry.reason === "recovered" && (
                          <span className="ml-1.5 text-xs font-normal text-amber-600 dark:text-amber-400">
                            {t('streaks.recovered')}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.started_at).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                        })}
                        {" — "}
                        {entry.reason === "current"
                          ? t('streaks.today')
                          : new Date(entry.ended_at).toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short",
                            })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MySpaceLayout>
  );
}
