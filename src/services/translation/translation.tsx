import React, { useEffect, useMemo, useContext, useState } from 'react'
import i18next, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import AsyncStoragePlugin from 'i18next-react-native-async-storage'

import { Language } from './types'
import { z } from 'zod'

export { Trans } from 'react-i18next'

export type TranslatedTextKey = string

export type TranslationFunction = (key: TranslatedTextKey | TranslatedTextKey[], params?: Record<string, any>) => string
export type ChangeLangFunction = (newLanguage: Language) => Promise<Language>

export type LangConfiguration = {
  languages: Language[]
  default: Language
  current: Language
}

export type Translation = {
  /**
   * A function for returning a localized text for the given key
   */
  t: TranslationFunction

  /**
   * Returns the current language
   */
  l: Language

  /**
   * Changes the current language
   */
  cl: (newLanguage: Language) => Promise<Language>

  /**
   * Returns the configured languages
   */
  languages: () => LangConfiguration
}

const TranslationContext = React.createContext<Translation | null>(null)

export type TranslationResources = Resource

export type TranslationProviderProps = {
  debug?: boolean
  resources?: TranslationResources
  fallbackLng?: Language
  children: React.ReactNode
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  debug = false,
  resources = {},
  fallbackLng = 'de',
}) => {
  const [currLang, setCurrLang] = useState<Language>(fallbackLng)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // i18next.language is undefined before initialization
    if (i18next.language !== undefined) {
      setCurrLang(i18next.language as Language)
    }
  }, [fallbackLng])

  useEffect(() => {
    i18next
      .use(AsyncStoragePlugin())
      .use(initReactI18next)
      .init({
        debug,
        resources,
        fallbackLng,
      })
      .then(() => {
        setInitialized(true)
      })
  }, [debug, resources, fallbackLng])

  useEffect(() => {
    // See https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md
    z.setErrorMap(issue => {
      const message = i18next.t(`form_error_${issue.code}`, {
        defaultValue: null,
      })
      return { message: message ?? i18next.t('form_error_fallback') }
    })
  }, [])

  const translation = useMemo<Translation>(() => {
    return {
      t: i18next.t,
      l: currLang,
      cl: async (lang: Language) => {
        await i18next.changeLanguage(lang)
        setCurrLang(i18next.language as Language)
        return currLang
      },
      languages: () => {
        const _langs = Object.keys(resources)

        return {
          languages: _langs as Language[],
          current: i18next.languages[0] as Language,
          default: i18next.languages[0] as Language,
        }
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, currLang, initialized])

  return <TranslationContext.Provider value={translation}>{children}</TranslationContext.Provider>
}

export const useTranslation = () => useContext<Translation | null>(TranslationContext)!
