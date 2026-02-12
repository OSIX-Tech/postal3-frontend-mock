import { useEffect, useState } from 'react'
import { Clock, Pause, Play, Flag, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestStatusBarProps {
  elapsed_seconds: number
  available_seconds: number
  answered_count: number
  total_questions: number
  is_paused?: boolean
  on_pause?: () => void
  on_finish?: () => void
}

function format_time(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  }
  return `${pad(minutes)}:${pad(secs)}`
}

export function TestStatusBar({
  elapsed_seconds,
  available_seconds,
  answered_count,
  total_questions,
  is_paused = false,
  on_pause,
  on_finish,
}: TestStatusBarProps) {
  const [current_elapsed, set_current_elapsed] = useState(elapsed_seconds)

  // Timer effect
  useEffect(() => {
    if (is_paused) return

    const interval = setInterval(() => {
      set_current_elapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [is_paused])

  // Sync with prop
  useEffect(() => {
    set_current_elapsed(elapsed_seconds)
  }, [elapsed_seconds])

  const progress_percentage = (answered_count / total_questions) * 100
  const time_percentage = Math.min((current_elapsed / available_seconds) * 100, 100)
  const is_time_warning = current_elapsed > available_seconds * 0.8
  const is_time_exceeded = current_elapsed > available_seconds

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">
      {/* Floating glass card */}
      <div
        className="backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(28, 25, 23, 0.92) 0%, rgba(41, 37, 36, 0.92) 100%)',
        }}
      >
        {/* Time progress indicator */}
        <div className="h-1 bg-white/5">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-linear",
              is_time_exceeded
                ? "bg-gradient-to-r from-rose-500 to-red-600 animate-pulse"
                : is_time_warning
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-violet-500 to-purple-600"
            )}
            style={{ width: `${time_percentage}%` }}
          />
        </div>

        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4">

            {/* Progress Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Circular Progress Indicator */}
              <div className="relative">
                <svg className="w-9 h-9 sm:w-10 sm:h-10 -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${progress_percentage * 2.83} 283`}
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                </div>
              </div>

              {/* Count */}
              <div>
                <p className="text-sm sm:text-base font-bold text-white">
                  {answered_count}
                  <span className="text-white/40 font-normal">/{total_questions}</span>
                </p>
              </div>
            </div>

            {/* Clock Section */}
            <div
              className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300",
                is_time_exceeded
                  ? "bg-rose-500/20 border border-rose-500/30"
                  : is_time_warning
                    ? "bg-amber-500/20 border border-amber-500/30"
                    : "bg-white/5 border border-white/10"
              )}
            >
              <Clock
                className={cn(
                  "w-4 h-4",
                  is_time_exceeded
                    ? "text-rose-400 animate-pulse"
                    : is_time_warning
                      ? "text-amber-400"
                      : "text-violet-400"
                )}
              />
              <div className="font-mono text-sm sm:text-base font-bold tracking-wider">
                <span
                  className={cn(
                    is_time_exceeded
                      ? "text-rose-400"
                      : is_time_warning
                        ? "text-amber-400"
                        : "text-white"
                  )}
                >
                  {format_time(current_elapsed)}
                </span>
                <span className="text-white/30 mx-1">/</span>
                <span className="text-white/50">{format_time(available_seconds)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Pause Button */}
              <button
                onClick={on_pause}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200",
                  is_paused
                    ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-white/10 hover:bg-white/15 text-white/80 hover:text-white"
                )}
              >
                {is_paused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>

              {/* Finish Button */}
              <button
                onClick={on_finish}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                }}
              >
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Finalizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
