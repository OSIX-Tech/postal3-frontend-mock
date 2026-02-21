import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RotateCcw,
  Share2,
  Star,
  Coins,
  Flame,
  Zap,
  HelpCircle,
  Home,
  Shuffle,
  Users,
} from "lucide-react";
import { use_coach } from "@/hooks/use-coach";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { QuestionCard } from "@/components/tests/QuestionCard";
import { cn } from "@/lib/utils";
import type { TestResult } from "@/types/test";

// ============================================
// Animated counter hook
// ============================================
function use_count_up(target: number, duration = 1200) {
  const [value, set_value] = useState(0);

  useEffect(() => {
    if (target === 0) {
      set_value(0);
      return;
    }

    let start_time: number | null = null;
    let raf_id: number;

    const animate = (timestamp: number) => {
      if (!start_time) start_time = timestamp;
      const progress = Math.min((timestamp - start_time) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      set_value(Math.round(eased * target));

      if (progress < 1) {
        raf_id = requestAnimationFrame(animate);
      }
    };

    raf_id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf_id);
  }, [target, duration]);

  return value;
}

// ============================================
// Confetti component (CSS-only)
// ============================================
function Confetti() {
  const [visible, set_visible] = useState(true);
  const colors = [
    "var(--color-test-correct)",
    "var(--color-info)",
    "var(--color-test-star)",
    "var(--color-test-incorrect)",
    "var(--color-brand-primary)",
    "var(--color-brand-secondary)",
  ];

  useEffect(() => {
    const timer = setTimeout(() => set_visible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 40 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const anim_duration = 2.5 + Math.random() * 1.5;
        const size = 6 + Math.random() * 6;
        const color = colors[i % colors.length];

        return (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: "-10px",
              width: `${size}px`,
              height: `${size * 1.5}px`,
              backgroundColor: color,
              animation: `confetti-fall ${anim_duration}s ease-in ${delay}s forwards`,
              opacity: 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ============================================
// Main component
// ============================================
export function TestResultsPage() {
  const { t } = useTranslation('tests');
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result as TestResult | undefined;

  const [expanded_questions, set_expanded_questions] = useState<Set<number>>(
    new Set()
  );
  const [filter, set_filter] = useState<"all" | "correct" | "incorrect" | "unanswered">("all");
  const [show_all_questions, set_show_all_questions] = useState(false);
  const [show_breakdown, set_show_breakdown] = useState(false);
  const [impugn_question_id, set_impugn_question_id] = useState<number | null>(null);
  const [doubt_question_id, set_doubt_question_id] = useState<number | null>(null);
  const [impugn_reason, set_impugn_reason] = useState("");
  const [impugn_argument, set_impugn_argument] = useState("");
  const [doubt_text, set_doubt_text] = useState("");
  const [gamification_visible, set_gamification_visible] = useState(false);
  const { trigger_post_test } = use_coach();

  useEffect(() => {
    const timer = setTimeout(() => set_gamification_visible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Trigger coach overlay after animations settle
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => trigger_post_test(result), 3000);
    return () => clearTimeout(timer);
  }, [result?.attempt_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const animated_points = use_count_up(
    result?.gamification?.points_earned ?? 0
  );

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">
            {t('results.no_results')}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/tests")}
          >
            {t('results.back')}
          </Button>
        </div>
      </div>
    );
  }

  const format_time = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const toggle_question = (question_id: number) => {
    set_expanded_questions((prev) => {
      const next = new Set(prev);
      if (next.has(question_id)) {
        next.delete(question_id);
      } else {
        next.add(question_id);
      }
      return next;
    });
  };

  const expand_all = () => {
    set_expanded_questions(new Set(result.questions.map((q) => q.question_id)));
  };

  const collapse_all = () => {
    set_expanded_questions(new Set());
  };

  const filtered_questions = result.questions.filter((q) => {
    if (filter === "all") return true;
    if (filter === "correct") return q.is_correct;
    if (filter === "incorrect") return !q.is_correct && q.selected_answer_id;
    if (filter === "unanswered") return !q.selected_answer_id;
    return true;
  });

  const displayed_questions = show_all_questions
    ? filtered_questions
    : filtered_questions.slice(0, 5);

  const handle_impugn_submit = () => {
    if (!impugn_reason) {
      toast.error(t('results.toast_impugn_no_reason'));
      return;
    }
    toast.success(t('results.toast_impugn_success'));
    set_impugn_question_id(null);
    set_impugn_reason("");
    set_impugn_argument("");
  };

  const handle_doubt_submit = () => {
    if (!doubt_text.trim()) {
      toast.error(t('results.toast_doubt_empty'));
      return;
    }
    toast.success(t('results.toast_doubt_success'));
    set_doubt_question_id(null);
    set_doubt_text("");
  };

  const gamification = result.gamification;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Confetti if passed */}
      {result.passed && <Confetti />}

      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/tests")}
        className="mb-6 gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('results.back')}
      </Button>

      {/* Result summary card */}
      <div className="rounded-xl p-8 mb-8 border bg-card">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Score circle */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(result.score / 100) * 352} 352`}
                className={cn(
                  result.passed
                    ? "stroke-[var(--color-test-correct)]"
                    : "stroke-[var(--color-test-incorrect)]"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  "text-3xl font-bold",
                  result.passed
                    ? "text-test-correct"
                    : "text-test-incorrect"
                )}
              >
                {result.score}%
              </span>
              <span className="text-xs text-muted-foreground">
                {t('results.score_label')}
              </span>
            </div>
          </div>

          {/* Result details */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {result.passed ? t('results.passed') : t('results.failed')}
            </h1>
            <p className="text-muted-foreground mb-4">
              {result.test_name}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-test-correct" />
                <span className="font-medium">
                  {t('results.correct', { count: result.correct_count })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-test-incorrect" />
                <span className="font-medium">
                  {t('results.incorrect', { count: result.incorrect_count })}
                </span>
              </div>
              {result.unanswered_count > 0 && (
                <div className="flex items-center gap-1 text-test-unanswered">
                  <span className="w-4 h-4 rounded-full border-2 border-current" />
                  <span>{t('results.unanswered', { count: result.unanswered_count })}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{format_time(result.time_spent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
            <div
              className="bg-test-correct transition-all"
              style={{
                width: `${(result.correct_count / result.total_questions) * 100}%`,
              }}
            />
            <div
              className="bg-test-incorrect transition-all"
              style={{
                width: `${(result.incorrect_count / result.total_questions) * 100}%`,
              }}
            />
            <div
              className="bg-test-unanswered transition-all"
              style={{
                width: `${(result.unanswered_count / result.total_questions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Comparison with average */}
        {result.average_score !== undefined && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {t('results.average_title')}
              </span>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{t('results.your_score')}</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      result.passed ? "text-test-correct" : "text-test-incorrect"
                    )}
                  >
                    {result.score}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      result.passed ? "bg-test-correct" : "bg-test-incorrect"
                    )}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{t('results.average')}</span>
                  <span className="text-sm font-bold text-muted-foreground">
                    {result.average_score}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-muted-foreground/40 transition-all"
                    style={{ width: `${result.average_score}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {result.score > result.average_score
                ? t('results.above_average', { points: result.score - result.average_score })
                : result.score < result.average_score
                  ? t('results.below_average', { points: result.average_score - result.score })
                  : t('results.equal_average')}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/tests/${id}`)}
            className="gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            {t('results.retry')}
          </Button>
          <Button variant="outline" className="gap-1">
            <Share2 className="h-4 w-4" />
            {t('results.share')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/tests")}
            className="gap-1"
          >
            <Shuffle className="h-4 w-4" />
            {t('results.random_test')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-1"
          >
            <Home className="h-4 w-4" />
            {t('results.go_home')}
          </Button>
        </div>
      </div>

      {/* Gamification row */}
      {gamification && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gamification card */}
          {gamification && (
            <div
              className={cn(
                "rounded-xl border bg-card p-6 transition-all duration-700",
                gamification_visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Points */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-950/20 mb-2">
                    <Star className="h-5 w-5 text-[var(--color-brand-primary)]" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {animated_points}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('results.points')}</p>
                  {gamification.points_breakdown.length > 0 && (
                    <button
                      onClick={() => set_show_breakdown(!show_breakdown)}
                      className="text-xs text-[var(--color-brand-primary)] hover:underline mt-1"
                    >
                      {show_breakdown ? t('results.hide_detail') : t('results.show_detail')}
                    </button>
                  )}
                </div>

                {/* Coins */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-950/20 mb-2">
                    <Coins className="h-5 w-5 text-[var(--color-brand-primary)]" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {gamification.coins_earned}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('results.coins')}</p>
                </div>

                {/* Streak */}
                <div className="text-center">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 bg-violet-50 dark:bg-violet-950/20",
                      gamification.streak_is_new_record &&
                        "ring-2 ring-[var(--color-brand-primary)] ring-offset-2 ring-offset-card"
                    )}
                  >
                    <Flame className="h-5 w-5 text-[var(--color-brand-primary)]" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {gamification.streak_count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('results.streak_days')}
                  </p>
                  {gamification.streak_is_new_record && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-brand-primary)] text-white">
                      {t('results.record')}
                    </span>
                  )}
                </div>

                {/* First test today bonus */}
                <div className="text-center">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-10 h-10 rounded-full mb-2",
                      gamification.first_test_today_bonus
                        ? "bg-violet-50 dark:bg-violet-950/20"
                        : "bg-muted"
                    )}
                  >
                    <Zap
                      className={cn(
                        "h-5 w-5",
                        gamification.first_test_today_bonus
                          ? "text-[var(--color-brand-primary)]"
                          : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      gamification.first_test_today_bonus
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {gamification.first_test_today_bonus ? t('results.bonus') : t('results.no_bonus')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('results.first_test_bonus')}
                  </p>
                </div>
              </div>

              {/* Points breakdown */}
              {show_breakdown && (
                <div className="mt-4 pt-4 border-t">
                  <ul className="space-y-1">
                    {gamification.points_breakdown.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-sm text-muted-foreground"
                      >
                        <span>{item.label}</span>
                        <span className="font-medium text-foreground">+{item.points}</span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between text-sm font-bold text-foreground pt-1 border-t">
                      <span>{t('results.total')}</span>
                      <span>+{gamification.points_earned}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Question review section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {t('results.review_title')}
          </h2>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={expand_all}>
              {t('results.expand_all')}
            </Button>
            <Button variant="ghost" size="sm" onClick={collapse_all}>
              {t('results.collapse_all')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              { key: "all" as const, label: t('results.filter_all'), count: result.total_questions },
              { key: "correct" as const, label: t('results.filter_correct'), count: result.correct_count },
              { key: "incorrect" as const, label: t('results.filter_incorrect'), count: result.incorrect_count },
              { key: "unanswered" as const, label: t('results.filter_unanswered'), count: result.unanswered_count },
            ]
          ).map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => set_filter(f.key)}
              className="gap-1"
            >
              {f.label}
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  filter === f.key
                    ? "bg-white/20"
                    : "bg-muted"
                )}
              >
                {f.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Questions list */}
        <div className="space-y-3">
          {displayed_questions.map((qr) => {
            const is_expanded = expanded_questions.has(qr.question_id);

            return (
              <div
                key={qr.question_id}
                className="border rounded-lg overflow-hidden"
              >
                {/* Question header */}
                <button
                  onClick={() => toggle_question(qr.question_id)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        qr.is_correct
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : qr.selected_answer_id
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {qr.question.index}
                    </span>
                    <span className="text-left text-sm text-foreground line-clamp-1">
                      {qr.question.name}
                    </span>
                  </div>
                  {is_expanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {/* Question content */}
                {is_expanded && (
                  <div className="p-4 bg-card">
                    <QuestionCard
                      id={qr.question.id}
                      index={qr.question.index}
                      name={qr.question.name}
                      preamble={qr.question.preamble}
                      description={qr.question.description}
                      answers={qr.question.answers}
                      images={qr.question.images}
                      state={qr.state}
                      selected_answer_id={qr.selected_answer_id}
                      show_controls={false}
                      show_result={true}
                      is_official={qr.question.is_official}
                      is_obsolete={qr.question.is_obsolete}
                    />

                    {/* Justification */}
                    {qr.question.justification && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-medium text-foreground mb-2">
                          {t('results.justification')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {qr.question.justification}
                        </p>
                      </div>
                    )}

                    {/* Impugn & Doubt buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive"
                        onClick={() => set_impugn_question_id(qr.question_id)}
                      >
                        <Flame className="h-3.5 w-3.5" />
                        {t('results.impugn')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => set_doubt_question_id(qr.question_id)}
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        {t('results.doubt')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show more button */}
        {!show_all_questions && filtered_questions.length > 5 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => set_show_all_questions(true)}
          >
            {t('results.show_all', { count: filtered_questions.length - 5 })}
          </Button>
        )}
      </div>

      {/* Impugn dialog */}
      <Dialog
        open={impugn_question_id !== null}
        onOpenChange={(open) => {
          if (!open) {
            set_impugn_question_id(null);
            set_impugn_reason("");
            set_impugn_argument("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('results.impugn_title')}</DialogTitle>
            <DialogDescription>
              {t('results.impugn_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('results.impugn_reason_label')}</Label>
              <Select value={impugn_reason} onValueChange={set_impugn_reason}>
                <SelectTrigger>
                  <SelectValue placeholder={t('results.impugn_reason_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="respuesta_incorrecta">{t('results.impugn_reason_incorrect')}</SelectItem>
                  <SelectItem value="pregunta_ambigua">{t('results.impugn_reason_ambiguous')}</SelectItem>
                  <SelectItem value="contenido_obsoleto">{t('results.impugn_reason_obsolete')}</SelectItem>
                  <SelectItem value="multiples_correctas">{t('results.impugn_reason_multiple')}</SelectItem>
                  <SelectItem value="otro">{t('results.impugn_reason_other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="impugn-argument">{t('results.impugn_argument_label')}</Label>
              <textarea
                id="impugn-argument"
                value={impugn_argument}
                onChange={(e) => set_impugn_argument(e.target.value)}
                placeholder={t('results.impugn_argument_placeholder')}
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('results.cancel')}</Button>
            </DialogClose>
            <Button onClick={handle_impugn_submit}>{t('results.impugn_submit')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doubt dialog */}
      <Dialog
        open={doubt_question_id !== null}
        onOpenChange={(open) => {
          if (!open) {
            set_doubt_question_id(null);
            set_doubt_text("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('results.doubt_title')}</DialogTitle>
            <DialogDescription>
              {t('results.doubt_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="doubt-text">{t('results.doubt_label')}</Label>
              <textarea
                id="doubt-text"
                value={doubt_text}
                onChange={(e) => set_doubt_text(e.target.value)}
                placeholder={t('results.doubt_placeholder')}
                rows={4}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('results.cancel')}</Button>
            </DialogClose>
            <Button onClick={handle_doubt_submit}>{t('results.doubt_submit')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
