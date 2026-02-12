import { useEffect } from "react";

interface UseTestKeyboardOptions {
  enabled?: boolean;
  answer_count: number;
  on_select_answer: (index: number) => void;
  on_next: () => void;
  on_prev: () => void;
  on_toggle_flag: () => void;
  on_finish: () => void;
}

export function use_test_keyboard({
  enabled = true,
  answer_count,
  on_select_answer,
  on_next,
  on_prev,
  on_toggle_flag,
  on_finish,
}: UseTestKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handle_keydown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs/textareas
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Ignore when a dialog is open (has [role="dialog"])
      if (document.querySelector("[role='alertdialog'], [role='dialog']"))
        return;

      switch (e.key) {
        // Answer selection: 1-4
        case "1":
        case "2":
        case "3":
        case "4": {
          const index = Number(e.key) - 1;
          if (index < answer_count) {
            e.preventDefault();
            on_select_answer(index);
          }
          break;
        }

        // Navigation
        case "ArrowRight":
          e.preventDefault();
          on_next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          on_prev();
          break;

        // Flag
        case "f":
        case "F":
          e.preventDefault();
          on_toggle_flag();
          break;

        // Finish (Ctrl/Cmd + Enter)
        case "Enter":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            on_finish();
          }
          break;
      }
    };

    window.addEventListener("keydown", handle_keydown);
    return () => window.removeEventListener("keydown", handle_keydown);
  }, [
    enabled,
    answer_count,
    on_select_answer,
    on_next,
    on_prev,
    on_toggle_flag,
    on_finish,
  ]);
}
