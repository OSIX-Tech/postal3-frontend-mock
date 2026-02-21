import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import common_es from './locales/es/common.json'
import auth_es from './locales/es/auth.json'
import tests_es from './locales/es/tests.json'
import profile_es from './locales/es/profile.json'
import landing_es from './locales/es/landing.json'

import common_gl from './locales/gl/common.json'
import auth_gl from './locales/gl/auth.json'
import tests_gl from './locales/gl/tests.json'
import profile_gl from './locales/gl/profile.json'
import landing_gl from './locales/gl/landing.json'

import common_eu from './locales/eu/common.json'
import auth_eu from './locales/eu/auth.json'
import tests_eu from './locales/eu/tests.json'
import profile_eu from './locales/eu/profile.json'
import landing_eu from './locales/eu/landing.json'

import common_ca from './locales/ca/common.json'
import auth_ca from './locales/ca/auth.json'
import tests_ca from './locales/ca/tests.json'
import profile_ca from './locales/ca/profile.json'
import landing_ca from './locales/ca/landing.json'

export const SUPPORTED_LANGUAGES = ['es', 'gl', 'eu', 'ca'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LOCALE_MAP: Record<SupportedLanguage, string> = {
  es: 'es-ES',
  gl: 'gl-ES',
  eu: 'eu-ES',
  ca: 'ca-ES',
}

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  es: 'ES',
  gl: 'GL',
  eu: 'EU',
  ca: 'CA',
}

function detect_language(): SupportedLanguage {
  const stored = localStorage.getItem('i18n_language')
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage
  }

  const browser_lang = navigator.language.split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(browser_lang as SupportedLanguage)) {
    return browser_lang as SupportedLanguage
  }

  return 'es'
}

i18n.use(initReactI18next).init({
  resources: {
    es: { common: common_es, auth: auth_es, tests: tests_es, profile: profile_es, landing: landing_es },
    gl: { common: common_gl, auth: auth_gl, tests: tests_gl, profile: profile_gl, landing: landing_gl },
    eu: { common: common_eu, auth: auth_eu, tests: tests_eu, profile: profile_eu, landing: landing_eu },
    ca: { common: common_ca, auth: auth_ca, tests: tests_ca, profile: profile_ca, landing: landing_ca },
  },
  lng: detect_language(),
  fallbackLng: 'es',
  defaultNS: 'common',
  ns: ['common', 'auth', 'tests', 'profile', 'landing'],
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18n_language', lng)
})

export default i18n
