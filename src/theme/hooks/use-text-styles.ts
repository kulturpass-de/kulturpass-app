import { useContext } from 'react'
import { TextStyleContext, TextStyleValue } from '../../utils/accessibility/components/text-style-provider'

export const useTextStyles = (): [
  TextStyleValue['textStyles'],
  TextStyleValue['translatedTextStyles'],
  TextStyleValue['translatedTextComponents'],
] => {
  const context = useContext(TextStyleContext)

  if (!context) {
    throw new Error('TextStyleContext used outside of TextStyleProvider.')
  }

  return [context.textStyles, context.translatedTextStyles, context.translatedTextComponents]
}
