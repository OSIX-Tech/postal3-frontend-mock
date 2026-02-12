import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  AlertTriangle,
  Grid3X3,
  RotateCcw,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QuestionCard } from "@/components/tests/QuestionCard";
import { TestStatusBar } from "@/components/tests/TestStatusBar";
import { test_service } from "@/services/test-service";
import { use_test_store } from "@/stores/test-store";
import { use_test_timer } from "@/hooks/use-test-timer";
import { use_test_recovery } from "@/hooks/use-test-recovery";
import { use_test_keyboard } from "@/hooks/use-test-keyboard";
import { use_swipe } from "@/hooks/use-swipe";
import { cn } from "@/lib/utils";

export function TestPerformPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const test_id = id ? Number(id) : 0;

  const [show_finish_dialog, set_show_finish_dialog] = useState(false);
  const [show_navigator, set_show_navigator] = useState(false);
  const [time_up_warning, set_time_up_warning] = useState(false);
  const [show_recovery_dialog, set_show_recovery_dialog] = useState(false);
  const [show_shortcuts, set_show_shortcuts] = useState(false);

  const {
    attempt,
    current_question_index,
    start_attempt,
    set_answer,
    toggle_flag,
    set_current_question,
    next_question,
    prev_question,
    get_current_question,
    get_answer,
    get_progress,
    reset,
  } = use_test_store();

  const timer = use_test_timer({
    on_time_up: () => {
      set_time_up_warning(true);
    },
  });

  // Recovery hook
  const recovery = use_test_recovery(test_id);

  // Start test query
  const {
    data: started_attempt,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["start-test", test_id],
    queryFn: () => test_service.start_test(test_id),
    enabled: test_id > 0 && !attempt,
    staleTime: Infinity,
  });

  // Finish test mutation
  const finish_mutation = useMutation({
    mutationFn: () => {
      if (!attempt) throw new Error("No attempt");
      return test_service.finish_test(
        attempt.id,
        attempt.answers,
        timer.elapsed_seconds
      );
    },
    onSuccess: (result) => {
      recovery.clear();
      reset();
      navigate(`/tests/${id}/results`, { state: { result } });
    },
  });

  // Initialize attempt when loaded
  useEffect(() => {
    if (started_attempt && !attempt) {
      start_attempt(started_attempt);
    }
  }, [started_attempt, attempt, start_attempt]);

  // Show recovery dialog once attempt is loaded and there's saved progress
  useEffect(() => {
    if (attempt && recovery.has_saved_progress) {
      set_show_recovery_dialog(true);
    }
  }, [attempt, recovery.has_saved_progress]);

  const handle_answer_select = useCallback(
    (answer_id: number) => {
      const question = get_current_question();
      if (question) {
        set_answer(question.id, answer_id, "selected");
      }
    },
    [get_current_question, set_answer]
  );

  const handle_answer_doubt = useCallback(
    (answer_id: number) => {
      const question = get_current_question();
      if (question) {
        set_answer(question.id, answer_id, "doubt");
      }
    },
    [get_current_question, set_answer]
  );

  const handle_toggle_flag = useCallback(() => {
    const question = get_current_question();
    if (question) {
      toggle_flag(question.id);
    }
  }, [get_current_question, toggle_flag]);

  const handle_finish = useCallback(() => {
    set_show_finish_dialog(true);
  }, []);

  const confirm_finish = useCallback(() => {
    set_show_finish_dialog(false);
    finish_mutation.mutate();
  }, [finish_mutation]);

  // Keyboard: select answer by index (0-based)
  const handle_answer_by_index = useCallback(
    (index: number) => {
      const question = get_current_question();
      if (!question) return;
      const answer = question.answers[index];
      if (answer) {
        set_answer(question.id, answer.id, "selected");
      }
    },
    [get_current_question, set_answer]
  );

  const current_question = get_current_question();
  const current_answer = current_question
    ? get_answer(current_question.id)
    : null;
  const progress = get_progress();

  // Keyboard shortcuts
  use_test_keyboard({
    enabled: !!attempt && !show_finish_dialog && !time_up_warning && !show_recovery_dialog,
    answer_count: current_question?.answers.length ?? 0,
    on_select_answer: handle_answer_by_index,
    on_next: next_question,
    on_prev: prev_question,
    on_toggle_flag: handle_toggle_flag,
    on_finish: handle_finish,
  });

  // Swipe gestures
  const swipe = use_swipe({
    on_swipe_left: next_question,
    on_swipe_right: prev_question,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-600 mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Preparando test...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600 dark:text-red-400">
            Error al cargar el test: {(error as Error)?.message}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/tests")}
          >
            Volver a tests
          </Button>
        </div>
      </div>
    );
  }

  // No attempt yet
  if (!attempt || !current_question) {
    return null;
  }

  // Convert available_time from minutes to seconds for the timer
  const available_seconds = attempt.test.available_time * 60;

  return (
    <div className="min-h-screen pb-32">
      {/* Top bar with question navigation */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Pregunta
              </span>
              <span className="text-lg font-bold text-foreground">
                {current_question_index + 1}
              </span>
              <span className="text-sm text-muted-foreground">
                / {attempt.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={current_answer?.flagged_for_review ? "default" : "outline"}
                size="sm"
                onClick={handle_toggle_flag}
                className={cn(
                  current_answer?.flagged_for_review &&
                    "bg-amber-500 hover:bg-amber-600 text-white"
                )}
                title="Marcar para revisar (F)"
              >
                <Flag className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Marcar</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => set_show_shortcuts(!show_shortcuts)}
                className="hidden md:flex"
                title="Atajos de teclado"
              >
                <Keyboard className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => set_show_navigator(!show_navigator)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Keyboard shortcuts panel */}
          {show_shortcuts && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">
                Atajos de teclado
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-card rounded border text-xs font-mono">1-4</kbd>
                  Seleccionar respuesta
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-card rounded border text-xs font-mono">F</kbd>
                  Marcar/desmarcar
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-card rounded border text-xs font-mono">&larr; &rarr;</kbd>
                  Navegar preguntas
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-card rounded border text-xs font-mono">Ctrl+Enter</kbd>
                  Finalizar test
                </div>
              </div>
            </div>
          )}

          {/* Question navigator grid */}
          {show_navigator && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex flex-wrap gap-2">
                {attempt.questions.map((q, idx) => {
                  const answer = get_answer(q.id);
                  const is_current = idx === current_question_index;
                  const is_answered = !!answer?.selected_answer_id;
                  const is_flagged = answer?.flagged_for_review;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        set_current_question(idx);
                        set_show_navigator(false);
                      }}
                      className={cn(
                        "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                        is_current && "ring-2 ring-violet-500 ring-offset-2 ring-offset-muted",
                        is_answered
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                          : "bg-background text-muted-foreground",
                        is_flagged && "!bg-amber-100 !text-amber-700 dark:!bg-amber-900/30 dark:!text-amber-300"
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-violet-100 dark:bg-violet-900/30" />
                  Respondida
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-background" />
                  Sin responder
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30" />
                  Marcada
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question content — swipe enabled */}
      <div
        className="container max-w-4xl mx-auto px-4 py-8"
        onTouchStart={swipe.on_touch_start}
        onTouchEnd={swipe.on_touch_end}
      >
        <QuestionCard
          id={current_question.id}
          index={current_question.index}
          name={current_question.name}
          preamble={current_question.preamble}
          description={current_question.description}
          answers={current_question.answers}
          images={current_question.images}
          state="unanswered"
          selected_answer_id={current_answer?.selected_answer_id}
          answer_action={current_answer?.action || "none"}
          on_answer_select={handle_answer_select}
          on_answer_doubt={handle_answer_doubt}
          show_controls={true}
          show_result={false}
          is_official={current_question.is_official}
          is_obsolete={current_question.is_obsolete}
        />

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prev_question}
            disabled={current_question_index === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {current_question_index === attempt.questions.length - 1 ? (
            <Button onClick={handle_finish} className="gap-1">
              Finalizar test
            </Button>
          ) : (
            <Button onClick={next_question} className="gap-1">
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Status bar */}
      <TestStatusBar
        elapsed_seconds={timer.elapsed_seconds}
        available_seconds={available_seconds}
        answered_count={progress.answered}
        total_questions={progress.total}
        is_paused={timer.is_paused}
        on_pause={timer.toggle_pause}
        on_finish={handle_finish}
      />

      {/* Recovery dialog */}
      <AlertDialog
        open={show_recovery_dialog}
        onOpenChange={set_show_recovery_dialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-violet-600" />
              Test en progreso encontrado
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tienes un intento guardado de este test
              {recovery.saved_at && (
                <span className="block mt-1 text-muted-foreground">
                  Guardado: {new Date(recovery.saved_at).toLocaleString("es-ES")}
                </span>
              )}
              <span className="block mt-2">
                ¿Quieres continuar donde lo dejaste o empezar de nuevo?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                recovery.discard();
                set_show_recovery_dialog(false);
              }}
            >
              Empezar de nuevo
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                recovery.recover();
                set_show_recovery_dialog(false);
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finish confirmation dialog */}
      <AlertDialog
        open={show_finish_dialog}
        onOpenChange={set_show_finish_dialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar el test?</AlertDialogTitle>
            <AlertDialogDescription>
              Has respondido {progress.answered} de {progress.total} preguntas.
              {progress.answered < progress.total && (
                <span className="block mt-2 text-amber-600 dark:text-amber-400">
                  Aún tienes {progress.total - progress.answered} preguntas sin
                  responder.
                </span>
              )}
              {progress.flagged > 0 && (
                <span className="block mt-1 text-amber-600 dark:text-amber-400">
                  Tienes {progress.flagged} preguntas marcadas para revisar.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar test</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirm_finish}
              disabled={finish_mutation.isPending}
            >
              {finish_mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time up warning dialog */}
      <AlertDialog open={time_up_warning} onOpenChange={set_time_up_warning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              ¡Se acabó el tiempo!
            </AlertDialogTitle>
            <AlertDialogDescription>
              El tiempo disponible para el test ha terminado. Puedes finalizar
              ahora o continuar respondiendo (el tiempo extra quedará
              registrado).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar</AlertDialogCancel>
            <AlertDialogAction onClick={confirm_finish}>
              Finalizar ahora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
