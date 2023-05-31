import { useMemo } from 'react'
import { useTranslation } from '../../translation/translation'
import { FAQConfiguration, faqConfiguration } from '../faq-configuration-provider'

export const useFaqLink = (entryName: keyof FAQConfiguration['data']['entries']): string => {
  const { l: language } = useTranslation()

  return useMemo(() => {
    const faqEntries = faqConfiguration.data.entries
    return faqEntries[entryName]?.[language] ?? faqEntries.DEFAULT[language]
  }, [entryName, language])
}
