import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CoachEmotion, CoachMessage } from "@/types/coach";

interface CoachState {
  // Persisted
  has_seen_entry_today: boolean;
  last_entry_date: string | null;
  // Transient
  is_visible: boolean;
  current_message: CoachMessage | null;
  queue: CoachMessage[];
  emotion: CoachEmotion;
  // Actions
  show_message: (message: CoachMessage) => void;
  enqueue_message: (message: CoachMessage) => void;
  dismiss: () => void;
  mark_entry_seen: () => void;
  check_new_day: () => boolean;
}

function get_today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const use_coach_store = create<CoachState>()(
  persist(
    (set, get) => ({
      // Persisted
      has_seen_entry_today: false,
      last_entry_date: null,

      // Transient
      is_visible: false,
      current_message: null,
      queue: [],
      emotion: "idle" as CoachEmotion,

      show_message: (message) => {
        set({
          is_visible: true,
          current_message: message,
          emotion: message.emotion,
        });
      },

      enqueue_message: (message) => {
        const state = get();
        if (state.is_visible) {
          set({ queue: [...state.queue, message] });
        } else {
          set({
            is_visible: true,
            current_message: message,
            emotion: message.emotion,
          });
        }
      },

      dismiss: () => {
        const state = get();
        const [next, ...rest] = state.queue;
        if (next) {
          set({
            current_message: next,
            emotion: next.emotion,
            queue: rest,
          });
        } else {
          set({
            is_visible: false,
            current_message: null,
            emotion: "idle",
          });
        }
      },

      mark_entry_seen: () => {
        set({
          has_seen_entry_today: true,
          last_entry_date: get_today(),
        });
      },

      check_new_day: () => {
        const state = get();
        const today = get_today();
        if (state.last_entry_date !== today) {
          set({ has_seen_entry_today: false, last_entry_date: today });
          return true;
        }
        return !state.has_seen_entry_today;
      },
    }),
    {
      name: "coach-storage",
      partialize: (state) => ({
        has_seen_entry_today: state.has_seen_entry_today,
        last_entry_date: state.last_entry_date,
      }),
    }
  )
);
