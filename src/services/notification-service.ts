import { api_client } from "@/lib/api-client";
import { env } from "@/config/env";
import type {
  AppNotification,
  NotificationListResponse,
  NotificationSettings,
} from "@/types/notification";

// ============================================
// MOCK DATA
// ============================================

const mock_notifications: AppNotification[] = [
  {
    id: "n-1",
    type: "streak",
    title: "Racha de fuego",
    body: "Llevas 12 días consecutivos. ¡Sigue así!",
    read: false,
    created_at: "2026-02-12T08:00:00Z",
    icon: "flame",
  },
  {
    id: "n-2",
    type: "coach",
    title: "Tu coach dice...",
    body: "Has mejorado un 15% en Derecho Administrativo esta semana. Prueba a repasar Procedimiento Común.",
    read: false,
    created_at: "2026-02-11T20:00:00Z",
    icon: "bot",
    action_url: "/tests",
  },
  {
    id: "n-3",
    type: "badge",
    title: "Nueva insignia",
    body: "Has desbloqueado \"Semana completa\" por mantener tu racha 7 días.",
    read: false,
    created_at: "2026-02-11T10:00:00Z",
    icon: "award",
  },
  {
    id: "n-4",
    type: "challenge",
    title: "Reto recibido",
    body: "Laura Martínez te ha retado a un duelo de Constitución.",
    read: true,
    created_at: "2026-02-10T18:30:00Z",
    icon: "swords",
    action_url: "/myspace/challenges",
  },
  {
    id: "n-5",
    type: "social",
    title: "Solicitud de amistad",
    body: "Ana López quiere ser tu amiga.",
    read: true,
    created_at: "2026-02-10T14:00:00Z",
    icon: "user-plus",
  },
  {
    id: "n-6",
    type: "league",
    title: "Ascenso de liga",
    body: "Has subido a la Liga Plata. ¡Enhorabuena!",
    read: true,
    created_at: "2026-02-09T22:00:00Z",
    icon: "trophy",
  },
  {
    id: "n-7",
    type: "streak",
    title: "Racha en peligro",
    body: "Hoy aún no has hecho ningún test. ¡No pierdas tu racha de 10 días!",
    read: true,
    created_at: "2026-02-08T20:00:00Z",
    icon: "alert-triangle",
  },
  {
    id: "n-8",
    type: "system",
    title: "Mantenimiento programado",
    body: "El sistema estará en mantenimiento el sábado de 03:00 a 05:00.",
    read: true,
    created_at: "2026-02-07T12:00:00Z",
    icon: "info",
  },
];

const mock_settings: NotificationSettings = {
  push_enabled: true,
  email_enabled: true,
  dnd_start: "23:00",
  dnd_end: "07:00",
  reminder_frequency: "daily",
};

// ============================================
// DELAY HELPER
// ============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// MOCK SERVICE
// ============================================

const mock_notification_service = {
  async list_notifications(): Promise<NotificationListResponse> {
    await delay(300);
    return {
      notifications: [...mock_notifications],
      unread_count: mock_notifications.filter((n) => !n.read).length,
      total: mock_notifications.length,
    };
  },

  async mark_as_read(notification_id: string): Promise<void> {
    await delay(200);
    const notif = mock_notifications.find((n) => n.id === notification_id);
    if (notif) notif.read = true;
  },

  async mark_all_as_read(): Promise<void> {
    await delay(200);
    mock_notifications.forEach((n) => (n.read = true));
  },

  async get_settings(): Promise<NotificationSettings> {
    await delay(300);
    return { ...mock_settings };
  },

  async update_settings(
    data: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    await delay(300);
    Object.assign(mock_settings, data);
    return { ...mock_settings };
  },
};

// ============================================
// REAL SERVICE
// ============================================

const real_notification_service = {
  async list_notifications(): Promise<NotificationListResponse> {
    const response = await api_client.get<NotificationListResponse>(
      "/notifications"
    );
    return response.data;
  },

  async mark_as_read(notification_id: string): Promise<void> {
    await api_client.patch(`/notifications/${notification_id}/read`);
  },

  async mark_all_as_read(): Promise<void> {
    await api_client.patch("/notifications/read-all");
  },

  async get_settings(): Promise<NotificationSettings> {
    const response = await api_client.get<NotificationSettings>(
      "/notifications/settings"
    );
    return response.data;
  },

  async update_settings(
    data: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    const response = await api_client.patch<NotificationSettings>(
      "/notifications/settings",
      data
    );
    return response.data;
  },
};

// ============================================
// EXPORT
// ============================================

export const notification_service = env.IS_DEV
  ? mock_notification_service
  : real_notification_service;
