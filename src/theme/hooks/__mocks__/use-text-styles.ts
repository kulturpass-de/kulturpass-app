import { translatedTextStyles } from '../../../components/translated-text/translated-text-components'
import { textStyles } from '../../typography'

export const useTextStyles = () => {
  return [textStyles, translatedTextStyles, {}]
}
