import i18n from "@/i18n/config";
import type { CoachContext, CoachMessage, CoachTrigger } from "@/types/coach";

interface MessageTemplate {
  title: string;
  body: string;
  emotion: CoachMessage["emotion"];
  action?: CoachMessage["action"];
}

interface I18nCoachEntry {
  title: string;
  body: string;
  action?: string;
}

function get_app_entry_templates(): MessageTemplate[] {
  const msgs = i18n.t("coach.app_entry", { ns: "landing", returnObjects: true }) as I18nCoachEntry[];
  const emotions: CoachMessage["emotion"][] = ["happy", "encouraging", "idle"];
  return msgs.map((msg, i) => ({
    title: msg.title,
    body: msg.body,
    emotion: emotions[i] ?? "idle",
    action: msg.action ? { label: msg.action, to: "/tests" } : undefined,
  }));
}

function get_auto_test_templates(): MessageTemplate[] {
  const msgs = i18n.t("coach.auto_test", { ns: "landing", returnObjects: true }) as I18nCoachEntry[];
  const emotions: CoachMessage["emotion"][] = ["encouraging", "idle"];
  return msgs.map((msg, i) => ({
    title: msg.title,
    body: msg.body,
    emotion: emotions[i] ?? "idle",
    action: msg.action ? { label: msg.action, to: "/tests" } : undefined,
  }));
}

function get_daily_limit_templates(): MessageTemplate[] {
  const msgs = i18n.t("coach.daily_limit", { ns: "landing", returnObjects: true }) as I18nCoachEntry[];
  const emotions: CoachMessage["emotion"][] = ["happy", "celebrating"];
  return msgs.map((msg, i) => ({
    title: msg.title,
    body: msg.body,
    emotion: emotions[i] ?? "happy",
    action: msg.action ? { label: msg.action, to: "/tests" } : undefined,
  }));
}

function get_post_test_high_templates(): MessageTemplate[] {
  const msgs = i18n.t("coach.post_test_high", { ns: "landing", returnObjects: true }) as I18nCoachEntry[];
  const emotions: CoachMessage["emotion"][] = ["celebrating", "happy"];
  return msgs.map((msg, i) => ({
    title: msg.title,
    body: msg.body,
    emotion: emotions[i] ?? "celebrating",
    action: msg.action ? { label: msg.action, to: "/tests" } : undefined,
  }));
}

function get_post_test_mid_templates(): MessageTemplate[] {
  const msgs = i18n.t("coach.post_test_mid", { ns: "landing", returnObjects: true }) as I18nCoachEntry[];
  const emotions: CoachMessage["emotion"][] = ["encouraging", "idle"];
  return msgs.map((msg, i) => ({
    title: msg.title,
    body: msg.body,
    emotion: emotions[i] ?? "encouraging",
    action: msg.action ? { label: msg.action, to: "/tests" } : undefined,
  }));
}

function get_post_test_low_templates(): MessageTemplate[] {
  const msgs = i18n.t("coach.post_test_low", { ns: "landing", returnObjects: true }) as I18nCoachEntry[];
  const emotions: CoachMessage["emotion"][] = ["worried", "encouraging"];
  return msgs.map((msg, i) => ({
    title: msg.title,
    body: msg.body,
    emotion: emotions[i] ?? "worried",
    action: msg.action ? { label: msg.action, to: "/tests" } : undefined,
  }));
}

function interpolate(template: string, context: CoachContext): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = context[key as keyof CoachContext];
    if (value !== undefined && value !== null) return String(value);
    return match;
  });
}

function pick_random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function get_post_test_templates(score: number): MessageTemplate[] {
  if (score >= 80) return get_post_test_high_templates();
  if (score >= 50) return get_post_test_mid_templates();
  return get_post_test_low_templates();
}

let message_counter = 0;

function build_message(
  trigger: CoachTrigger,
  template: MessageTemplate,
  context: CoachContext
): CoachMessage {
  message_counter += 1;
  const incorrect_count =
    context.total_questions !== undefined && context.correct_count !== undefined
      ? context.total_questions - context.correct_count
      : 0;

  const full_context = { ...context, incorrect_count };

  return {
    id: `coach-${trigger}-${message_counter}`,
    trigger,
    title: interpolate(template.title, full_context),
    body: interpolate(template.body, full_context),
    emotion: template.emotion,
    action: template.action,
  };
}

export const coach_service = {
  get_entry_message(context: CoachContext): CoachMessage {
    const template = pick_random(get_app_entry_templates());
    return build_message("app_entry", template, context);
  },

  get_post_test_message(context: CoachContext & { score: number }): CoachMessage {
    const templates = get_post_test_templates(context.score);
    const template = pick_random(templates);
    return build_message("post_test", template, context);
  },

  get_auto_test_message(context: CoachContext): CoachMessage {
    const template = pick_random(get_auto_test_templates());
    return build_message("auto_generated_test", template, context);
  },

  get_daily_limit_message(context: CoachContext): CoachMessage {
    const template = pick_random(get_daily_limit_templates());
    return build_message("daily_point_limit", template, context);
  },
};
