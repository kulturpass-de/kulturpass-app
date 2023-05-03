import { deTranslations, enTranslations } from './i18n'
import { Language } from './types'

export const defaultNS = 'translation'

export const resources = {
  [Language.de]: {
    [defaultNS]: deTranslations,
  },
  [Language.en]: {
    [defaultNS]: enTranslations,
  },
} as const

export const fallbackLng = Language.de
