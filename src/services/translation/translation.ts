import { useCallback, useMemo } from 'react'
import { useTranslation as useI18nTranslation } from 'react-i18next'
import { AvailableTranslations } from '../../components/translated-text/types'
import { env } from '../../env'
import { createTranslation } from './create-translation'
import { fallbackLng } from './setup'
import { Language } from './types'

type TranslationFunction = (key: AvailableTranslations, value?: Record<string, unknown>) => string

export { type TranslationFunction }
export { Trans } from 'react-i18next'

export const translation = createTranslation({ debug: env.DEBUG_TRANSLATION })

export const useTranslation = (...params: Parameters<typeof useI18nTranslation>) => {
  const { t, i18n } = useI18nTranslation(...params)

  const l = useMemo(() => {
    return Object.values(Language).find(typedLanguage => i18n.language === typedLanguage) || fallbackLng
  }, [i18n.language])

  const ls = useMemo(
    () =>
      Object.keys(i18n.store.data).filter(
        (untypedLanguage): untypedLanguage is Language => untypedLanguage in Language,
      ),
    [i18n.store.data],
  )

  const cl = useCallback(
    (typedLanguage: Language) => {
      return i18n.changeLanguage(typedLanguage)
    },
    [i18n],
  )

  const hook = useMemo(() => ({ t: t as TranslationFunction, l, ls, cl }), [t, l, ls, cl])

  return hook
}
