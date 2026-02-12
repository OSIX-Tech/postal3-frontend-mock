import { useState } from "react";
import { Link } from "react-router-dom";
import { use_auth_store } from "@/stores/auth-store";
import {
  BookOpen,
  ArrowRight,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Shield,
  BarChart3,
  MessageCircle,
} from "lucide-react";

// ============================================
// LANDING (no autenticado)
// ============================================

function Landing() {
  return (
    <div>
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-background" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">
              Plataforma de preparación de oposiciones
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Tu preparación, medida y{" "}
              <span className="text-violet-600 dark:text-violet-400">respaldada por datos</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Practica con tests oficiales, analiza tu rendimiento por tema y compara tu progreso
              con otros opositores. Todo en un mismo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-7 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Crear cuenta
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-7 py-3 text-sm font-semibold text-foreground hover:border-border/80 hover:bg-muted transition-colors"
              >
                Acceder
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { value: "12.000+", label: "Preguntas oficiales" },
              { value: "5", label: "Oposiciones disponibles" },
              { value: "98%", label: "Precisión del contenido" },
              { value: "24/7", label: "Acceso sin restricciones" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-8 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Herramientas para aprobar
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Cada funcionalidad diseñada para que tu tiempo de estudio rinda al máximo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: "Tests por temas",
                description:
                  "Preguntas reales de convocatorias anteriores, organizadas por materia y dificultad.",
              },
              {
                icon: BarChart3,
                title: "Analítica de rendimiento",
                description:
                  "Visualiza tu evolución, identifica temas débiles y optimiza tu plan de estudio.",
              },
              {
                icon: TrendingUp,
                title: "Sistema ELO",
                description:
                  "Puntuación objetiva de tu nivel que se actualiza con cada test completado.",
              },
              {
                icon: Trophy,
                title: "Ligas semanales",
                description:
                  "Compite en tu categoría y sube de liga demostrando constancia y resultados.",
              },
              {
                icon: Shield,
                title: "Coach inteligente",
                description:
                  "Recomendaciones personalizadas basadas en tus errores y patrones de estudio.",
              },
              {
                icon: Flame,
                title: "Rachas y logros",
                description:
                  "Mantén la disciplina diaria con un sistema de rachas y badges por hitos.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border p-6 hover:border-border/80 transition-colors"
              >
                <f.icon className="w-5 h-5 text-violet-600 dark:text-violet-400 mb-4" />
                <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Empieza a prepararte hoy
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Accede a todos los tests y herramientas de seguimiento sin compromiso.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-7 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            Crear cuenta gratuita
          </Link>
        </div>
      </section>
    </div>
  );
}

// ============================================
// DASHBOARD (autenticado)
// ============================================

function CoachBubble() {
  const [open, set_open] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => set_open(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => set_open(false)}
      />

      {/* Bocadillo — sale desde abajo-derecha pegado al botón */}
      <div
        className={`fixed z-50 bottom-20 right-6 w-72 bg-card rounded-2xl shadow-xl border border-border p-5 transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-3 pointer-events-none"
        }`}
      >
        {/* Piquito / triangle */}
        <div className="absolute -bottom-2 right-5 w-4 h-4 bg-card border-r border-b border-border rotate-45" />

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-foreground">Tu coach</p>
        </div>

        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          Tu rendimiento en <b className="text-foreground">Ley 40/2015</b> está
          por debajo de tu media. Haz 2 tests de repaso esta semana.
        </p>

        <Link
          to="/tests"
          onClick={() => set_open(false)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Ir a repasar
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  );
}

const TESTS = [
  {
    title: "Constitución",
    questions: 30,
    best: "93%",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop",
  },
  {
    title: "Ley 39/2015",
    questions: 25,
    best: "88%",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop",
  },
  {
    title: "Ley 40/2015",
    questions: 25,
    best: "68%",
    img: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=300&h=200&fit=crop",
    review: true,
  },
  {
    title: "EBEP",
    questions: 20,
    best: "90%",
    img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=300&h=200&fit=crop",
  },
  {
    title: "Ley Presupuestaria",
    questions: 20,
    best: null,
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
  },
];

function Dashboard() {
  const { user } = use_auth_store();
  const first_name = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="max-w-5xl mx-auto px-5 pt-10 pb-20">

      {/* ── Hero banner con imagen ── */}
      <div className="relative rounded-3xl overflow-hidden mb-10">
        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=400&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-stone-900/40" />
        <div className="relative px-8 py-10 sm:py-12">
          <p className="text-stone-300 text-sm mb-1">Auxiliar Administrativo del Estado</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Hola, {first_name}
          </h1>
          <p className="text-stone-300 text-sm max-w-md leading-relaxed mb-6">
            Llevas <span className="text-white font-semibold">12 días</span> de racha
            y una precisión del <span className="text-white font-semibold">80%</span>.
            Sigue así.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/tests"
              className="inline-flex items-center gap-2 bg-white text-stone-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-stone-100 transition-colors"
            >
              Empezar test
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-4 text-sm text-stone-300">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> 80%
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> 1.250
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> #45
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tests: fila horizontal de cards pequeñas ── */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground dark:text-white">Tests disponibles</h2>
          <Link
            to="/tests"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-thin">
          {TESTS.map((test) => (
            <Link
              key={test.title}
              to="/tests"
              className="group flex-shrink-0 w-36 snap-start"
            >
              <div className="relative rounded-xl overflow-hidden mb-2">
                <img
                  src={test.img}
                  alt={test.title}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {test.review && (
                  <span className="absolute top-1.5 right-1.5 text-[10px] font-bold bg-white/90 dark:bg-black/70 text-orange-600 dark:text-orange-400 px-1.5 py-px rounded-md">
                    Repasar
                  </span>
                )}
                {test.best && (
                  <span className="absolute bottom-1.5 right-1.5 text-[10px] font-bold bg-black/50 text-white px-1.5 py-px rounded-md backdrop-blur-sm">
                    {test.best}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-foreground leading-tight truncate">
                {test.title}
              </p>
              <p className="text-[11px] text-muted-foreground">{test.questions} preguntas</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contenido principal: resultados + sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Últimos resultados */}
        <section className="lg:col-span-2">
          <h2 className="text-base font-bold mb-4 text-foreground dark:text-white">Últimos resultados</h2>
          <div className="space-y-2.5">
            {[
              {
                title: "Constitución Española",
                correct: 28,
                total: 30,
                when: "Hoy",
                img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=80&h=80&fit=crop",
              },
              {
                title: "Ley 39/2015",
                correct: 22,
                total: 25,
                when: "Ayer",
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=80&h=80&fit=crop",
              },
              {
                title: "EBEP",
                correct: 18,
                total: 20,
                when: "10 feb",
                img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=80&h=80&fit=crop",
              },
            ].map((r) => {
              const pct = Math.round((r.correct / r.total) * 100);
              return (
                <div
                  key={r.title + r.when}
                  className="flex items-center gap-3.5 rounded-xl bg-card border border-border p-3 shadow-sm"
                >
                  <img
                    src={r.img}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground truncate">{r.title}</span>
                      <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{r.when}</span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground tabular-nums">
                        {r.correct}/{r.total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sidebar: liga + stats */}
        <aside className="space-y-4">
          {/* Liga */}
          <div className="rounded-2xl overflow-hidden">
            <div className="relative h-24">
              <img
                src="https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=400&h=200&fit=crop"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-indigo-900/70" />
              <div className="relative flex items-center gap-2 px-4 pt-4">
                <Trophy className="w-5 h-5 text-amber-300" />
                <span className="font-bold text-white text-lg">Liga Plata</span>
                <span className="ml-auto text-sm text-indigo-200">#45</span>
              </div>
            </div>
            <div className="bg-card border border-t-0 border-border rounded-b-2xl px-4 py-4">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: "62%" }} />
              </div>
              <p className="text-xs text-muted-foreground">150 pts para Liga Oro</p>
            </div>
          </div>

          {/* Stats mini */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { value: "87", label: "Tests", icon: BookOpen },
              { value: "12d", label: "Racha", icon: Flame },
              { value: "80%", label: "Precisión", icon: Target },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-card border border-border shadow-sm p-3 text-center">
                <s.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
                <p className="text-base font-extrabold text-foreground tabular-nums leading-none">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

        </aside>
        <CoachBubble />
      </div>
    </div>
  );
}

// ============================================
// EXPORT
// ============================================

export function HomePage() {
  const { is_authenticated } = use_auth_store();

  return is_authenticated ? <Dashboard /> : <Landing />;
}
