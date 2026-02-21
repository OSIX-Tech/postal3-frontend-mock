import { use_coach_store } from "@/stores/coach-store";
import { use_auth_store } from "@/stores/auth-store";
import { coach_service } from "@/services/coach-service";
import type { TestResult } from "@/types/test";

export function use_coach() {
  const { show_message, enqueue_message, check_new_day, mark_entry_seen } =
    use_coach_store();
  const { user } = use_auth_store();

  const user_name = user?.name?.split(" ")[0] ?? "";

  const trigger_app_entry = () => {
    const is_new = check_new_day();
    if (!is_new) return;

    const message = coach_service.get_entry_message({ user_name });
    show_message(message);
    mark_entry_seen();
  };

  const trigger_post_test = (result: TestResult) => {
    const message = coach_service.get_post_test_message({
      user_name,
      score: result.score,
      topic: result.test_name,
      correct_count: result.correct_count,
      total_questions: result.total_questions,
    });
    enqueue_message(message);
  };

  const trigger_auto_test = (topic: string, count: number) => {
    const message = coach_service.get_auto_test_message({
      user_name,
      topic,
      test_count: count,
    });
    enqueue_message(message);
  };

  const trigger_daily_limit = (points: number) => {
    const message = coach_service.get_daily_limit_message({
      user_name,
      points,
    });
    enqueue_message(message);
  };

  const trigger_manual = () => {
    const message = coach_service.get_entry_message({ user_name });
    show_message(message);
  };

  return {
    trigger_app_entry,
    trigger_post_test,
    trigger_auto_test,
    trigger_daily_limit,
    trigger_manual,
  };
}
