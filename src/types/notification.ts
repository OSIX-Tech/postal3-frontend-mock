// ============================================
// NOTIFICATION
// ============================================

export type NotificationType =
  | "streak"
  | "coach"
  | "challenge"
  | "social"
  | "badge"
  | "league"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  icon?: string;
}

// ============================================
// NOTIFICATION SETTINGS
// ============================================

export interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  dnd_start: string;
  dnd_end: string;
  reminder_frequency: ReminderFrequency;
}

export type ReminderFrequency = "daily" | "every_other_day" | "weekly" | "never";

// ============================================
// RESPONSES
// ============================================

export interface NotificationListResponse {
  notifications: AppNotification[];
  unread_count: number;
  total: number;
}
