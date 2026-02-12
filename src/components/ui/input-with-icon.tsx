import * as React from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface InputWithIconProps extends React.ComponentProps<'input'> {
  icon_left?: React.ReactNode
  icon_right?: React.ReactNode
  error?: boolean
  error_message?: string
}

function InputWithIcon({
  icon_left,
  icon_right,
  error,
  error_message,
  className,
  ...props
}: InputWithIconProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        {icon_left && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon_left}
          </div>
        )}
        <Input
          className={cn(
            icon_left && 'pl-10',
            icon_right && 'pr-10',
            error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
            className
          )}
          aria-invalid={error}
          {...props}
        />
        {icon_right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon_right}
          </div>
        )}
      </div>
      {error_message && (
        <p className="text-sm text-destructive">{error_message}</p>
      )}
    </div>
  )
}

export { InputWithIcon }
