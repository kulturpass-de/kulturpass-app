import { deTranslations } from '../../services/translation/i18n'
import { textStyles } from '../../theme/typography'

export type AvailableTextStyles = keyof typeof textStyles
export type AvailableTranslations = keyof typeof deTranslations
