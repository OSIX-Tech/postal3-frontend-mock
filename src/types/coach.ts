export type CoachEmotion =
  | "idle"
  | "happy"
  | "worried"
  | "celebrating"
  | "encouraging";

export type CoachTrigger =
  | "app_entry"
  | "post_test"
  | "auto_generated_test"
  | "daily_point_limit";

export interface CoachContext {
  user_name?: string;
  score?: number;
  topic?: string;
  correct_count?: number;
  total_questions?: number;
  points?: number;
  test_count?: number;
}

export interface CoachMessage {
  id: string;
  trigger: CoachTrigger;
  title: string;
  body: string;
  emotion: CoachEmotion;
  action?: {
    label: string;
    to: string;
  };
}
