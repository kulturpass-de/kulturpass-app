import { useSelector } from 'react-redux'
import { useTranslation } from '../../../services/translation/translation'
import { useMemo } from 'react'
import { RootState } from '../../../services/redux/configure-store'
import { z } from 'zod'
import { Language } from '../../../services/translation/types'

export const LocalizedLinkSchema = z
  .record(z.nativeEnum(Language), z.string())
  .refine((link): link is Required<typeof link> => {
    return Object.values(Language).every(lang => link[lang] !== undefined)
  })

export type LocalizedLink = z.infer<typeof LocalizedLinkSchema>

export const useLocalizedEnvironmentUrl = (
  localizedLinkSelector: Parameters<typeof useSelector<RootState, LocalizedLink>>[0],
) => {
  const { l: language } = useTranslation()
  const localizedLink = useSelector(localizedLinkSelector)

  return useMemo(() => localizedLink[language], [language, localizedLink])
}
