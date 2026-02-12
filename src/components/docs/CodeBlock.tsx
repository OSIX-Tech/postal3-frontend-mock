import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  show_line_numbers?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language = 'tsx',
  title,
  show_line_numbers = false,
  className,
}: CodeBlockProps) {
  const [copied, set_copied] = useState(false)

  const handle_copy = async () => {
    await navigator.clipboard.writeText(code)
    set_copied(true)
    setTimeout(() => set_copied(false), 2000)
  }

  const lines = code.trim().split('\n')

  return (
    <div className={cn('relative group rounded-lg overflow-hidden', className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm font-medium text-gray-300">{title}</span>
          <span className="text-xs text-gray-500">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
          <code className={`language-${language}`}>
            {show_line_numbers ? (
              lines.map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-gray-500 text-right select-none w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))
            ) : (
              code.trim()
            )}
          </code>
        </pre>
        <button
          onClick={handle_copy}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-md transition-all duration-200',
            'bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white',
            'opacity-0 group-hover:opacity-100 focus:opacity-100'
          )}
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
