import { useEffect, useRef, useCallback } from "react";
import { use_test_store } from "@/stores/test-store";

interface UseTestTimerOptions {
  on_time_up?: () => void;
  auto_start?: boolean;
}

export function use_test_timer(options: UseTestTimerOptions = {}) {
  const { on_time_up, auto_start = true } = options;

  const { attempt, elapsed_seconds, is_paused, tick, pause, resume } =
    use_test_store();

  const interval_ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const time_up_called_ref = useRef(false);

  const available_seconds = attempt?.test.available_time ?? 0;
  const remaining_seconds = Math.max(0, available_seconds - elapsed_seconds);
  const is_time_up = remaining_seconds <= 0 && available_seconds > 0;
  const progress_percentage =
    available_seconds > 0
      ? Math.min(100, (elapsed_seconds / available_seconds) * 100)
      : 0;

  // Format time as HH:MM:SS or MM:SS
  const format_time = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Start the timer interval
  const start_timer = useCallback(() => {
    if (interval_ref.current) return;

    interval_ref.current = setInterval(() => {
      tick();
    }, 1000);
  }, [tick]);

  // Stop the timer interval
  const stop_timer = useCallback(() => {
    if (interval_ref.current) {
      clearInterval(interval_ref.current);
      interval_ref.current = null;
    }
  }, []);

  // Handle pause/resume
  useEffect(() => {
    if (is_paused) {
      stop_timer();
    } else if (attempt && auto_start) {
      start_timer();
    }
  }, [is_paused, attempt, auto_start, start_timer, stop_timer]);

  // Handle time up callback
  useEffect(() => {
    if (is_time_up && !time_up_called_ref.current && on_time_up) {
      time_up_called_ref.current = true;
      on_time_up();
    }
  }, [is_time_up, on_time_up]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop_timer();
    };
  }, [stop_timer]);

  // Reset time_up flag when attempt changes
  useEffect(() => {
    time_up_called_ref.current = false;
  }, [attempt?.id]);

  return {
    elapsed_seconds,
    remaining_seconds,
    available_seconds,
    is_paused,
    is_time_up,
    progress_percentage,
    formatted_elapsed: format_time(elapsed_seconds),
    formatted_remaining: format_time(remaining_seconds),
    pause,
    resume,
    toggle_pause: is_paused ? resume : pause,
  };
}
