import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const FREQUENCY_LABELS: Record<ReminderFrequency, string> = {
  daily: "Diario",
  every_other_day: "Cada 2 días",
  weekly: "Semanal",
  never: "Nunca",
};

const NOTIFICATION_TYPES = [
  { icon: Flame, label: "Rachas", description: "Alertas de racha en peligro y hitos alcanzados" },
  { icon: Bot, label: "Coach", description: "Mensajes del coach con recomendaciones" },
  { icon: Swords, label: "Retos", description: "Retos recibidos y resultados" },
  { icon: Users, label: "Social", description: "Solicitudes de amistad y actividad" },
];

export function NotificationSettingsPage() {
  const query_client = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => notification_service.get_settings(),
  });

  const update_mutation = useMutation({
    mutationFn: (data: Partial<NotificationSettings>) =>
      notification_service.update_settings(data),
    onSuccess: () => {
      query_client.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Ajustes guardados");
    },
    onError: () => {
      toast.error("Error al guardar los ajustes");
    },
  });

  const handle_change = (key: keyof NotificationSettings, value: unknown) => {
    update_mutation.mutate({ [key]: value });
  };

  if (isLoading || !settings) {
    return (
      <MySpaceLayout
        title="Ajustes de avisos"
        description="Configura cómo y cuándo recibir notificaciones"
      >
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      </MySpaceLayout>
    );
  }

  return (
    <MySpaceLayout
      title="Ajustes de avisos"
      description="Configura cómo y cuándo recibir notificaciones"
    >
      <div className="space-y-6">
        {/* Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Canales de notificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="push" className="cursor-pointer">
                    Notificaciones push
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Alertas en el navegador
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
                    Notificaciones por email
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Resumen diario por correo
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
              No molestar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              No recibirás notificaciones push durante este horario.
            </p>
            <div className="flex items-center gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dnd-start" className="text-xs">
                  Desde
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
                  Hasta
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
              Frecuencia de recordatorios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Con qué frecuencia te recordamos estudiar si no has hecho un test.
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
            <CardTitle className="text-base">Tipos de notificaciones</CardTitle>
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
