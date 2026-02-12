import { create } from "zustand";
import type {
  TestAttempt,
  QuestionAttempt,
  Question,
  AnswerAction,
} from "@/types/test";

interface TestState {
  // Current attempt
  attempt: TestAttempt | null;
  current_question_index: number;

  // Timer
  elapsed_seconds: number;
  is_paused: boolean;

  // Actions
  start_attempt: (attempt: TestAttempt) => void;
  set_answer: (
    question_id: number,
    answer_id: number | null,
    action?: AnswerAction
  ) => void;
  toggle_flag: (question_id: number) => void;
  set_current_question: (index: number) => void;
  next_question: () => void;
  prev_question: () => void;
  go_to_first_unanswered: () => void;
  tick: () => void;
  pause: () => void;
  resume: () => void;
  restore_progress: (
    answers: QuestionAttempt[],
    current_index: number,
    elapsed: number
  ) => void;
  reset: () => void;

  // Getters
  get_current_question: () => Question | null;
  get_answer: (question_id: number) => QuestionAttempt | null;
  get_answered_count: () => number;
  get_flagged_questions: () => number[];
  get_progress: () => {
    answered: number;
    flagged: number;
    total: number;
    percentage: number;
  };
}

export const use_test_store = create<TestState>((set, get) => ({
  attempt: null,
  current_question_index: 0,
  elapsed_seconds: 0,
  is_paused: false,

  start_attempt: (attempt) => {
    set({
      attempt,
      current_question_index: 0,
      elapsed_seconds: 0,
      is_paused: false,
    });
  },

  set_answer: (question_id, answer_id, action = "selected") => {
    const { attempt } = get();
    if (!attempt) return;

    const updated_answers = attempt.answers.map((a) =>
      a.question_id === question_id
        ? { ...a, selected_answer_id: answer_id, action }
        : a
    );

    set({
      attempt: { ...attempt, answers: updated_answers },
    });
  },

  toggle_flag: (question_id) => {
    const { attempt } = get();
    if (!attempt) return;

    const updated_answers = attempt.answers.map((a) =>
      a.question_id === question_id
        ? { ...a, flagged_for_review: !a.flagged_for_review }
        : a
    );

    set({
      attempt: { ...attempt, answers: updated_answers },
    });
  },

  set_current_question: (index) => {
    const { attempt } = get();
    if (!attempt) return;

    const max_index = attempt.questions.length - 1;
    const clamped = Math.max(0, Math.min(index, max_index));
    set({ current_question_index: clamped });
  },

  next_question: () => {
    const { current_question_index, attempt } = get();
    if (!attempt) return;

    if (current_question_index < attempt.questions.length - 1) {
      set({ current_question_index: current_question_index + 1 });
    }
  },

  prev_question: () => {
    const { current_question_index } = get();
    if (current_question_index > 0) {
      set({ current_question_index: current_question_index - 1 });
    }
  },

  go_to_first_unanswered: () => {
    const { attempt } = get();
    if (!attempt) return;

    const unanswered_index = attempt.answers.findIndex(
      (a) => !a.selected_answer_id
    );
    if (unanswered_index !== -1) {
      set({ current_question_index: unanswered_index });
    }
  },

  tick: () => {
    const { is_paused } = get();
    if (is_paused) return;

    set((state) => ({ elapsed_seconds: state.elapsed_seconds + 1 }));
  },

  pause: () => set({ is_paused: true }),

  resume: () => set({ is_paused: false }),

  restore_progress: (answers, current_index, elapsed) => {
    const { attempt } = get();
    if (!attempt) return;

    // Merge saved answers into the attempt (match by question_id)
    const merged_answers = attempt.answers.map((a) => {
      const saved = answers.find((s) => s.question_id === a.question_id);
      return saved ?? a;
    });

    set({
      attempt: { ...attempt, answers: merged_answers },
      current_question_index: Math.min(
        current_index,
        attempt.questions.length - 1
      ),
      elapsed_seconds: elapsed,
    });
  },

  reset: () => {
    set({
      attempt: null,
      current_question_index: 0,
      elapsed_seconds: 0,
      is_paused: false,
    });
  },

  get_current_question: () => {
    const { attempt, current_question_index } = get();
    if (!attempt) return null;
    return attempt.questions[current_question_index] || null;
  },

  get_answer: (question_id) => {
    const { attempt } = get();
    if (!attempt) return null;
    return attempt.answers.find((a) => a.question_id === question_id) || null;
  },

  get_answered_count: () => {
    const { attempt } = get();
    if (!attempt) return 0;
    return attempt.answers.filter((a) => a.selected_answer_id !== null).length;
  },

  get_flagged_questions: () => {
    const { attempt } = get();
    if (!attempt) return [];
    return attempt.answers
      .filter((a) => a.flagged_for_review)
      .map((a) => a.question_id);
  },

  get_progress: () => {
    const { attempt } = get();
    if (!attempt) {
      return { answered: 0, flagged: 0, total: 0, percentage: 0 };
    }

    const answered = attempt.answers.filter(
      (a) => a.selected_answer_id !== null
    ).length;
    const flagged = attempt.answers.filter((a) => a.flagged_for_review).length;
    const total = attempt.questions.length;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    return { answered, flagged, total, percentage };
  },
}));
