import { textStyles } from '../../theme/typography'
import { de as translations } from '../../services/translation/i18n'

export type AvailableTextStyles = keyof typeof textStyles
export type AvailableTranslations = keyof typeof translations
