import { useEffect, useRef, useCallback, useState } from "react";
import { use_test_store } from "@/stores/test-store";
import type { QuestionAttempt } from "@/types/test";

const STORAGE_PREFIX = "test_progress_";
const AUTO_SAVE_INTERVAL_MS = 30_000;
const MAX_AGE_HOURS = 24;

interface SavedProgress {
  answers: QuestionAttempt[];
  current_question_index: number;
  elapsed_seconds: number;
  saved_at: string;
}

export function use_test_recovery(test_id: number) {
  const { attempt, restore_progress } = use_test_store();
  const elapsed_ref = useRef(0);

  const storage_key = `${STORAGE_PREFIX}${test_id}`;

  // Keep elapsed in sync via ref (avoid stale closures)
  const { elapsed_seconds } = use_test_store();
  elapsed_ref.current = elapsed_seconds;

  // Check for saved progress
  const [saved_progress, set_saved_progress] = useState<SavedProgress | null>(
    () => {
      try {
        const raw = localStorage.getItem(storage_key);
        if (!raw) return null;

        const parsed: SavedProgress = JSON.parse(raw);
        const saved_at = new Date(parsed.saved_at);
        const hours_ago =
          (Date.now() - saved_at.getTime()) / (1000 * 60 * 60);

        if (hours_ago > MAX_AGE_HOURS) {
          localStorage.removeItem(storage_key);
          return null;
        }

        return parsed;
      } catch {
        localStorage.removeItem(storage_key);
        return null;
      }
    }
  );

  const has_saved_progress = saved_progress !== null;

  // Save current progress to localStorage
  const save_progress = useCallback(() => {
    const state = use_test_store.getState();
    if (!state.attempt) return;

    const data: SavedProgress = {
      answers: state.attempt.answers,
      current_question_index: state.current_question_index,
      elapsed_seconds: elapsed_ref.current,
      saved_at: new Date().toISOString(),
    };

    try {
      localStorage.setItem(storage_key, JSON.stringify(data));
    } catch {
      // Storage full — silently fail
    }
  }, [storage_key]);

  // Recover saved progress into the store
  const recover = useCallback(() => {
    if (!saved_progress) return;

    restore_progress(
      saved_progress.answers,
      saved_progress.current_question_index,
      saved_progress.elapsed_seconds
    );
    set_saved_progress(null);
  }, [saved_progress, restore_progress]);

  // Discard saved progress
  const discard = useCallback(() => {
    localStorage.removeItem(storage_key);
    set_saved_progress(null);
  }, [storage_key]);

  // Clear saved progress (after finishing test)
  const clear = useCallback(() => {
    localStorage.removeItem(storage_key);
  }, [storage_key]);

  // Auto-save on interval
  useEffect(() => {
    if (!attempt) return;

    const interval = setInterval(save_progress, AUTO_SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [attempt, save_progress]);

  // Save on visibility change (tab switch / app background)
  useEffect(() => {
    const handle_visibility = () => {
      if (document.visibilityState === "hidden") {
        save_progress();
      }
    };

    document.addEventListener("visibilitychange", handle_visibility);
    return () =>
      document.removeEventListener("visibilitychange", handle_visibility);
  }, [save_progress]);

  // Save on beforeunload (browser close / refresh)
  useEffect(() => {
    const handle_unload = () => save_progress();
    window.addEventListener("beforeunload", handle_unload);
    return () => window.removeEventListener("beforeunload", handle_unload);
  }, [save_progress]);

  return {
    has_saved_progress,
    saved_at: saved_progress?.saved_at ?? null,
    recover,
    discard,
    clear,
    save_progress,
  };
}
