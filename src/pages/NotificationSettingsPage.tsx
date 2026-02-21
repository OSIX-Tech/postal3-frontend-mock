import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Bell,
  Mail,
  Moon,
  Clock,
  Loader2,
  Flame,
  Bot,
  Swords,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notification_service } from "@/services/notification-service";
import { MySpaceLayout } from "@/components/layout/MySpaceLayout";
import type { NotificationSettings, ReminderFrequency } from "@/types/notification";

export function NotificationSettingsPage() {
  const { t } = useTranslation('profile');
  const query_client = useQueryClient();

  const FREQUENCY_LABELS: Record<ReminderFrequency, string> = {
    daily: t('notification_settings.frequency_daily'),
    every_other_day: t('notification_settings.frequency_every_other_day'),
    weekly: t('notification_settings.frequency_weekly'),
    never: t('notification_settings.frequency_never'),
  };

  const NOTIFICATION_TYPES = [
    { icon: Flame, label: t('notification_settings.type_streaks'), description: t('notification_settings.type_streaks_desc') },
    { icon: Bot, label: t('notification_settings.type_coach'), description: t('notification_settings.type_coach_desc') },
    { icon: Swords, label: t('notification_settings.type_challenges'), description: t('notification_settings.type_challenges_desc') },
    { icon: Users, label: t('notification_settings.type_social'), description: t('notification_settings.type_social_desc') },
  ];

  const { data: settings, isLoading } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => notification_service.get_settings(),
  });

  const update_mutation = useMutation({
    mutationFn: (data: Partial<NotificationSettings>) =>
      notification_service.update_settings(data),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success(t('notification_settings.toast_saved'));
    },
    onError: () => {
      toast.error(t('notification_settings.toast_error'));
    },
  });

  const handle_change = (key: keyof NotificationSettings, value: unknown) => {
    update_mutation.mutate({ [key]: value });
  };

  if (isLoading || !settings) {
    return (
      <MySpaceLayout
        title={t('notification_settings.title')}
        description={t('notification_settings.description')}
      >
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      </MySpaceLayout>
    );
  }

  return (
    <MySpaceLayout
      title={t('notification_settings.title')}
      description={t('notification_settings.description')}
    >
      <div className="space-y-6">
        {/* Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('notification_settings.channels_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="push" className="cursor-pointer">
                    {t('notification_settings.push_label')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('notification_settings.push_description')}
                  </p>
                </div>
              </div>
              <Switch
                id="push"
                checked={settings.push_enabled}
                onCheckedChange={(checked) =>
                  handle_change("push_enabled", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="email" className="cursor-pointer">
                    {t('notification_settings.email_label')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('notification_settings.email_description')}
                  </p>
                </div>
              </div>
              <Switch
                id="email"
                checked={settings.email_enabled}
                onCheckedChange={(checked) =>
                  handle_change("email_enabled", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Do not disturb */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4" />
              {t('notification_settings.dnd_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('notification_settings.dnd_description')}
            </p>
            <div className="flex items-center gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dnd-start" className="text-xs">
                  {t('notification_settings.dnd_from')}
                </Label>
                <Input
                  id="dnd-start"
                  type="time"
                  value={settings.dnd_start}
                  onChange={(e) => handle_change("dnd_start", e.target.value)}
                  className="w-32"
                />
              </div>
              <span className="text-muted-foreground mt-5">—</span>
              <div className="space-y-1.5">
                <Label htmlFor="dnd-end" className="text-xs">
                  {t('notification_settings.dnd_to')}
                </Label>
                <Input
                  id="dnd-end"
                  type="time"
                  value={settings.dnd_end}
                  onChange={(e) => handle_change("dnd_end", e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reminder frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('notification_settings.reminder_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('notification_settings.reminder_description')}
            </p>
            <Select
              value={settings.reminder_frequency}
              onValueChange={(value) =>
                handle_change("reminder_frequency", value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQUENCY_LABELS) as ReminderFrequency[]).map(
                  (key) => (
                    <SelectItem key={key} value={key}>
                      {FREQUENCY_LABELS[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Preview of notification types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('notification_settings.types_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {NOTIFICATION_TYPES.map((type) => (
                <div
                  key={type.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <type.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {type.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
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
