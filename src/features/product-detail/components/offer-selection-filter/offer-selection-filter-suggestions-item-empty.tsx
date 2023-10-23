import React from 'react'
import { StyleSheet } from 'react-native'
import { useTranslation } from '../../../../services/translation/translation'
import { useTheme } from '../../../../theme/hooks/use-theme'
import {
  OfferSelectionFilterSuggestionsItem,
  OfferSelectionFilterSuggestionsItemProps,
} from './offer-selection-filter-suggestions-item'

type OfferSelectionFilterSuggestionsItemEmptyProps = Omit<OfferSelectionFilterSuggestionsItemProps, 'onPress' | 'name'>

export const OfferSelectionFilterSuggestionsItemEmpty: React.FC<
  OfferSelectionFilterSuggestionsItemEmptyProps
> = props => {
  const { colors } = useTheme()
  const { t } = useTranslation()

  return (
    <OfferSelectionFilterSuggestionsItem
      {...props}
      name={t('offerSelectionFilter_suggestions_item_no_matches')}
      style={styles.container}
      textStyle={{ color: colors.textFieldPlaceholder }}
      topRadius
      bottomRadius
      shadow
    />
  )
}
const styles = StyleSheet.create({ container: { height: 64 } })
