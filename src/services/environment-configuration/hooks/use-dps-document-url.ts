import { useSelector } from 'react-redux'
import { useTranslation } from '../../translation/translation'
import { getCdcDpsDocumentUrl } from '../redux/environment-configuration-selectors'
import { useMemo } from 'react'

export const useDpsDocumentUrl = () => {
  const { l: language } = useTranslation()
  const dpsDocumentUrl = useSelector(getCdcDpsDocumentUrl)

  return useMemo(() => dpsDocumentUrl[language], [dpsDocumentUrl, language])
}
