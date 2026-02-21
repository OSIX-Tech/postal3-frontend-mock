import type common from './locales/es/common.json'
import type auth from './locales/es/auth.json'
import type tests from './locales/es/tests.json'
import type profile from './locales/es/profile.json'
import type landing from './locales/es/landing.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      auth: typeof auth
      tests: typeof tests
      profile: typeof profile
      landing: typeof landing
    }
  }
}
