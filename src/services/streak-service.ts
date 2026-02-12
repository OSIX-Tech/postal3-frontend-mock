import type {
  StreakDetail,
  ActivityDay,
  StreakMilestone,
  StreakHistoryEntry,
  StreakRecovery,
} from "@/types/streak";

// ============================================
// MOCK DATA HELPERS
// ============================================

function generate_activity_calendar(): ActivityDay[] {
  const days: ActivityDay[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const is_weekend = date.getDay() === 0 || date.getDay() === 6;
    const random = Math.random();

    let tests = 0;
    let level: ActivityDay["level"] = 0;

    if (i < 12) {
      // Last 12 days = current streak
      tests = 1 + Math.floor(Math.random() * 4);
      level = tests >= 4 ? 4 : tests >= 3 ? 3 : tests >= 2 ? 2 : 1;
    } else if (random > (is_weekend ? 0.6 : 0.35)) {
      tests = 1 + Math.floor(Math.random() * 5);
      level = tests >= 4 ? 4 : tests >= 3 ? 3 : tests >= 2 ? 2 : 1;
    }

    days.push({
      date: date.toISOString().split("T")[0],
      tests_completed: tests,
      points_earned: tests * 120,
      level,
    });
  }

  return days;
}

const MOCK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    name: "Primeros pasos",
    description: "3 días consecutivos estudiando",
    icon: "flame",
    achieved: true,
    achieved_at: "2025-12-20T10:00:00Z",
  },
  {
    days: 7,
    name: "Semana completa",
    description: "Una semana completa sin fallar",
    icon: "zap",
    achieved: true,
    achieved_at: "2025-12-24T10:00:00Z",
  },
  {
    days: 14,
    name: "Constancia",
    description: "Dos semanas de disciplina",
    icon: "target",
    achieved: false,
  },
  {
    days: 30,
    name: "Imparable",
    description: "Un mes completo estudiando",
    icon: "trophy",
    achieved: false,
  },
  {
    days: 60,
    name: "Maestra del hábito",
    description: "60 días ininterrumpidos",
    icon: "crown",
    achieved: false,
  },
  {
    days: 100,
    name: "Leyenda",
    description: "100 días sin descanso",
    icon: "gem",
    achieved: false,
  },
];

const MOCK_HISTORY: StreakHistoryEntry[] = [
  {
    id: "h-1",
    days: 5,
    started_at: "2025-09-01T00:00:00Z",
    ended_at: "2025-09-05T00:00:00Z",
    reason: "broken",
  },
  {
    id: "h-2",
    days: 18,
    started_at: "2025-10-10T00:00:00Z",
    ended_at: "2025-10-27T00:00:00Z",
    reason: "broken",
  },
  {
    id: "h-3",
    days: 8,
    started_at: "2025-11-05T00:00:00Z",
    ended_at: "2025-11-12T00:00:00Z",
    reason: "recovered",
  },
  {
    id: "h-current",
    days: 12,
    started_at: "2026-02-01T00:00:00Z",
    ended_at: new Date().toISOString(),
    reason: "current",
  },
];

const MOCK_RECOVERY: StreakRecovery = {
  can_recover: false,
  recovery_window_expires_at: null,
  recoveries_used_this_month: 0,
  max_recoveries_per_month: 1,
  lost_streak_days: null,
};

// ============================================
// DELAY HELPER
// ============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// MOCK SERVICE
// ============================================

const mock_streak_service = {
  async get_streak_detail(): Promise<StreakDetail> {
    await delay(400);
    return {
      current_days: 12,
      best_streak: 18,
      status: "active",
      last_activity_date: new Date().toISOString().split("T")[0],
      started_at: "2026-02-01T00:00:00Z",
      next_milestone: MOCK_MILESTONES.find((m) => !m.achieved) ?? null,
      milestones: MOCK_MILESTONES,
      history: MOCK_HISTORY,
      activity_calendar: generate_activity_calendar(),
      recovery: MOCK_RECOVERY,
    };
  },

  async recover_streak(): Promise<StreakDetail> {
    await delay(500);
    return this.get_streak_detail();
  },
};

// ============================================
// EXPORT
// ============================================

export const streak_service = mock_streak_service;
