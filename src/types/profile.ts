// ============================================
// OPOSICION
// ============================================

export interface Oposicion {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

// ============================================
// LEAGUE & ELO
// ============================================

export type LeagueTier =
  | "bronce"
  | "plata"
  | "oro"
  | "platino"
  | "diamante"
  | "maestro";

export interface League {
  tier: LeagueTier;
  name: string;
  position?: number;
  total_players?: number;
}

// ============================================
// BADGES
// ============================================

export type BadgeRarity = "comun" | "raro" | "epico" | "legendario";

export interface ProfileBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  earned_at: string;
}

// ============================================
// STATS
// ============================================

export interface UserStats {
  tests_completed: number;
  tests_passed: number;
  total_questions: number;
  correct_answers: number;
  accuracy_percentage: number;
  study_hours: number;
  best_streak: number;
  current_position: number;
  total_points: number;
  coins: number;
}

// ============================================
// PROFILE
// ============================================

export interface MyProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joined_at: string;
  elo: number;
  league: League;
  streak_days: number;
  oposiciones: Oposicion[];
  active_oposicion?: Oposicion;
  badges: ProfileBadge[];
  stats: UserStats;
  settings: ProfileSettings;
}

export interface ProfileSettings {
  show_stats: boolean;
  show_badges: boolean;
  show_elo: boolean;
  show_streak: boolean;
  allow_friend_requests: boolean;
  email_notifications: boolean;
}

// ============================================
// USER PROFILE (other users)
// ============================================

export type FriendshipStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "friends"
  | "blocked";

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  joined_at: string;
  elo?: number;
  league?: League;
  streak_days?: number;
  active_oposicion?: Oposicion;
  badges?: ProfileBadge[];
  stats?: UserStats;
  friendship_status: FriendshipStatus;
  is_profile_public: boolean;
  show_badges_publicly: boolean;
}

// ============================================
// BLOCKED USERS
// ============================================

export interface BlockedUser {
  id: string;
  name: string;
  avatar?: string;
  blocked_at: string;
}

// ============================================
// REQUESTS
// ============================================

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
}

export interface UpdateSettingsRequest {
  show_stats?: boolean;
  show_badges?: boolean;
  show_elo?: boolean;
  show_streak?: boolean;
  allow_friend_requests?: boolean;
  email_notifications?: boolean;
}
