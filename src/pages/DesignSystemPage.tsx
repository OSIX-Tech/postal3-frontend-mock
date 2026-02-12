import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputWithIcon } from '@/components/ui/input-with-icon'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

// Docs Components
import {
  CodeBlock,
  ComponentShowcase,
  ColorSwatch,
  ColorPalette,
  SemanticColor,
  SpacingScale,
  SpacingGridDemo,
  ElevationScale,
  ShadowDemo,
  BorderRadiusScale,
  BorderRadiusUsage,
  DurationDemo,
  EasingDemo,
  TransitionExample,
  AnimationDemo,
  BreakpointTable,
  ResponsiveExample,
  IconGallery,
  ThemeSwitcher,
  PropsTable,
  AccessibilityNote,
  KeyboardShortcutsTable,
  WCAGBadge,
  DosDonts,
  Guideline,
} from '@/components/docs'

// Feedback Components
import { EmptyState, ErrorState, SuccessState, LoadingState } from '@/components/feedback'

// Test Components
import { TestCard } from '@/components/tests/TestCard'
import { QuestionCard } from '@/components/tests/QuestionCard'
import { TestStatusBar } from '@/components/tests/TestStatusBar'

// Icons
import {
  AlertCircle, Check, X, Star, Search, Mail, Eye, EyeOff,
  User, Lock, BookOpen, ChevronDown, MoreHorizontal, Settings,
  LogOut, Palette, Accessibility, Paintbrush, Zap, Component, FileText,
  LayoutGrid, Package
} from 'lucide-react'
import { toast } from 'sonner'

// ============================================
// DATOS DE EJEMPLO
// ============================================

const MOCK_TEST = {
  id: 1,
  name: 'Test de Constitución Española',
  description: 'Test completo sobre los artículos fundamentales de la Constitución',
  image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
  status: 'pending' as const,
  training: 'Auxiliar Administrativo',
  author: 'Prof. García',
  question_count: 50,
  available_time: 60,
  kind: { name: 'Oficial' },
  stats: {
    attempt_count: 5,
    passed_count: 3,
    failed_count: 2,
    max_points: 100,
    own_max_points: 85,
  },
}

const MOCK_TEST_NEW = {
  id: 2,
  name: 'Derecho Administrativo: Procedimiento',
  description: 'Ley 39/2015 del Procedimiento Administrativo Común',
  image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
  training: 'Gestión Procesal',
  author: 'Prof. Martínez',
  question_count: 30,
  available_time: 45,
  kind: { name: 'Práctica' },
}

const MOCK_QUESTION = {
  id: 1,
  index: 1,
  name: '¿Cuál es el artículo de la Constitución Española que establece que España se constituye en un Estado social y democrático de Derecho?',
  preamble: 'Según la Constitución Española de 1978:',
  description: 'El artículo 1.1 establece los valores superiores del ordenamiento jurídico español.',
  answers: [
    { id: 1, name: 'Artículo 1', is_correct: true },
    { id: 2, name: 'Artículo 2', is_correct: false },
    { id: 3, name: 'Artículo 3', is_correct: false },
    { id: 4, name: 'Artículo 4', is_correct: false },
  ],
}

// ============================================
// NAVEGACIÓN
// ============================================

const NAV_SECTIONS = [
  {
    title: 'Fundamentos',
    icon: Palette,
    items: [
      { id: 'colors', label: 'Colores' },
      { id: 'typography', label: 'Tipografía' },
      { id: 'spacing', label: 'Espaciado' },
      { id: 'elevation', label: 'Elevación' },
      { id: 'radius', label: 'Bordes' },
      { id: 'motion', label: 'Animaciones' },
      { id: 'breakpoints', label: 'Breakpoints' },
      { id: 'icons', label: 'Iconos' },
    ],
  },
  {
    title: 'Componentes',
    icon: Component,
    items: [
      { id: 'buttons', label: 'Botones' },
      { id: 'inputs', label: 'Inputs' },
      { id: 'selects', label: 'Selects' },
      { id: 'checkboxes', label: 'Checkboxes y Radio' },
      { id: 'cards', label: 'Cards' },
      { id: 'badges', label: 'Badges' },
      { id: 'avatars', label: 'Avatares' },
      { id: 'dialogs', label: 'Diálogos' },
      { id: 'dropdowns', label: 'Menús desplegables' },
      { id: 'tooltips', label: 'Tooltips' },
      { id: 'accordions', label: 'Acordeones' },
      { id: 'sheets', label: 'Sheets' },
      { id: 'tables', label: 'Tablas' },
      { id: 'alerts', label: 'Alertas' },
      { id: 'toasts', label: 'Toasts' },
    ],
  },
  {
    title: 'Feedback',
    icon: Zap,
    items: [
      { id: 'feedback', label: 'Estados de feedback' },
      { id: 'loading', label: 'Carga' },
    ],
  },
  {
    title: 'Componentes de Test',
    icon: FileText,
    items: [
      { id: 'tests', label: 'Componentes de Test' },
    ],
  },
  {
    title: 'Patrones',
    icon: LayoutGrid,
    items: [
      { id: 'patterns-forms', label: 'Patrones de formulario' },
      { id: 'patterns-empty', label: 'Estados vacíos' },
    ],
  },
  {
    title: 'Accesibilidad',
    icon: Accessibility,
    items: [
      { id: 'a11y', label: 'Accesibilidad' },
    ],
  },
  {
    title: 'Temas',
    icon: Paintbrush,
    items: [
      { id: 'theming', label: 'Personalización' },
    ],
  },
]

// ============================================
// COMPONENTES DE SECCIÓN
// ============================================

function Section({ id, title, description, children }: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-3xl">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

function Subsection({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function DesignSystemPage() {
  const { theme } = useTheme()
  const [show_status_bar, set_show_status_bar] = useState(false)
  const [selected_answer, set_selected_answer] = useState<number | null>(null)
  const [show_password, set_show_password] = useState(false)
  const [active_section, set_active_section] = useState('colors')
  const [mounted, set_mounted] = useState(false)

  // Evitar errores de hidratación
  useEffect(() => {
    set_mounted(true)
  }, [])

  // Scroll spy
  useEffect(() => {
    const all_ids = NAV_SECTIONS.flatMap(s => s.items.map(i => i.id))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            set_active_section(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    all_ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sistema de Diseño</h1>
            <p className="text-muted-foreground mt-1">
              Componentes UI y tokens de diseño de Postal3
            </p>
          </div>
          <div className="flex items-center gap-3">
            {mounted && <ThemeSwitcher />}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Navegación lateral */}
          <nav className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              {NAV_SECTIONS.map((section) => {
                const Icon = section.icon
                return (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 px-3 mb-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {section.title}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {section.items.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            active_section === item.id
                              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                              active_section === item.id
                                ? 'bg-violet-600 dark:bg-violet-400'
                                : 'bg-transparent'
                            }`}
                          />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Contenido principal */}
          <main className="flex-1 space-y-20 min-w-0">

            {/* ============================================ */}
            {/* FUNDAMENTOS */}
            {/* ============================================ */}

            {/* Colores */}
            <Section
              id="colors"
              title="Colores"
              description="Nuestro sistema de colores está basado en una paleta violeta primaria con colores semánticos para estados y feedback."
            >
              <Subsection title="Colores de Marca">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ColorSwatch name="Primario" value="#8B5CF6" css_variable="--color-brand-primary" />
                  <ColorSwatch name="Primario Hover" value="#7C3AED" css_variable="--color-brand-primary-hover" />
                  <ColorSwatch name="Secundario" value="#A78BFA" css_variable="--color-brand-secondary" />
                  <ColorSwatch name="Acento" value="#C4B5FD" css_variable="--color-brand-accent" />
                </div>
              </Subsection>

              <Subsection title="Colores de Estado de Test">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SemanticColor
                    name="Correcto"
                    description="Respuestas marcadas como correctas"
                    value="#10B981"
                    css_variable="--color-test-correct"
                    usage="Respuestas correctas, tests aprobados"
                  />
                  <SemanticColor
                    name="Incorrecto"
                    description="Respuestas marcadas como incorrectas"
                    value="#F43F5E"
                    css_variable="--color-test-incorrect"
                    usage="Respuestas erróneas, tests suspendidos"
                  />
                  <SemanticColor
                    name="Sin responder"
                    description="Preguntas sin contestar"
                    value="#6366F1"
                    css_variable="--color-test-unanswered"
                    usage="Preguntas pendientes"
                  />
                  <SemanticColor
                    name="Puntuación"
                    description="Puntos y logros"
                    value="#F59E0B"
                    css_variable="--color-test-star"
                    usage="Puntuaciones, valoraciones, estrellas"
                  />
                </div>
              </Subsection>

              <Subsection title="Colores Semánticos">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ColorSwatch name="Éxito" value="#10B981" css_variable="--color-success" />
                  <ColorSwatch name="Advertencia" value="#F59E0B" css_variable="--color-warning" />
                  <ColorSwatch name="Error" value="#EF4444" css_variable="--color-error" />
                  <ColorSwatch name="Información" value="#3B82F6" css_variable="--color-info" />
                </div>
              </Subsection>

              <Subsection title="Escala de Grises (Cálidos)">
                <ColorPalette
                  name="gray"
                  colors={[
                    { shade: '50', value: '#FAFAF9', css_variable: '--color-gray-50' },
                    { shade: '100', value: '#F5F5F4', css_variable: '--color-gray-100' },
                    { shade: '200', value: '#E7E5E4', css_variable: '--color-gray-200' },
                    { shade: '300', value: '#D6D3D1', css_variable: '--color-gray-300' },
                    { shade: '400', value: '#A8A29E', css_variable: '--color-gray-400' },
                    { shade: '500', value: '#78716C', css_variable: '--color-gray-500' },
                    { shade: '600', value: '#57534E', css_variable: '--color-gray-600' },
                    { shade: '700', value: '#44403C', css_variable: '--color-gray-700' },
                    { shade: '800', value: '#292524', css_variable: '--color-gray-800' },
                    { shade: '900', value: '#1C1917', css_variable: '--color-gray-900' },
                  ]}
                />
              </Subsection>

              <Subsection title="Escala Violeta">
                <ColorPalette
                  name="violet"
                  colors={[
                    { shade: '50', value: '#F5F3FF' },
                    { shade: '100', value: '#EDE9FE' },
                    { shade: '200', value: '#DDD6FE' },
                    { shade: '300', value: '#C4B5FD' },
                    { shade: '400', value: '#A78BFA' },
                    { shade: '500', value: '#8B5CF6' },
                    { shade: '600', value: '#7C3AED' },
                    { shade: '700', value: '#6D28D9' },
                    { shade: '800', value: '#5B21B6' },
                    { shade: '900', value: '#4C1D95' },
                  ]}
                />
              </Subsection>
            </Section>

            {/* Tipografía */}
            <Section
              id="typography"
              title="Tipografía"
              description="Nunito es nuestra familia tipográfica principal, proporcionando una experiencia amigable y legible."
            >
              <Subsection title="Familia Tipográfica">
                <div className="p-6 rounded-lg border bg-card">
                  <p className="text-4xl font-bold mb-2">Nunito</p>
                  <p className="text-muted-foreground">Fuente principal para títulos y texto</p>
                  <code className="text-sm text-muted-foreground mt-2 block">
                    font-family: 'Nunito', system-ui, sans-serif
                  </code>
                </div>
              </Subsection>

              <Subsection title="Escala Tipográfica">
                <div className="space-y-4 p-6 rounded-lg border bg-card">
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-5xl font-bold">Display</p>
                    <code className="text-sm text-muted-foreground">text-5xl / 48px</code>
                  </div>
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-4xl font-bold">Título 1</p>
                    <code className="text-sm text-muted-foreground">text-4xl / 36px</code>
                  </div>
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-3xl font-semibold">Título 2</p>
                    <code className="text-sm text-muted-foreground">text-3xl / 30px</code>
                  </div>
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-2xl font-semibold">Título 3</p>
                    <code className="text-sm text-muted-foreground">text-2xl / 24px</code>
                  </div>
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-xl font-medium">Título 4</p>
                    <code className="text-sm text-muted-foreground">text-xl / 20px</code>
                  </div>
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-lg">Texto grande</p>
                    <code className="text-sm text-muted-foreground">text-lg / 18px</code>
                  </div>
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-base">Texto normal</p>
                    <code className="text-sm text-muted-foreground">text-base / 16px</code>
                  </div>
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <p className="text-sm text-muted-foreground">Texto pequeño</p>
                    <code className="text-sm text-muted-foreground">text-sm / 14px</code>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs text-muted-foreground">Leyenda</p>
                    <code className="text-sm text-muted-foreground">text-xs / 12px</code>
                  </div>
                </div>
              </Subsection>

              <Subsection title="Pesos de Fuente">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { weight: 'font-normal', label: 'Normal', value: '400' },
                    { weight: 'font-medium', label: 'Medio', value: '500' },
                    { weight: 'font-semibold', label: 'Seminegrita', value: '600' },
                    { weight: 'font-bold', label: 'Negrita', value: '700' },
                  ].map((w) => (
                    <div key={w.weight} className="p-4 rounded-lg border bg-card">
                      <p className={`text-2xl ${w.weight}`}>Aa</p>
                      <p className="text-sm font-medium mt-2">{w.label}</p>
                      <code className="text-xs text-muted-foreground">{w.weight} ({w.value})</code>
                    </div>
                  ))}
                </div>
              </Subsection>
            </Section>

            {/* Espaciado */}
            <Section
              id="spacing"
              title="Espaciado"
              description="Espaciado consistente usando un sistema de 8 puntos para armonía visual."
            >
              <Subsection title="Escala de Espaciado">
                <SpacingScale
                  items={[
                    { name: '0', value: '0', pixels: 0 },
                    { name: '0.5', value: '0.125rem', pixels: 2 },
                    { name: '1', value: '0.25rem', pixels: 4 },
                    { name: '2', value: '0.5rem', pixels: 8 },
                    { name: '3', value: '0.75rem', pixels: 12 },
                    { name: '4', value: '1rem', pixels: 16 },
                    { name: '5', value: '1.25rem', pixels: 20 },
                    { name: '6', value: '1.5rem', pixels: 24 },
                    { name: '8', value: '2rem', pixels: 32 },
                    { name: '10', value: '2.5rem', pixels: 40 },
                    { name: '12', value: '3rem', pixels: 48 },
                    { name: '16', value: '4rem', pixels: 64 },
                    { name: '20', value: '5rem', pixels: 80 },
                    { name: '24', value: '6rem', pixels: 96 },
                  ]}
                />
              </Subsection>

              <Subsection title="Ejemplos de Padding">
                <SpacingGridDemo />
              </Subsection>
            </Section>

            {/* Elevación */}
            <Section
              id="elevation"
              title="Elevación y Sombras"
              description="Las sombras crean jerarquía visual y ayudan a los usuarios a entender la relación entre componentes."
            >
              <Subsection title="Niveles de Elevación">
                <ElevationScale />
              </Subsection>

              <Subsection title="Sistema de Sombras">
                <ShadowDemo />
              </Subsection>
            </Section>

            {/* Border Radius */}
            <Section
              id="radius"
              title="Bordes Redondeados"
              description="Redondeo de esquinas consistente para un lenguaje visual cohesivo."
            >
              <Subsection title="Escala de Bordes">
                <BorderRadiusScale />
              </Subsection>

              <Subsection title="Uso por Elemento">
                <BorderRadiusUsage />
              </Subsection>
            </Section>

            {/* Animaciones */}
            <Section
              id="motion"
              title="Animaciones y Transiciones"
              description="Diseño de movimiento cuidadoso que proporciona feedback sin ser distractor."
            >
              <Subsection title="Escala de Duración">
                <DurationDemo />
              </Subsection>

              <Subsection title="Funciones de Easing">
                <EasingDemo />
              </Subsection>

              <Subsection title="Ejemplos de Transiciones">
                <TransitionExample />
              </Subsection>

              <Subsection title="Animaciones Incorporadas">
                <AnimationDemo />
              </Subsection>
            </Section>

            {/* Breakpoints */}
            <Section
              id="breakpoints"
              title="Breakpoints"
              description="Diseño responsive mobile-first con el sistema de breakpoints de Tailwind."
            >
              <Subsection title="Referencia de Breakpoints">
                <BreakpointTable />
              </Subsection>

              <Subsection title="Ejemplo de Grid Responsive">
                <ResponsiveExample />
              </Subsection>
            </Section>

            {/* Iconos */}
            <Section
              id="icons"
              title="Iconos"
              description="Los iconos de Lucide React proporcionan un sistema de iconos consistente y accesible."
            >
              <Subsection title="Galería de Iconos">
                <IconGallery searchable show_sizes columns={8} />
              </Subsection>
            </Section>

            {/* ============================================ */}
            {/* COMPONENTES */}
            {/* ============================================ */}

            {/* Botones */}
            <Section id="buttons" title="Botones">
              <Subsection title="Variantes">
                <div className="flex flex-wrap gap-3">
                  <Button>Primario</Button>
                  <Button variant="secondary">Secundario</Button>
                  <Button variant="destructive">Destructivo</Button>
                  <Button variant="outline">Contorno</Button>
                  <Button variant="ghost">Fantasma</Button>
                  <Button variant="link">Enlace</Button>
                </div>
              </Subsection>

              <Subsection title="Tamaños">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Pequeño</Button>
                  <Button size="default">Normal</Button>
                  <Button size="lg">Grande</Button>
                  <Button size="icon"><Settings className="w-4 h-4" /></Button>
                </div>
              </Subsection>

              <Subsection title="Estados">
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Deshabilitado</Button>
                  <Button className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Con icono
                  </Button>
                </div>
              </Subsection>

              <ComponentShowcase
                title="Botón"
                description="Botón de acción principal con diferentes variantes"
                code={`import { Button } from '@/components/ui/button'

<Button>Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="destructive">Destructivo</Button>
<Button variant="outline">Contorno</Button>
<Button variant="ghost">Fantasma</Button>
<Button variant="link">Enlace</Button>`}
              >
                <div className="flex flex-wrap gap-3">
                  <Button>Primario</Button>
                  <Button variant="secondary">Secundario</Button>
                  <Button variant="outline">Contorno</Button>
                </div>
              </ComponentShowcase>

              <PropsTable
                props={[
                  { name: 'variant', type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', default: '"default"', description: 'Variante de estilo visual' },
                  { name: 'size', type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: 'Tamaño del botón' },
                  { name: 'asChild', type: 'boolean', default: 'false', description: 'Renderizar como elemento hijo (Slot)' },
                  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilitar el botón' },
                ]}
              />
            </Section>

            {/* Inputs */}
            <Section id="inputs" title="Campos de Texto">
              <div className="max-w-md space-y-8">
                <Subsection title="Input Básico">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="input-default">Por defecto</Label>
                      <Input id="input-default" placeholder="Escribe aquí..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="input-disabled">Deshabilitado</Label>
                      <Input id="input-disabled" placeholder="Deshabilitado" disabled />
                    </div>
                  </div>
                </Subsection>

                <Subsection title="Input con Icono">
                  <div className="space-y-4">
                    <InputWithIcon
                      icon_left={<Search className="w-4 h-4" />}
                      placeholder="Buscar..."
                    />
                    <InputWithIcon
                      icon_left={<Mail className="w-4 h-4" />}
                      type="email"
                      placeholder="tu@email.com"
                    />
                    <InputWithIcon
                      icon_left={<Lock className="w-4 h-4" />}
                      icon_right={
                        <button onClick={() => set_show_password(!show_password)} className="hover:text-foreground">
                          {show_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      type={show_password ? 'text' : 'password'}
                      placeholder="Contraseña"
                    />
                  </div>
                </Subsection>

                <Subsection title="Input con Error">
                  <InputWithIcon
                    icon_left={<Mail className="w-4 h-4" />}
                    type="email"
                    placeholder="tu@email.com"
                    error
                    error_message="El email no es válido"
                    defaultValue="email-invalido"
                  />
                </Subsection>
              </div>
            </Section>

            {/* Selects */}
            <Section id="selects" title="Selectores">
              <div className="max-w-md space-y-6">
                <Subsection title="Select Básico">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Opción 1</SelectItem>
                      <SelectItem value="option2">Opción 2</SelectItem>
                      <SelectItem value="option3">Opción 3</SelectItem>
                    </SelectContent>
                  </Select>
                </Subsection>

                <Subsection title="Select con Etiqueta">
                  <div className="space-y-2">
                    <Label>Tipo de Oposición</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu oposición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aux">Auxiliar Administrativo</SelectItem>
                        <SelectItem value="admin">Administrativo</SelectItem>
                        <SelectItem value="gestion">Gestión</SelectItem>
                        <SelectItem value="tramitacion">Tramitación Procesal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Subsection>
              </div>
            </Section>

            {/* Checkboxes */}
            <Section id="checkboxes" title="Checkboxes y Radio">
              <div className="grid md:grid-cols-2 gap-8">
                <Subsection title="Checkboxes">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check1" />
                      <Label htmlFor="check1">Acepto los términos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check2" defaultChecked />
                      <Label htmlFor="check2">Recordar sesión</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check3" disabled />
                      <Label htmlFor="check3" className="text-muted-foreground">Deshabilitado</Label>
                    </div>
                  </div>
                </Subsection>

                <Subsection title="Grupo de Radio">
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="r1" />
                      <Label htmlFor="r1">Test oficial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="r2" />
                      <Label htmlFor="r2">Test de práctica</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option3" id="r3" />
                      <Label htmlFor="r3">Test aleatorio</Label>
                    </div>
                  </RadioGroup>
                </Subsection>
              </div>
            </Section>

            {/* Cards */}
            <Section id="cards" title="Tarjetas">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tarjeta Básica</CardTitle>
                    <CardDescription>Descripción de la tarjeta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Contenido de ejemplo.</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Acción</Button>
                  </CardFooter>
                </Card>

                <Card className="hoverable cursor-pointer">
                  <CardHeader>
                    <CardTitle>Tarjeta Interactiva</CardTitle>
                    <CardDescription>Con efecto hover</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Pasa el cursor para ver el efecto.</p>
                  </CardContent>
                </Card>

                <Card className="border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20">
                  <CardHeader>
                    <CardTitle className="text-violet-900 dark:text-violet-100">Tarjeta Destacada</CardTitle>
                    <CardDescription>Con estilo especial</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-violet-700 dark:text-violet-300">Contenido destacado.</p>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Badges */}
            <Section id="badges" title="Insignias">
              <Subsection title="Variantes">
                <div className="flex flex-wrap gap-3">
                  <Badge>Por defecto</Badge>
                  <Badge variant="secondary">Secundario</Badge>
                  <Badge variant="destructive">Destructivo</Badge>
                  <Badge variant="outline">Contorno</Badge>
                </div>
              </Subsection>

              <Subsection title="Insignias de Estado de Test">
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">
                    <Check className="w-3 h-3 mr-1" /> Correcto
                  </Badge>
                  <Badge className="bg-rose-500 hover:bg-rose-600">
                    <X className="w-3 h-3 mr-1" /> Incorrecto
                  </Badge>
                  <Badge className="bg-indigo-500 hover:bg-indigo-600">
                    Sin responder
                  </Badge>
                  <Badge className="bg-amber-500 hover:bg-amber-600">
                    <Star className="w-3 h-3 mr-1 fill-current" /> 85 pts
                  </Badge>
                </div>
              </Subsection>
            </Section>

            {/* Avatares */}
            <Section id="avatars" title="Avatares">
              <Subsection title="Tamaños">
                <div className="flex items-end gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </Subsection>

              <Subsection title="Fallbacks">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300">MG</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Subsection>
            </Section>

            {/* Diálogos */}
            <Section id="dialogs" title="Diálogos">
              <div className="flex flex-wrap gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Diálogo Básico</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Título del Diálogo</DialogTitle>
                      <DialogDescription>
                        Esta es la descripción del diálogo. Puedes poner cualquier contenido aquí.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">Contenido del diálogo...</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancelar</Button>
                      <Button>Confirmar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Diálogo Destructivo</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar test?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El test será eliminado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Section>

            {/* Menús Desplegables */}
            <Section id="dropdowns" title="Menús Desplegables">
              <div className="flex flex-wrap gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Opciones <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" /> Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" /> Ajustes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Section>

            {/* Tooltips */}
            <Section id="tooltips" title="Tooltips">
              <TooltipProvider>
                <div className="flex flex-wrap gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Pasa el cursor</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Esto es un tooltip</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ajustes</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="underline decoration-dotted cursor-help">
                        ¿Qué es esto?
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Texto de ayuda explicativo</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </Section>

            {/* Acordeones */}
            <Section id="accordions" title="Acordeones">
              <div className="max-w-lg">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>¿Qué es esta plataforma?</AccordionTrigger>
                    <AccordionContent>
                      Postal3 es una plataforma de preparación de tests para oposiciones en España.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>¿Cómo funcionan los tests?</AccordionTrigger>
                    <AccordionContent>
                      Los tests consisten en preguntas tipo test con tiempo límite. Tus resultados se registran a lo largo del tiempo.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>¿Puedo ver mi progreso?</AccordionTrigger>
                    <AccordionContent>
                      ¡Sí! La plataforma proporciona estadísticas detalladas sobre tu rendimiento en todos los tests.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Section>

            {/* Sheets */}
            <Section id="sheets" title="Paneles Laterales">
              <div className="flex flex-wrap gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Abrir Panel (Derecha)</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Título del Panel</SheetTitle>
                      <SheetDescription>
                        Los paneles se deslizan desde el borde de la pantalla.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">Contenido del panel...</p>
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Abrir Panel (Izquierda)</Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Navegación</SheetTitle>
                    </SheetHeader>
                    <div className="py-4 space-y-2">
                      <Button variant="ghost" className="w-full justify-start">Inicio</Button>
                      <Button variant="ghost" className="w-full justify-start">Tests</Button>
                      <Button variant="ghost" className="w-full justify-start">Perfil</Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </Section>

            {/* Tablas */}
            <Section id="tables" title="Tablas">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Puntuación</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Constitución Española</TableCell>
                      <TableCell><Badge className="bg-emerald-500">Aprobado</Badge></TableCell>
                      <TableCell>85/100</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Derecho Administrativo</TableCell>
                      <TableCell><Badge className="bg-rose-500">Suspendido</Badge></TableCell>
                      <TableCell>42/100</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Reintentar</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Ley de Procedimiento</TableCell>
                      <TableCell><Badge variant="secondary">Pendiente</Badge></TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Empezar</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Section>

            {/* Alertas */}
            <Section id="alerts" title="Alertas">
              <div className="space-y-4 max-w-lg">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Información</AlertTitle>
                  <AlertDescription>
                    Este es un mensaje informativo para el usuario.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Ha ocurrido un error. Por favor, inténtalo de nuevo.
                  </AlertDescription>
                </Alert>

                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 [&>svg]:text-emerald-600">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Éxito</AlertTitle>
                  <AlertDescription>
                    La operación se ha completado correctamente.
                  </AlertDescription>
                </Alert>

                <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200 [&>svg]:text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Advertencia</AlertTitle>
                  <AlertDescription>
                    Tu sesión expirará en 5 minutos.
                  </AlertDescription>
                </Alert>
              </div>
            </Section>

            {/* Toasts */}
            <Section id="toasts" title="Notificaciones (Toasts)">
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => toast('Evento creado')}
                >
                  Toast Normal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.success('¡Test completado con éxito!')}
                >
                  Toast de Éxito
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.error('Error al guardar los cambios')}
                >
                  Toast de Error
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.warning('Tu sesión está a punto de expirar')}
                >
                  Toast de Advertencia
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast('Test completado', {
                      description: 'Has obtenido 85/100 puntos',
                      action: {
                        label: 'Ver Resultados',
                        onClick: () => console.log('Ver resultados'),
                      },
                    })
                  }
                >
                  Toast con Acción
                </Button>
              </div>
            </Section>

            {/* ============================================ */}
            {/* FEEDBACK */}
            {/* ============================================ */}

            {/* Estados de Feedback */}
            <Section id="feedback" title="Estados de Feedback">
              <Tabs defaultValue="empty" className="w-full">
                <TabsList>
                  <TabsTrigger value="empty">Vacío</TabsTrigger>
                  <TabsTrigger value="error">Error</TabsTrigger>
                  <TabsTrigger value="success">Éxito</TabsTrigger>
                </TabsList>

                <TabsContent value="empty" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <EmptyState
                          variant="default"
                          action={{ label: 'Crear nuevo', onClick: () => {} }}
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <EmptyState variant="search" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <EmptyState variant="no-results" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <EmptyState
                          variant="no-data"
                          action={{ label: 'Empezar', onClick: () => {} }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="error" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <ErrorState variant="default" on_retry={() => {}} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <ErrorState variant="network" on_retry={() => {}} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <ErrorState variant="server" on_retry={() => {}} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <ErrorState variant="forbidden" />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="success" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <SuccessState
                          variant="default"
                          action={{ label: 'Continuar', onClick: () => {} }}
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <SuccessState variant="celebration" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <SuccessState
                          variant="completed"
                          action={{ label: 'Ver resultados', onClick: () => {} }}
                          secondary_action={{ label: 'Volver', onClick: () => {} }}
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <SuccessState variant="achievement" />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </Section>

            {/* Estados de Carga */}
            <Section id="loading" title="Estados de Carga">
              <div className="grid md:grid-cols-2 gap-8">
                <Subsection title="Spinners">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Spinner size="sm" />
                      <p className="text-xs text-muted-foreground mt-2">Pequeño</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="md" />
                      <p className="text-xs text-muted-foreground mt-2">Mediano</p>
                    </div>
                    <div className="text-center">
                      <Spinner size="lg" />
                      <p className="text-xs text-muted-foreground mt-2">Grande</p>
                    </div>
                  </div>
                </Subsection>

                <Subsection title="Estado de Carga">
                  <Card>
                    <CardContent className="pt-6">
                      <LoadingState text="Cargando tests..." />
                    </CardContent>
                  </Card>
                </Subsection>

                <Subsection title="Esqueletos">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                </Subsection>

                <Subsection title="Progreso">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completado</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                  </div>
                </Subsection>
              </div>
            </Section>

            {/* ============================================ */}
            {/* COMPONENTES DE TEST */}
            {/* ============================================ */}

            <Section
              id="tests"
              title="Componentes de Test"
              description="Componentes específicos del dominio para la funcionalidad de tests y exámenes."
            >
              {/* TestCard */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">TestCard</h3>
                  <p className="text-muted-foreground mt-1">
                    Tarjeta para mostrar un test en el catálogo.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <TestCard {...MOCK_TEST} />
                  <TestCard {...MOCK_TEST_NEW} />
                  <TestCard {...MOCK_TEST} status="passed" stats={{ ...MOCK_TEST.stats, own_max_points: 95 }} />
                </div>
              </div>

              <Separator className="my-12" />

              {/* QuestionCard */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">QuestionCard</h3>
                  <p className="text-muted-foreground mt-1">
                    Componente principal para mostrar una pregunta durante un test.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="max-w-2xl">
                    <QuestionCard
                      {...MOCK_QUESTION}
                      show_controls={true}
                      selected_answer_id={selected_answer}
                      on_answer_select={set_selected_answer}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Seleccionada: <strong className="text-foreground">{selected_answer ? `Opción ${selected_answer}` : 'Ninguna'}</strong>
                    </span>
                    {selected_answer && (
                      <Button variant="ghost" size="sm" onClick={() => set_selected_answer(null)}>
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-12" />

              {/* TestStatusBar */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">TestStatusBar</h3>
                  <p className="text-muted-foreground mt-1">
                    Barra de estado fija que se muestra durante la realización del test.
                  </p>
                </div>

                <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-4">
                      La barra aparece fija en la parte inferior de la pantalla
                    </p>
                    <Button
                      onClick={() => set_show_status_bar(!show_status_bar)}
                      className={show_status_bar ? 'bg-rose-500 hover:bg-rose-600' : ''}
                    >
                      {show_status_bar ? 'Ocultar Barra' : 'Mostrar Barra'}
                    </Button>
                  </div>
                </Card>
              </div>
            </Section>

            {/* ============================================ */}
            {/* PATRONES */}
            {/* ============================================ */}

            <Section
              id="patterns-forms"
              title="Patrones de Formulario"
              description="Layouts de formulario comunes y patrones de validación."
            >
              <Subsection title="Formulario de Una Columna">
                <Card className="max-w-md">
                  <CardHeader>
                    <CardTitle>Formulario de Contacto</CardTitle>
                    <CardDescription>Rellena el formulario a continuación</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" placeholder="Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="juan@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje</Label>
                      <Input id="message" placeholder="Tu mensaje..." />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Enviar</Button>
                  </CardFooter>
                </Card>
              </Subsection>

              <Subsection title="Formulario en Línea">
                <Card className="max-w-2xl">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input placeholder="Introduce tu email" type="email" />
                      </div>
                      <Button>Suscribirse</Button>
                    </div>
                  </CardContent>
                </Card>
              </Subsection>
            </Section>

            <Section
              id="patterns-empty"
              title="Patrones de Estado Vacío"
              description="Patrones para cuando no hay contenido que mostrar."
            >
              <DosDonts
                dos={[
                  {
                    example: (
                      <div className="text-center py-4">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="font-medium">Aún no hay tests</p>
                        <p className="text-sm text-muted-foreground">Crea tu primer test</p>
                        <Button size="sm" className="mt-3">Crear Test</Button>
                      </div>
                    ),
                    description: 'Proporciona un mensaje claro y una acción para ayudar a los usuarios a avanzar.',
                  },
                ]}
                donts={[
                  {
                    example: (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>Sin datos</p>
                      </div>
                    ),
                    description: 'Evita mensajes genéricos sin contexto ni acciones.',
                  },
                ]}
              />
            </Section>

            {/* ============================================ */}
            {/* ACCESIBILIDAD */}
            {/* ============================================ */}

            <Section
              id="a11y"
              title="Accesibilidad"
              description="Directrices para construir interfaces accesibles siguiendo los estándares WCAG 2.2 AA."
            >
              <Subsection title="Cumplimiento WCAG">
                <div className="space-y-4">
                  <WCAGBadge level="AA" criterion="1.4.3" title="Contraste (Mínimo)" />
                  <WCAGBadge level="AA" criterion="2.1.1" title="Teclado" />
                  <WCAGBadge level="AA" criterion="2.4.7" title="Foco Visible" />
                </div>
              </Subsection>

              <Subsection title="Navegación por Teclado">
                <KeyboardShortcutsTable
                  shortcuts={[
                    { keys: ['Tab'], description: 'Mover foco al siguiente elemento interactivo' },
                    { keys: ['Shift', 'Tab'], description: 'Mover foco al elemento anterior' },
                    { keys: ['Enter'], description: 'Activar botones, enlaces, elementos de menú' },
                    { keys: ['Espacio'], description: 'Activar botones, alternar checkboxes' },
                    { keys: ['Escape'], description: 'Cerrar diálogos, menús, paneles' },
                    { keys: ['Flechas'], description: 'Navegar dentro de componentes complejos' },
                  ]}
                />
              </Subsection>

              <Subsection title="Notas de Accesibilidad">
                <div className="space-y-4">
                  <AccessibilityNote category="keyboard">
                    Todos los elementos interactivos deben ser accesibles mediante teclado. El orden de foco debe seguir el orden visual.
                  </AccessibilityNote>
                  <AccessibilityNote category="screen-reader">
                    Usa HTML semántico y etiquetas ARIA cuando sea necesario. Anuncia cambios de contenido dinámico con regiones live.
                  </AccessibilityNote>
                  <AccessibilityNote category="contrast">
                    El texto debe tener un ratio de contraste de al menos 4.5:1 para texto normal y 3:1 para texto grande.
                  </AccessibilityNote>
                  <AccessibilityNote category="focus">
                    Los indicadores de foco deben ser visibles y tener suficiente contraste (mínimo 3:1).
                  </AccessibilityNote>
                </div>
              </Subsection>

              <Subsection title="Buenas Prácticas">
                <div className="space-y-4">
                  <Guideline type="do" title="Usa HTML semántico">
                    Usa los elementos HTML correctos para su propósito. Botones para acciones, enlaces para navegación.
                  </Guideline>
                  <Guideline type="do" title="Proporciona texto alternativo">
                    Todas las imágenes deben tener texto alt descriptivo. Las imágenes decorativas deben usar alt="".
                  </Guideline>
                  <Guideline type="dont" title="No te bases solo en el color">
                    Siempre combina el color con texto, iconos o patrones para transmitir significado.
                  </Guideline>
                  <Guideline type="caution" title="Cuidado con las animaciones">
                    Respeta prefers-reduced-motion. Evita contenido parpadeante que pueda provocar convulsiones.
                  </Guideline>
                </div>
              </Subsection>
            </Section>

            {/* ============================================ */}
            {/* TEMAS */}
            {/* ============================================ */}

            <Section
              id="theming"
              title="Personalización de Temas"
              description="Personaliza el aspecto del sistema de diseño."
            >
              <Subsection title="Modo Oscuro">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    El sistema de diseño soporta modos claro y oscuro. Usa el selector de tema en la cabecera para cambiar.
                  </p>
                  {mounted && (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Tema actual:</span>
                      <Badge variant="secondary">{theme}</Badge>
                    </div>
                  )}
                </div>
              </Subsection>

              <Subsection title="Variables CSS">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    El tema se controla mediante propiedades personalizadas CSS (variables). Las principales incluyen:
                  </p>
                  <CodeBlock
                    title="Variables de Tema"
                    language="css"
                    code={`:root {
  /* Fondo y Primer plano */
  --background: oklch(0.995 0.002 285);
  --foreground: oklch(0.13 0.02 285);

  /* Primario (Violeta) */
  --primary: oklch(0.585 0.22 292);
  --primary-foreground: oklch(1 0 0);

  /* Semánticos */
  --destructive: oklch(0.60 0.22 12);
  --muted: oklch(0.96 0.005 285);
  --accent: oklch(0.94 0.04 292);

  /* Bordes y Anillo */
  --border: oklch(0.91 0.01 285);
  --ring: oklch(0.585 0.22 292);
  --radius: 0.75rem;
}`}
                  />
                </div>
              </Subsection>

              <Subsection title="Colores de Marca">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Los colores de marca personalizados se definen por separado y pueden personalizarse:
                  </p>
                  <CodeBlock
                    title="Variables de Marca"
                    language="css"
                    code={`:root {
  --color-brand-primary: #8B5CF6;
  --color-brand-primary-hover: #7C3AED;
  --color-brand-secondary: #A78BFA;
  --color-brand-accent: #C4B5FD;

  --color-test-correct: #10B981;
  --color-test-incorrect: #F43F5E;
  --color-test-unanswered: #6366F1;
  --color-test-star: #F59E0B;
}`}
                  />
                </div>
              </Subsection>
            </Section>

            {/* Espaciador */}
            <div className="h-32" />
          </main>
        </div>
      </div>

      {/* Demo de Barra de Estado */}
      {show_status_bar && (
        <TestStatusBar
          elapsed_seconds={125}
          available_seconds={3600}
          answered_count={15}
          total_questions={50}
          on_pause={() => {}}
          on_finish={() => set_show_status_bar(false)}
        />
      )}
    </div>
  )
}
