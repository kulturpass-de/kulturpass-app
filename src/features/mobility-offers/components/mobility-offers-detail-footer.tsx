import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { addTestIdModifier, buildTestId } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'

export const MobilityOffersDetailFooter: React.FC = () => {
  const testID = buildTestId('mobility_offers_ft_product_detail_footer')
  const { colors } = useTheme()

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: colors.secondaryBackground, borderTopColor: colors.footerBorder }]}>
      <View style={styles.rowPrice}>
        <TranslatedText
          i18nKey="mobility_offers_ft_product_detail_footer_text"
          textStyle="HeadlineH3Extrabold"
          textStyleOverrides={[styles.leftRow, textStyles.CaptionExtrabold, { color: colors.labelColor }]}
          testID={addTestIdModifier(testID, 'text')}
        />
        <TranslatedText
          i18nKey="mobility_offers_ft_product_detail_footer_price"
          textStyle="HeadlineH3Extrabold"
          textStyleOverrides={[textStyles.HeadlineH3Extrabold, { color: colors.labelColor }]}
          testID={addTestIdModifier(testID, 'price')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    borderTopWidth: 2,
  },
  rowPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: spacing[9],
    gap: spacing[5],
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flex: 1,
  },
})
