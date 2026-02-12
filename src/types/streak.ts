// ============================================
// STREAK STATUS
// ============================================

export type StreakStatus = "active" | "at_risk" | "lost";

// ============================================
// STREAK DETAIL
// ============================================

export interface StreakDetail {
  current_days: number;
  best_streak: number;
  status: StreakStatus;
  last_activity_date: string;
  started_at: string;
  next_milestone: StreakMilestone | null;
  milestones: StreakMilestone[];
  history: StreakHistoryEntry[];
  activity_calendar: ActivityDay[];
  recovery: StreakRecovery;
}

// ============================================
// MILESTONES
// ============================================

export interface StreakMilestone {
  days: number;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  achieved_at?: string;
}

// ============================================
// HISTORY
// ============================================

export interface StreakHistoryEntry {
  id: string;
  days: number;
  started_at: string;
  ended_at: string;
  reason: "broken" | "recovered" | "current";
}

// ============================================
// ACTIVITY CALENDAR
// ============================================

export interface ActivityDay {
  date: string;
  tests_completed: number;
  points_earned: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// ============================================
// RECOVERY
// ============================================

export interface StreakRecovery {
  can_recover: boolean;
  recovery_window_expires_at: string | null;
  recoveries_used_this_month: number;
  max_recoveries_per_month: number;
  lost_streak_days: number | null;
}
