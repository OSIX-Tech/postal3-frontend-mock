import { Link } from 'react-router-dom'
import { CheckSquare, Clock, User, Star, Check, X, BookOpen, ArrowRight, Trophy, Target } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type TestStatus = 'pending' | 'failed' | 'passed'

interface TestCardProps {
  id: number
  name: string
  description?: string
  image?: string
  status?: TestStatus
  training?: string
  author?: string
  question_count: number
  available_time: number
  kind?: {
    name: string
    icon_url?: string
  }
  stats?: {
    attempt_count: number
    passed_count: number
    failed_count: number
    max_points: number
    own_max_points: number
  }
}

const STATUS_CONFIG: Record<TestStatus, { label: string; icon: typeof Check; color: string; bg: string }> = {
  pending: { label: 'Pendiente', icon: Target, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  failed: { label: 'No superado', icon: X, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },
  passed: { label: 'Superado', icon: Trophy, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
}

function format_time(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function TestCard({
  id,
  name,
  description,
  image,
  status,
  training,
  author,
  question_count,
  available_time,
  kind,
  stats,
}: TestCardProps) {
  const status_config = status ? STATUS_CONFIG[status] : null
  const score_percentage = stats ? Math.round((stats.own_max_points / stats.max_points) * 100) : 0

  return (
    <Link to={`/tests/${id}`} className="block h-full group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/15 hover:-translate-y-1.5 border border-border hover:border-violet-300 dark:hover:border-violet-700 bg-card p-0 gap-0">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Violet tint on hover */}
          <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/20 transition-colors duration-300" />

          {/* Kind badge */}
          {kind && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-black/70 text-foreground shadow-lg backdrop-blur-sm">
                {kind.icon_url ? (
                  <img src={kind.icon_url} alt={kind.name} className="h-3.5 w-3.5" />
                ) : (
                  <CheckSquare className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                )}
                {kind.name}
              </span>
            </div>
          )}

          {/* Stats overlay on image */}
          {stats && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-3 text-white/90 text-xs font-medium">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {stats.attempt_count} intentos
                </span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <Check className="h-3.5 w-3.5" />
                  {stats.passed_count}
                </span>
                <span className="flex items-center gap-1 text-rose-300">
                  <X className="h-3.5 w-3.5" />
                  {stats.failed_count}
                </span>
              </div>
            </div>
          )}

          {/* Training badge on image */}
          {training && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-600 text-white shadow-lg">
                {training}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-foreground mb-1.5 line-clamp-2 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors leading-snug">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {author && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CheckSquare className="h-3.5 w-3.5" />
              {question_count} preguntas
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {format_time(available_time)}
            </span>
          </div>

          {/* Status or Score section */}
          {stats ? (
            <div className="mt-auto">
              {/* Score progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Tu mejor puntuación</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    {stats.own_max_points}/{stats.max_points}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      score_percentage >= 70 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                      score_percentage >= 50 ? "bg-gradient-to-r from-amber-400 to-amber-500" :
                      "bg-gradient-to-r from-rose-400 to-rose-500"
                    )}
                    style={{ width: `${score_percentage}%` }}
                  />
                </div>
              </div>

              {/* Status badge */}
              {status_config && (
                <div className={cn(
                  "flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium",
                  status_config.bg,
                  status_config.color
                )}>
                  <status_config.icon className="h-4 w-4" />
                  {status_config.label}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-auto">
              {/* CTA for new tests */}
              <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 group-hover:from-violet-700 group-hover:to-violet-800 transition-all duration-300">
                Comenzar test
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
