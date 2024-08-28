import React from 'react'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { SuggestionListItem, SuggestionListItemProps } from './suggestion-list-item'

type SuggestionListItemEmptyProps = Omit<SuggestionListItemProps, 'onPress' | 'title' | 'subtitle'> & {
  height?: number
}

export const SuggestionListItemEmpty: React.FC<SuggestionListItemEmptyProps> = ({ height = 64, ...props }) => {
  const { colors } = useTheme()
  const { t } = useTranslation()

  return (
    <SuggestionListItem
      {...props}
      title={t('offerSelectionFilter_suggestions_item_no_matches')}
      style={[{ height }, props.style]}
      textStyle={{ color: colors.textFieldPlaceholder }}
      topRadius
      bottomRadius
      shadow
    />
  )
}
