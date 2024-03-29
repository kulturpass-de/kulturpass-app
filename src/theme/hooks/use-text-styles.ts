import { useContext } from 'react'
import { TextStyleContext } from '../../utils/accessibility/components/text-style-provider'

export const useTextStyles = () => {
  const context = useContext(TextStyleContext)

  if (!context) {
    throw new Error('TextStyleContext used outside of TextStyleProvider.')
  }

  return context.textStyles
}
