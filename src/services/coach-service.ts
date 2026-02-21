import type { CoachContext, CoachMessage, CoachTrigger } from "@/types/coach";

interface MessageTemplate {
  title: string;
  body: string;
  emotion: CoachMessage["emotion"];
  action?: CoachMessage["action"];
}

const TEMPLATES: Record<CoachTrigger, MessageTemplate[]> = {
  app_entry: [
    {
      title: "Bienvenida de vuelta",
      body: "Hola {user_name}, la constancia es la clave del exito. Dedica aunque sea 15 minutos hoy a repasar tus temas pendientes.",
      emotion: "happy",
      action: { label: "Empezar test", to: "/tests" },
    },
    {
      title: "Un dia mas, un paso mas",
      body: "Cada sesion de estudio te acerca a tu plaza, {user_name}. Hoy es un buen dia para superar tus limites.",
      emotion: "encouraging",
      action: { label: "Ver tests", to: "/tests" },
    },
    {
      title: "Tu coach te saluda",
      body: "Hola {user_name}, recuerda que la preparacion diaria marca la diferencia entre aprobar y quedarse cerca. Vamos a por ello.",
      emotion: "idle",
      action: { label: "Ir a practicar", to: "/tests" },
    },
  ],

  post_test: [],

  auto_generated_test: [
    {
      title: "Test personalizado listo",
      body: "He generado un test de {test_count} preguntas sobre {topic} basado en tus areas de mejora. Practicar lo dificil es lo que realmente te prepara.",
      emotion: "encouraging",
      action: { label: "Hacer test", to: "/tests" },
    },
    {
      title: "Repaso inteligente",
      body: "Tienes un nuevo test de {topic} con {test_count} preguntas seleccionadas para reforzar tus puntos debiles.",
      emotion: "idle",
      action: { label: "Empezar ahora", to: "/tests" },
    },
  ],

  daily_point_limit: [
    {
      title: "Limite diario alcanzado",
      body: "Has llegado a {points} puntos hoy. Descansar tambien es parte del estudio. Vuelve manana con la mente fresca.",
      emotion: "happy",
    },
    {
      title: "Gran sesion de estudio",
      body: "Increible esfuerzo hoy, {user_name}. Has alcanzado el limite de {points} puntos. Tu cerebro necesita procesar todo lo aprendido, nos vemos manana.",
      emotion: "celebrating",
    },
  ],
};

const POST_TEST_HIGH: MessageTemplate[] = [
  {
    title: "Resultado excelente",
    body: "Un {score}% en {topic} — {correct_count} de {total_questions} correctas. Estas demostrando un dominio solido. Sigue asi y la plaza es tuya.",
    emotion: "celebrating",
    action: { label: "Seguir practicando", to: "/tests" },
  },
  {
    title: "Fantastico, {user_name}",
    body: "Has conseguido un {score}% en {topic}. Este nivel de preparacion es el que marca la diferencia en el examen real.",
    emotion: "happy",
    action: { label: "Otro test", to: "/tests" },
  },
];

const POST_TEST_MID: MessageTemplate[] = [
  {
    title: "Buen trabajo",
    body: "Un {score}% en {topic} — vas por buen camino. Repasa las {incorrect_count} preguntas que fallaste y veras como subes rapidamente.",
    emotion: "encouraging",
    action: { label: "Repasar fallos", to: "/tests" },
  },
  {
    title: "Progreso constante",
    body: "{correct_count} de {total_questions} correctas en {topic}. Cada intento te acerca mas. Revisa los errores y repite el test cuando estes lista.",
    emotion: "idle",
    action: { label: "Ver tests", to: "/tests" },
  },
];

const POST_TEST_LOW: MessageTemplate[] = [
  {
    title: "No te desanimes",
    body: "Un {score}% en {topic} es un punto de partida. Revisa las explicaciones de cada pregunta y vuelve a intentarlo. La persistencia es tu mejor arma.",
    emotion: "worried",
    action: { label: "Repasar tema", to: "/tests" },
  },
  {
    title: "A seguir intentando",
    body: "Este resultado en {topic} te muestra donde necesitas reforzar. Dedicale tiempo al repaso y veras como mejoras en el proximo intento.",
    emotion: "encouraging",
    action: { label: "Test de refuerzo", to: "/tests" },
  },
];

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
  if (score >= 80) return POST_TEST_HIGH;
  if (score >= 50) return POST_TEST_MID;
  return POST_TEST_LOW;
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
    const template = pick_random(TEMPLATES.app_entry);
    return build_message("app_entry", template, context);
  },

  get_post_test_message(context: CoachContext & { score: number }): CoachMessage {
    const templates = get_post_test_templates(context.score);
    const template = pick_random(templates);
    return build_message("post_test", template, context);
  },

  get_auto_test_message(context: CoachContext): CoachMessage {
    const template = pick_random(TEMPLATES.auto_generated_test);
    return build_message("auto_generated_test", template, context);
  },

  get_daily_limit_message(context: CoachContext): CoachMessage {
    const template = pick_random(TEMPLATES.daily_point_limit);
    return build_message("daily_point_limit", template, context);
  },
};
