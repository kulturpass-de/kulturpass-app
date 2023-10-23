import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BulletListItem } from '../../../components/bullet-list-item/bullet-list-item'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type ProductReportBodyListItemProps = {
  i18nPostfix: string
  baseTestId: string
}

export const ProductReportBodyListItem: React.FC<ProductReportBodyListItemProps> = ({ i18nPostfix, baseTestId }) => {
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <BulletListItem bulletSize={8}>
      <TranslatedText
        i18nKey={('productDetail_report_screen_body_text_list_item_' + i18nPostfix) as AvailableTranslations}
        testID={addTestIdModifier(baseTestId, 'list_item_' + i18nPostfix)}
        textStyle="BodyBold"
        textStyleOverrides={{ color: colors.labelColor }}
      />
    </BulletListItem>
  )
}

export const ProductReportBody: React.FC = () => {
  const { addTestIdModifier, buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const testId = buildTestId('productDetail_report_screen_body')

  return (
    <View style={styles.container}>
      <TranslatedText
        i18nKey="productDetail_report_screen_body_text_first"
        testID={addTestIdModifier(testId, 'text_first')}
        textStyle="BodyRegular"
        textStyleOverrides={{ color: colors.labelColor }}
      />
      <TranslatedText
        i18nKey="productDetail_report_screen_body_text_second"
        testID={addTestIdModifier(testId, 'text_second')}
        textStyle="BodyBold"
        textStyleOverrides={{ color: colors.labelColor }}
      />

      <View
        style={styles.bulletItemList}
        testID={addTestIdModifier(testId, 'productDetail_report_screen_body_text_list')}>
        <ProductReportBodyListItem i18nPostfix="first" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="second" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="third" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="fourth" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="fifth" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="sixth" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="seventh" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="eighth" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="ninth" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="tenth" baseTestId={testId} />
        <ProductReportBodyListItem i18nPostfix="eleventh" baseTestId={testId} />
      </View>

      <TranslatedText
        i18nKey="productDetail_report_screen_body_text_third"
        testID={addTestIdModifier(testId, 'text_third')}
        textStyle="BodyRegular"
        textStyleOverrides={{ color: colors.labelColor }}
      />
      <TranslatedText
        i18nKey="productDetail_report_screen_body_text_fourth"
        testID={addTestIdModifier(testId, 'text_fourth')}
        textStyle="BodyRegular"
        textStyleOverrides={{ color: colors.labelColor }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: spacing[6],
  },
  bulletItemList: {
    rowGap: spacing[1],
    flex: 1,
  },
})
