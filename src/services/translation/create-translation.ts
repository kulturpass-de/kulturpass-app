import i18n, { type i18n as i18nType } from 'i18next'
import AsyncStoragePlugin from 'i18next-react-native-async-storage'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'
import { resources, defaultNS, fallbackLng } from './setup'

let instance: i18nType | undefined

export const createTranslation = (params?: { debug?: boolean }) => {
  if (instance) {
    return instance
  }

  instance = i18n.createInstance()

  instance
    .use(AsyncStoragePlugin())
    .use(initReactI18next)
    .init({
      debug: params?.debug,
      resources,
      defaultNS,
      fallbackLng,

      interpolation: { escapeValue: false },
    })

  setupErrorMap(instance)

  return instance
}

export const setupErrorMap = (i18next: i18nType) => {
  z.setErrorMap(issue => {
    const message: string = i18next.t(`form_error_${issue.code}`, '')
    return { message: message ?? i18next.t('form_error_fallback') }
  })
}
