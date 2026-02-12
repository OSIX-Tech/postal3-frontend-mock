import type {
  Test,
  TestAttempt,
  TestResult,
  Question,
  TestFilters,
  PaginatedResponse,
  QuestionAttempt,
} from "@/types/test";

// ============================================
// MOCK DATA
// ============================================

const mock_tests: Test[] = [
  {
    id: 1,
    name: "Constitución Española 2024",
    description:
      "Test completo sobre la Constitución Española. Incluye todos los títulos y disposiciones adicionales.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
    status: "pending",
    question_count: 50,
    available_time: 60, // 60 minutes
    kind: { id: 1, name: "Constitución" },
    author: "Postal3 Academia",
    stats: {
      attempt_count: 1250,
      passed_count: 890,
      failed_count: 360,
      max_points: 100,
      own_max_points: 0,
    },
  },
  {
    id: 2,
    name: "Ley 39/2015 - Procedimiento Administrativo",
    description:
      "Test sobre la Ley del Procedimiento Administrativo Común de las Administraciones Públicas.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400",
    status: "passed",
    question_count: 30,
    available_time: 30, // 30 minutes
    kind: { id: 2, name: "Procedimiento" },
    author: "Postal3 Academia",
    stats: {
      attempt_count: 980,
      passed_count: 650,
      failed_count: 330,
      max_points: 100,
      own_max_points: 82,
    },
  },
  {
    id: 3,
    name: "Estatuto Básico del Empleado Público",
    description:
      "EBEP - Real Decreto Legislativo 5/2015. Test de entrenamiento con retroalimentación inmediata.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    status: "failed",
    question_count: 25,
    available_time: 25, // 25 minutes
    kind: { id: 3, name: "EBEP" },
    training: "Entrenamiento",
    author: "Prof. García",
    stats: {
      attempt_count: 456,
      passed_count: 280,
      failed_count: 176,
      max_points: 100,
      own_max_points: 45,
    },
  },
  {
    id: 4,
    name: "Ley 40/2015 - Régimen Jurídico del Sector Público",
    description:
      "Test completo sobre organización y funcionamiento del sector público.",
    status: "pending",
    question_count: 40,
    available_time: 40, // 40 minutes
    kind: { id: 4, name: "Sector Público" },
    stats: {
      attempt_count: 720,
      passed_count: 480,
      failed_count: 240,
      max_points: 100,
      own_max_points: 0,
    },
  },
  {
    id: 5,
    name: "Derecho Administrativo - Básico",
    description: "Conceptos fundamentales del derecho administrativo español.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400",
    status: "passed",
    question_count: 20,
    available_time: 20, // 20 minutes
    kind: { id: 5, name: "Derecho Admin." },
    training: "Entrenamiento",
    stats: {
      attempt_count: 2100,
      passed_count: 1680,
      failed_count: 420,
      max_points: 100,
      own_max_points: 95,
    },
  },
];

const generate_mock_questions = (test_id: number, count: number): Question[] => {
  const questions: Question[] = [];

  const sample_questions = [
    {
      name: "¿Cuál es el artículo de la Constitución que garantiza el derecho a la educación?",
      answers: [
        { id: 1, name: "Artículo 25" },
        { id: 2, name: "Artículo 27" },
        { id: 3, name: "Artículo 29" },
        { id: 4, name: "Artículo 31" },
      ],
      correct_id: 2,
      justification:
        "El artículo 27 de la Constitución Española reconoce el derecho a la educación y la libertad de enseñanza.",
    },
    {
      name: "El plazo máximo para resolver y notificar en un procedimiento administrativo es de:",
      answers: [
        { id: 1, name: "Un mes" },
        { id: 2, name: "Tres meses" },
        { id: 3, name: "Seis meses" },
        { id: 4, name: "Un año" },
      ],
      correct_id: 2,
      justification:
        "Según la Ley 39/2015, el plazo máximo legal es de tres meses, salvo que una norma con rango de ley establezca otro diferente.",
    },
    {
      name: "¿Quién tiene la iniciativa para la reforma constitucional según el art. 166 CE?",
      answers: [
        { id: 1, name: "Solo el Gobierno" },
        { id: 2, name: "Solo el Congreso y el Senado" },
        { id: 3, name: "El Gobierno, el Congreso, el Senado y las Asambleas de las CCAA" },
        { id: 4, name: "Cualquier ciudadano mediante iniciativa popular" },
      ],
      correct_id: 3,
      justification:
        "El artículo 166 CE remite a los términos del art. 87.1 y 2, por lo que tienen iniciativa de reforma: el Gobierno, el Congreso, el Senado y las Asambleas de las Comunidades Autónomas.",
    },
    {
      name: "El silencio administrativo negativo se produce cuando:",
      answers: [
        { id: 1, name: "La Administración resuelve expresamente denegando la solicitud" },
        { id: 2, name: "Transcurre el plazo sin resolución expresa y la ley no establece el sentido del silencio" },
        { id: 3, name: "Transcurre el plazo sin resolución expresa y la ley establece efectos desestimatorios" },
        { id: 4, name: "El interesado desiste de su solicitud" },
      ],
      correct_id: 3,
      justification:
        "El silencio administrativo negativo se produce cuando, transcurrido el plazo máximo sin notificación de resolución expresa, una norma con rango de ley atribuye efectos desestimatorios al silencio.",
    },
    {
      name: "¿Cuál es la duración máxima del mandato del Defensor del Pueblo?",
      answers: [
        { id: 1, name: "4 años" },
        { id: 2, name: "5 años" },
        { id: 3, name: "6 años" },
        { id: 4, name: "8 años" },
      ],
      correct_id: 2,
      justification:
        "Según la Ley Orgánica 3/1981, el Defensor del Pueblo es elegido por un período de cinco años.",
    },
    {
      name: "Los actos administrativos que pongan fin a la vía administrativa podrán ser recurridos:",
      answers: [
        { id: 1, name: "Solo mediante recurso de alzada" },
        { id: 2, name: "Mediante recurso potestativo de reposición o directamente ante la jurisdicción contencioso-administrativa" },
        { id: 3, name: "Solo mediante recurso extraordinario de revisión" },
        { id: 4, name: "No son recurribles" },
      ],
      correct_id: 2,
      justification:
        "Según el art. 123 de la Ley 39/2015, los actos que pongan fin a la vía administrativa pueden ser recurridos potestativamente en reposición o ser impugnados directamente ante el orden jurisdiccional contencioso-administrativo.",
    },
    {
      name: "¿Qué mayoría se requiere para la aprobación de una Ley Orgánica?",
      answers: [
        { id: 1, name: "Mayoría simple del Congreso" },
        { id: 2, name: "Mayoría absoluta del Congreso en votación final sobre el conjunto del proyecto" },
        { id: 3, name: "Mayoría de dos tercios de ambas Cámaras" },
        { id: 4, name: "Mayoría absoluta del Senado" },
      ],
      correct_id: 2,
      justification:
        "El artículo 81.2 de la Constitución establece que la aprobación, modificación o derogación de las leyes orgánicas exigirá mayoría absoluta del Congreso en una votación final sobre el conjunto del proyecto.",
    },
    {
      name: "El principio de jerarquía normativa implica que:",
      answers: [
        { id: 1, name: "Todas las normas tienen el mismo rango" },
        { id: 2, name: "Las normas de rango inferior no pueden contradecir a las de rango superior" },
        { id: 3, name: "Solo las leyes tienen fuerza normativa" },
        { id: 4, name: "Los reglamentos prevalecen sobre las leyes" },
      ],
      correct_id: 2,
      justification:
        "El principio de jerarquía normativa, reconocido en el art. 9.3 CE, establece que las normas de rango inferior no pueden contradecir a las de rango superior, garantizando la coherencia del ordenamiento jurídico.",
    },
  ];

  for (let i = 0; i < count; i++) {
    const template = sample_questions[i % sample_questions.length];
    const base_answer_id = test_id * 1000 + i * 10;

    const question: Question = {
      id: test_id * 100 + i + 1,
      index: i + 1,
      name: template.name,
      answers: template.answers.map((a, idx) => ({
        id: base_answer_id + idx + 1,
        name: a.name,
        is_correct: a.id === template.correct_id,
      })),
      justification: template.justification,
      is_official: i % 3 === 0,
      is_obsolete: false,
    };
    questions.push(question);
  }

  return questions;
};

// ============================================
// DELAY HELPER
// ============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// MOCK SERVICE
// ============================================

const mock_test_service = {
  async list_tests(
    filters?: TestFilters,
    page = 1,
    per_page = 12
  ): Promise<PaginatedResponse<Test>> {
    await delay(300);

    let filtered = [...mock_tests];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
      );
    }

    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters?.kind_id) {
      filtered = filtered.filter((t) => t.kind?.id === Number(filters.kind_id));
    }

    if (filters?.training !== undefined) {
      filtered = filtered.filter((t) => (filters.training ? !!t.training : !t.training));
    }

    // Sorting
    if (filters?.sort_by) {
      filtered.sort((a, b) => {
        const order = filters.sort_order === "desc" ? -1 : 1;
        if (filters.sort_by === "name") {
          return a.name.localeCompare(b.name) * order;
        }
        if (filters.sort_by === "question_count") {
          return (a.question_count - b.question_count) * order;
        }
        return 0;
      });
    }

    const total = filtered.length;
    const start = (page - 1) * per_page;
    const data = filtered.slice(start, start + per_page);

    return {
      data,
      total,
      page,
      per_page,
      total_pages: Math.ceil(total / per_page),
    };
  },

  async get_test(id: number): Promise<Test | null> {
    await delay(200);
    return mock_tests.find((t) => t.id === id) || null;
  },

  async start_test(test_id: number): Promise<TestAttempt> {
    await delay(400);

    const test = mock_tests.find((t) => t.id === test_id);
    if (!test) {
      throw new Error("Test not found");
    }

    const questions = generate_mock_questions(test_id, test.question_count);

    return {
      id: `attempt-${Date.now()}`,
      test_id,
      test,
      questions,
      answers: questions.map((q) => ({
        question_id: q.id,
        selected_answer_id: null,
        action: "none",
        flagged_for_review: false,
        time_spent: 0,
      })),
      started_at: new Date().toISOString(),
      elapsed_time: 0,
      is_paused: false,
      status: "in_progress",
    };
  },

  async save_answer(
    attempt_id: string,
    question_id: number,
    answer: Partial<QuestionAttempt>
  ): Promise<void> {
    await delay(50);
    // In mock, this does nothing but simulate network delay
    console.log(`[Mock] Saved answer for ${attempt_id}/${question_id}:`, answer);
  },

  async finish_test(
    attempt_id: string,
    answers: QuestionAttempt[],
    elapsed_time: number
  ): Promise<TestResult> {
    await delay(500);

    // Extract test_id from attempt_id (mock format: attempt-timestamp)
    // In real implementation, we'd fetch the attempt from backend
    const test_id = 1; // Default to first test for mock
    const test = mock_tests.find((t) => t.id === test_id);
    const questions = generate_mock_questions(test_id, test?.question_count || 10);

    let correct_count = 0;
    let incorrect_count = 0;
    let unanswered_count = 0;

    const question_results = questions.map((q) => {
      const attempt = answers.find((a) => a.question_id === q.id);
      const correct_answer = q.answers.find((a) => a.is_correct);
      const is_correct = attempt?.selected_answer_id === correct_answer?.id;

      if (!attempt?.selected_answer_id) {
        unanswered_count++;
      } else if (is_correct) {
        correct_count++;
      } else {
        incorrect_count++;
      }

      return {
        question_id: q.id,
        question: q,
        selected_answer_id: attempt?.selected_answer_id || null,
        correct_answer_id: correct_answer?.id || 0,
        is_correct,
        state: !attempt?.selected_answer_id
          ? "unanswered"
          : is_correct
            ? "correct"
            : "incorrect",
      } as const;
    });

    const score = Math.round((correct_count / questions.length) * 100);
    const passed = score >= 60;

    // Generate gamification mock data
    const base_points = correct_count * 10;
    const speed_bonus = elapsed_time < 1800 ? 25 : 0;
    const accuracy_bonus = score >= 80 ? 50 : score >= 60 ? 20 : 0;
    const streak_count = 5;

    const points_breakdown = [
      { label: "Respuestas correctas", points: base_points },
      { label: "Bonus velocidad", points: speed_bonus },
      { label: "Bonus precisión", points: accuracy_bonus },
    ].filter((b) => b.points > 0);

    const coach_message = score >= 80
      ? "¡Excelente trabajo! Dominas este tema con soltura. Sigue así y prueba un test de nivel avanzado."
      : score >= 50
        ? "¡Buen esfuerzo! Vas por buen camino. Repasa las preguntas falladas y vuelve a intentarlo."
        : "No te desanimes, cada intento cuenta. Te recomiendo repasar el temario y hacer un test de refuerzo.";

    return {
      attempt_id,
      test_id,
      test_name: test?.name || "Test",
      total_questions: questions.length,
      correct_count,
      incorrect_count,
      unanswered_count,
      score,
      passed,
      average_score: 62,
      time_spent: elapsed_time,
      questions: question_results,
      completed_at: new Date().toISOString(),
      gamification: {
        points_earned: points_breakdown.reduce((sum, b) => sum + b.points, 0),
        points_breakdown,
        coins_earned: passed ? 3 : 1,
        streak_count,
        streak_is_new_record: streak_count >= 5,
        first_test_today_bonus: true,
      },
      coach_message,
    };
  },

  async get_result(attempt_id: string): Promise<TestResult | null> {
    await delay(300);
    // In mock, generate a sample result
    return this.finish_test(attempt_id, [], 1800);
  },
};

// ============================================
// EXPORT
// ============================================

export const test_service = mock_test_service;
