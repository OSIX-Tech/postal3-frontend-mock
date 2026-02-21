import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/i18n/config'
import type { SupportedLanguage } from '@/i18n/config'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  es: 'Castellano',
  gl: 'Galego',
  eu: 'Euskara',
  ca: 'Catala',
}

interface LanguageSelectorProps {
  className?: string
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { i18n } = useTranslation()

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select
        value={i18n.language}
        onValueChange={(lang) => i18n.changeLanguage(lang)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {LANGUAGE_NAMES[lang]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
