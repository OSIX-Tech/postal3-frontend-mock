// Test and Question Types for Postal3
// These types match the existing component interfaces

export interface TestKind {
  id: number;
  name: string;
  icon_url?: string;
}

export interface TestStats {
  attempt_count: number;
  passed_count: number;
  failed_count: number;
  max_points: number;
  own_max_points: number;
}

export type TestStatus = "pending" | "failed" | "passed";

export interface Test {
  id: number;
  name: string;
  description?: string;
  image?: string;
  status: TestStatus;
  question_count: number;
  available_time: number; // in minutes for TestCard display
  stats?: TestStats;
  kind?: TestKind;
  training?: string; // "Entrenamiento" or undefined
  author?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Answer {
  id: number;
  name: string;
  is_correct?: boolean; // Only revealed in results
}

export type QuestionState = "unanswered" | "correct" | "incorrect" | "blank";
export type AnswerAction = "none" | "selected" | "doubt";

export interface QuestionImage {
  id: number;
  name: string;
  url: string;
}

export interface Question {
  id: number;
  index: number;
  name: string;
  preamble?: string;
  description?: string;
  answers: Answer[];
  images?: QuestionImage[];
  is_official?: boolean;
  is_obsolete?: boolean;
  justification?: string;
}

// Test attempt types
export interface QuestionAttempt {
  question_id: number;
  selected_answer_id: number | null;
  action: AnswerAction;
  flagged_for_review: boolean;
  time_spent: number; // seconds spent on this question
}

export interface TestAttempt {
  id: string;
  test_id: number;
  test: Test;
  questions: Question[];
  answers: QuestionAttempt[];
  started_at: string;
  finished_at?: string;
  elapsed_time: number;
  is_paused: boolean;
  status: "in_progress" | "completed" | "abandoned";
}

export interface GamificationData {
  points_earned: number;
  points_breakdown: { label: string; points: number }[];
  coins_earned: number;
  streak_count: number;
  streak_is_new_record: boolean;
  first_test_today_bonus: boolean;
}

export interface TestResult {
  attempt_id: string;
  test_id: number;
  test_name: string;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  score: number; // percentage
  passed: boolean;
  time_spent: number;
  questions: QuestionResult[];
  completed_at: string;
  average_score?: number; // average score of all users on this test
  gamification?: GamificationData;
  coach_message?: string;
}

export interface QuestionResult {
  question_id: number;
  question: Question;
  selected_answer_id: number | null;
  correct_answer_id: number;
  is_correct: boolean;
  state: QuestionState;
}

// Filter types for test listing
export interface TestFilters {
  search?: string;
  kind_id?: string;
  status?: TestStatus | "all";
  training?: boolean;
  sort_by?: "name" | "created_at" | "question_count";
  sort_order?: "asc" | "desc";
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
