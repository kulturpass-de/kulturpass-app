import { useTranslation } from '../../../services/translation/translation'
import { useMemo } from 'react'
import { z } from 'zod'
import { Language } from '../../../services/translation/types'
import { EnvironmentConfiguration } from '../../../services/environment-configuration/environment-configuration'
import { useEnvironmentConfiguration } from '../../../services/environment-configuration/hooks/use-environment-configuration'

export const LocalizedLinkSchema = z
  .record(z.nativeEnum(Language), z.string())
  .refine((link): link is Required<typeof link> => {
    return Object.values(Language).every(lang => link[lang] !== undefined)
  })

export type LocalizedLink = z.infer<typeof LocalizedLinkSchema>

export type LocalizedLinkSelector = (envConfig: EnvironmentConfiguration) => LocalizedLink

export const useLocalizedEnvironmentUrl = (localizedLinkSelector: LocalizedLinkSelector) => {
  const { l: language } = useTranslation()
  const envConfig = useEnvironmentConfiguration()

  return useMemo(() => {
    const localizedLink = localizedLinkSelector(envConfig)
    return localizedLink[language]
  }, [envConfig, language, localizedLinkSelector])
}

export const getCdcDpsDocumentUrl: LocalizedLinkSelector = env => env.cdc.consents.dpsDocumentUrl

export const getCdcEulaDocumentUrl: LocalizedLinkSelector = env => env.cdc.consents.eulaDocumentUrl

export const getImprintUrl: LocalizedLinkSelector = env => env.appInformation.imprintUrl

export const getOpenSourceLegalNoticeUrl: LocalizedLinkSelector = env => env.appInformation.openSourceLegalNoticeUrl

export const getFaqHomeUrl: LocalizedLinkSelector = env => env.faq.homeUrl
