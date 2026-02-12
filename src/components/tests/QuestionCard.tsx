import { useState } from 'react'
import { CheckCircle2, Info, Flame, AlertTriangle, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type QuestionState = 'unanswered' | 'correct' | 'incorrect' | 'blank'
type AnswerAction = 'none' | 'selected' | 'doubt'

interface Answer {
  id: number
  name: string
  is_correct?: boolean
}

interface QuestionCardProps {
  id: number
  index: number
  name: string
  preamble?: string
  description?: string
  answers: Answer[]
  images?: { id: number; name: string; url: string }[]
  state?: QuestionState
  show_controls?: boolean
  show_result?: boolean
  is_official?: boolean
  is_obsolete?: boolean
  selected_answer_id?: number | null
  answer_action?: AnswerAction
  on_answer_select?: (answer_id: number) => void
  on_answer_doubt?: (answer_id: number) => void
  on_impugn?: () => void
  on_show_justify?: () => void
}

const STATE_STYLES: Record<QuestionState, string> = {
  unanswered: 'bg-muted',
  correct: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
  incorrect: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900',
  blank: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
}

export function QuestionCard({
  id,
  index,
  name,
  preamble,
  description,
  answers,
  images,
  state = 'unanswered',
  show_controls = false,
  show_result = false,
  is_official = false,
  is_obsolete = false,
  selected_answer_id,
  answer_action = 'none',
  on_answer_select,
  on_answer_doubt,
  on_impugn,
  on_show_justify,
}: QuestionCardProps) {
  const [show_description, set_show_description] = useState(false)

  const handle_answer_click = (answer_id: number) => {
    if (show_result) return
    on_answer_select?.(answer_id)
  }

  const handle_answer_double_click = (answer_id: number) => {
    if (show_result) return
    on_answer_doubt?.(answer_id)
  }

  return (
    <article
      className="mb-4 select-none"
      data-question-id={id}
    >
      {/* Header with controls */}
      {show_controls && (
        <header className={cn('flex items-center justify-between p-3 rounded-t-lg', STATE_STYLES[state])}>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 dark:bg-background/30"
              title="Revisar"
            >
              <CheckCircle2 className="h-4 w-4 text-test-correct" />
            </Button>
            {description && (
              <Button
                variant="outline"
                size="sm"
                className="bg-background/50 dark:bg-background/30"
                title="Ver justificación"
                onClick={() => {
                  set_show_description(!show_description)
                  on_show_justify?.()
                }}
              >
                <Info className="h-4 w-4 text-primary" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 dark:bg-background/30"
              title="Impugnar"
              onClick={on_impugn}
            >
              <Flame className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground/50">
            {is_official && (
              <span title="Pregunta oficial">
                <Building2 className="h-5 w-5" />
              </span>
            )}
            {is_obsolete && (
              <span title="Pregunta obsoleta">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </span>
            )}
          </div>
        </header>
      )}

      {/* Body */}
      <div className={cn(
        'p-4 border rounded-b-lg',
        !show_controls && 'rounded-t-lg'
      )}>
        {/* Preamble */}
        {preamble && (
          <p className="text-muted-foreground font-light mb-3">
            {preamble}
          </p>
        )}

        {/* Images */}
        {images && images.length > 0 && (
          <div className="flex justify-center gap-4 mb-4">
            {images.map((image) => (
              <figure key={image.id} className="text-center">
                <img
                  src={image.url}
                  alt={image.name}
                  className="max-w-xs rounded cursor-pointer hover:opacity-90"
                  title="Click para ampliar"
                />
                <figcaption className="text-sm text-muted-foreground mt-1">
                  {image.name}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* Question name */}
        <p className="font-bold mb-3">
          {index}.- {name}
        </p>

        {/* Answers */}
        <ol className="space-y-2 list-none">
          {answers.map((answer, answer_index) => {
            const is_selected = selected_answer_id === answer.id
            const is_doubt = is_selected && answer_action === 'doubt'
            const letter = String.fromCharCode(97 + answer_index) // a, b, c, d...

            let answer_class = 'cursor-pointer hover:underline'

            if (show_result) {
              if (answer.is_correct) {
                answer_class = 'text-test-correct font-bold'
              } else if (is_selected && !answer.is_correct) {
                answer_class = 'text-destructive line-through'
              }
            } else {
              if (is_selected) {
                answer_class = is_doubt
                  ? 'text-orange-500'
                  : 'text-primary'
              }
            }

            return (
              <li
                key={answer.id}
                className={cn('flex items-start gap-2 py-1', answer_class)}
                data-answer-id={answer.id}
                onClick={() => handle_answer_click(answer.id)}
                onDoubleClick={() => handle_answer_double_click(answer.id)}
              >
                <span className="w-5 text-center flex-shrink-0">
                  {is_selected && !show_result && (
                    is_doubt ? '!' : '✓'
                  )}
                </span>
                <span>
                  {letter}) {answer.name}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Footer with description */}
      {show_description && description && (
        <footer className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-sm">
          <p className="flex items-start gap-2 text-info">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="italic">{description}</span>
          </p>
        </footer>
      )}
    </article>
  )
}
