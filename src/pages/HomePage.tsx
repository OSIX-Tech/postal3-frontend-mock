import { useEffect } from "react";
import { Link } from "react-router-dom";
import { use_auth_store } from "@/stores/auth-store";
import { use_coach } from "@/hooks/use-coach";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  ArrowRight,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Star,
  GraduationCap,
  Quote,
} from "lucide-react";

// ============================================
// LANDING — "Calm Authority" editorial style
// ============================================

const DOT_GRID = {
  backgroundImage: "radial-gradient(circle, oklch(0.75 0.01 285) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
} as const;

const DOT_GRID_DARK = "dark:[background-image:radial-gradient(circle,oklch(0.3_0.01_285)_1px,transparent_1px)]";

function Landing() {
  return (
    <div>
      {/* ═══════════════════════════════════════════
          HERO — Left-aligned, editorial, with mockup
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex items-center">
        {/* Dot grid background */}
        <div
          className={`absolute inset-0 -z-20 opacity-[0.35] dark:opacity-100 ${DOT_GRID_DARK}`}
          style={DOT_GRID}
        />
        {/* Gradient fade bottom */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent -z-10" />
        {/* Soft blush top-right */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-200/20 dark:bg-violet-900/10 blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 w-full py-20 sm:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* ── Left: Copy ── */}
            <div className="lg:col-span-5">
              <Badge
                variant="outline"
                className="mb-8 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1 gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                Oposiciones con gamificación
              </Badge>

              <h1 className="text-[2.6rem] sm:text-5xl xl:text-[3.4rem] font-extrabold text-foreground leading-[1.08] tracking-tight">
                Deja de estudiar
                <br />
                <span className="text-violet-600 dark:text-violet-400">a ciegas.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
                12.000 preguntas oficiales. Analítica por tema. Rachas diarias.
                Ligas competitivas. Un sistema diseñado para que
                {" "}<span className="text-foreground font-semibold">apruebes tu oposición</span>.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="h-11 px-6 rounded-xl font-bold btn-primary-glow" asChild>
                  <Link to="/register">
                    Empezar ahora
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="h-11 px-6 rounded-xl font-semibold text-muted-foreground" asChild>
                  <Link to="/login">Ya tengo cuenta</Link>
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground">
                {["12.000+ preguntas oficiales", "Analítica por tema", "Rachas y ligas"].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: Hero image ── */}
            <div className="lg:col-span-7 relative">
              <img
                src="/opo_friendly.png"
                alt="Preparación de oposiciones con Postal3"
                className="relative w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          METRICS STRIP
          ═══════════════════════════════════════════ */}
      <section className="border-y border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
            {[
              { value: "12.847", label: "Preguntas oficiales" },
              { value: "2.400+", label: "Opositoras activas" },
              { value: "85%", label: "Tasa de aprobados" },
              { value: "4,8★", label: "Satisfacción media" },
            ].map((s) => (
              <div key={s.label} className="py-8 sm:py-10 text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-foreground tabular-nums tracking-tight">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES — Bento grid
          ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-lg mb-16">
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Funcionalidades</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-[1.15]">
              Diseñado para que apruebes,
              <br className="hidden sm:block" />
              no para que estudies más.
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Tests — spans 4 cols */}
            <Card className="md:col-span-4 group border-border hover:border-violet-200 dark:hover:border-violet-800 transition-colors duration-300 overflow-hidden">
              <CardContent className="p-7 sm:p-8 flex flex-col h-full">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Tests oficiales por temas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  Preguntas reales de convocatorias anteriores, organizadas por materia y dificultad.
                  Practica exactamente lo que entra en tu examen.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {["Constitución", "Ley 39/2015", "EBEP", "Ley 40/2015", "Procedimiento"].map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ELO — spans 2 cols */}
            <Card className="md:col-span-2 group border-border hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors duration-300">
              <CardContent className="p-7 sm:p-8 flex flex-col h-full">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Sistema ELO</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rating objetivo que refleja tu nivel real con cada test que completas.
                </p>
                {/* Mini ELO visual */}
                <div className="mt-auto pt-5">
                  <div className="flex items-end gap-1 h-10">
                    {[30, 45, 38, 52, 60, 55, 72, 68, 80, 85, 78, 90].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-indigo-200 dark:bg-indigo-800/50 transition-all"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streaks — 2 cols */}
            <Card className="md:col-span-2 group border-border hover:border-orange-200 dark:hover:border-orange-800 transition-colors duration-300">
              <CardContent className="p-7 sm:p-8">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Rachas diarias</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Mantén el hábito con rachas, hitos y recompensas que te premian por la constancia.
                </p>
              </CardContent>
            </Card>

            {/* Analytics — 2 cols */}
            <Card className="md:col-span-2 group border-border hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors duration-300">
              <CardContent className="p-7 sm:p-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Analítica detallada</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Identifica temas débiles. Mide tu progreso. Optimiza tu plan de estudio con datos reales.
                </p>
              </CardContent>
            </Card>

            {/* Leagues — 2 cols */}
            <Card className="md:col-span-2 group border-border hover:border-amber-200 dark:hover:border-amber-800 transition-colors duration-300">
              <CardContent className="p-7 sm:p-8">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Ligas semanales</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compite con opositoras de tu nivel. Asciende de liga cada semana demostrando constancia.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — 3 steps, horizontal
          ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 border-y border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-lg mb-16">
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Cómo funciona</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              De cero a estudiar en 2 minutos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: GraduationCap,
                title: "Elige tu oposición",
                description: "Auxiliar, Administrativo, Tramitación, Auxilio Judicial o Correos. Selecciona y empezamos.",
              },
              {
                step: "02",
                icon: BookOpen,
                title: "Haz tests cada día",
                description: "Preguntas de exámenes reales. Respuestas explicadas. Marca las difíciles para repasar.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Mide y compite",
                description: "Analítica por tema, rating ELO, ligas semanales. Sabrás exactamente dónde estás.",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <span className="text-6xl sm:text-7xl font-extrabold text-muted/80 dark:text-muted leading-none select-none">
                  {s.step}
                </span>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — 1 featured + 2 supporting
          ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-lg mb-16">
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Testimonios</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Lo que dicen nuestras opositoras
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured testimonial */}
            <Card className="lg:col-span-3 border-violet-200 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-950/20">
              <CardContent className="p-8 sm:p-10">
                <Quote className="w-8 h-8 text-violet-300 dark:text-violet-700 mb-4" />
                <p className="text-lg sm:text-xl text-foreground leading-relaxed font-medium mb-8">
                  Las rachas me han cambiado la forma de estudiar. Antes dejaba de preparar
                  a los pocos días. Ahora llevo 45 días seguidos sin fallar. La analítica me
                  mostró que fallaba siempre en Procedimiento Administrativo — enfoqué ahí
                  el repaso y subí un 20% en un mes.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-200 dark:bg-violet-800 flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-700 dark:text-violet-300">LM</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Laura Martínez</p>
                    <p className="text-xs text-muted-foreground">Auxiliar Administrativo — aprobó en 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supporting testimonials */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {[
                {
                  text: "El sistema de ligas me motiva muchísimo. Competir con otras opositoras hace que estudiar sea mucho menos aburrido. He subido a Oro en 3 semanas.",
                  name: "Carmen Rodríguez",
                  initials: "CR",
                  role: "Tramitación Procesal",
                },
                {
                  text: "La clave para mí fue la analítica. Descubrí que fallaba siempre los mismos temas. Enfoqué el repaso y aprobé a la primera convocatoria.",
                  name: "Ana García",
                  initials: "AG",
                  role: "Administrativo del Estado",
                },
              ].map((t) => (
                <Card key={t.name} className="flex-1 border-border">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed flex-1">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-border">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-[10px] font-bold text-muted-foreground">{t.initials}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 border-y border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: heading */}
            <div className="lg:col-span-2">
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                Preguntas
                <br />
                frecuentes
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                Si tienes otra duda, escríbenos a{" "}
                <span className="text-foreground font-semibold">hola@postal3.es</span>
              </p>
            </div>

            {/* Right: accordion */}
            <div className="lg:col-span-3">
              <Accordion type="single" collapsible className="space-y-2">
                {[
                  {
                    q: "¿Cuánto cuesta?",
                    a: "Consulta los planes disponibles en nuestra web. Ofrecemos diferentes opciones para que elijas la que mejor se adapte a ti.",
                  },
                  {
                    q: "¿Qué oposiciones están disponibles?",
                    a: "Auxiliar Administrativo del Estado, Administrativo del Estado, Tramitación Procesal, Auxilio Judicial y Correos y Telégrafos.",
                  },
                  {
                    q: "¿Las preguntas son de exámenes reales?",
                    a: "Sí. El banco de preguntas está formado por preguntas de convocatorias oficiales anteriores, revisadas y actualizadas por nuestro equipo.",
                  },
                  {
                    q: "¿Cómo funciona el sistema de ligas?",
                    a: "Cada semana compites con opositoras de tu nivel. Las mejores ascienden (Bronce → Plata → Oro → Diamante) y las que menos practican descienden.",
                  },
                  {
                    q: "¿Funciona en el móvil?",
                    a: "Sí. La plataforma es 100% responsive y funciona en cualquier dispositivo con navegador web.",
                  },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-5">
                    <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA — Dark violet block
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-950 dark:bg-stone-950" />
        {/* Subtle dot grid on dark */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, #a78bfa 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Violet glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-[120px]" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Tu plaza te está esperando.
          </h2>
          <p className="text-base sm:text-lg text-stone-400 mb-10 max-w-lg mx-auto leading-relaxed">
            Cada día que no estudias es un día que te aleja de tu objetivo.
            Empieza ahora y únete a miles de opositoras que ya confían en Postal3.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-bold shadow-xl shadow-white/10 text-sm"
              asChild
            >
              <Link to="/register">
                Crear cuenta
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-xl border-stone-700 text-stone-300 hover:bg-stone-800/50 hover:text-white font-semibold text-sm"
              asChild
            >
              <Link to="/login">
                Acceder a mi cuenta
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// DASHBOARD (autenticado)
// ============================================

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
  const { trigger_app_entry } = use_coach();
  const first_name = user?.name?.split(" ")[0] ?? "";

  useEffect(() => {
    const timer = setTimeout(() => trigger_app_entry(), 1500);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
