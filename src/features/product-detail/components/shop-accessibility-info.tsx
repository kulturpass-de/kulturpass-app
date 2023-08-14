import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SvgImage, SvgImageProps } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { ProductDetailSection } from './product-detail-section'

type AccessibilityFeatureCheckableProps = {
  testID: TestId
  checked: boolean
  enabledLabel_i18nKey: AvailableTranslations
  disabledLabel_i18nKey: AvailableTranslations
}

const AccessibilityFeatureCheckable: React.FC<AccessibilityFeatureCheckableProps> = ({ testID, checked, ...props }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  const labelI18nKey = checked ? props.enabledLabel_i18nKey : props.disabledLabel_i18nKey
  const iconSource: SvgImageProps['type'] = checked ? 'check' : 'close'
  const iconLabel = checked
    ? t('productDetail_offer_accessibility_feature_enabled')
    : t('productDetail_offer_accessibility_feature_disabled')

  return (
    <View testID={testID} style={styles.featureCheckable}>
      <SvgImage type={iconSource} width={24} height={24} accessibilityLabel={iconLabel} />
      <TranslatedText
        testID={buildTestId(labelI18nKey)}
        i18nKey={labelI18nKey}
        textStyle="BodyBold"
        textStyleOverrides={{ color: colors.labelColor }}
      />
    </View>
  )
}

type AccessibilityFeatureTextProps = {
  testID: TestId
  label_i18nKey?: AvailableTranslations
  text: string
}

const AccessibilityFeatureText: React.FC<AccessibilityFeatureTextProps> = ({ testID, label_i18nKey, text }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  return (
    <View testID={testID} style={styles.featureText}>
      {label_i18nKey ? (
        <TranslatedText
          testID={buildTestId(label_i18nKey)}
          i18nKey={label_i18nKey}
          textStyle="BodyBold"
          textStyleOverrides={{ color: colors.labelColor }}
        />
      ) : null}
      <Text testID={addTestIdModifier(testID, 'text')} style={[textStyles.BodyRegular, { color: colors.labelColor }]}>
        {text}
      </Text>
    </View>
  )
}

export type ShopAccessibilityInfoProps = {
  testID: TestId
  selectedOffer: Offer
}

export const ShopAccessibilityInfo: React.FC<ShopAccessibilityInfoProps> = ({ testID, selectedOffer }) => {
  const { accessibilityWheelchairShop, accessibilityToiletShop, accessibilityOffer, accessibilityOfferOthers } =
    selectedOffer

  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()

  const accessibilityOfferCleaned = accessibilityOffer?.trim() ?? null
  const accessibilityOfferOthersCleaned = accessibilityOfferOthers?.trim() ?? null

  return (
    <ProductDetailSection
      testID={testID}
      iconSource="human-sketch"
      sectionCaptioni18nKey="productDetail_offer_accessibility_caption">
      <View style={styles.container}>
        {accessibilityWheelchairShop !== undefined ? (
          <AccessibilityFeatureCheckable
            key="wheelchair_shop"
            testID={addTestIdModifier(testID, 'wheelchair_shop')}
            checked={accessibilityWheelchairShop}
            enabledLabel_i18nKey="productDetail_offer_accessibility_feature_pickup_enabled_caption"
            disabledLabel_i18nKey="productDetail_offer_accessibility_feature_pickup_disabled_caption"
          />
        ) : null}
        {accessibilityToiletShop !== undefined ? (
          <AccessibilityFeatureCheckable
            key="toilet_shop"
            testID={addTestIdModifier(testID, 'toilet_shop')}
            checked={accessibilityToiletShop}
            enabledLabel_i18nKey="productDetail_offer_accessibility_feature_toilet_enabled_caption"
            disabledLabel_i18nKey="productDetail_offer_accessibility_feature_toilet_disabled_caption"
          />
        ) : null}
        {accessibilityOfferCleaned ? (
          <AccessibilityFeatureText
            testID={addTestIdModifier(testID, 'offer')}
            label_i18nKey="productDetail_offer_accessibility_feature_offer_caption"
            text={accessibilityOfferCleaned}
          />
        ) : null}
        {accessibilityOfferOthersCleaned ? (
          <AccessibilityFeatureText
            testID={addTestIdModifier(testID, 'others')}
            label_i18nKey="productDetail_offer_accessibility_feature_others_caption"
            text={accessibilityOfferOthersCleaned}
          />
        ) : null}
        <AccessibilityFeatureText
          testID={addTestIdModifier(testID, 'noOtherFeatures')}
          text={t('productDetail_offer_accessibility_noOtherFeatures')}
        />
      </View>
    </ProductDetailSection>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[3],
  },
  featureCheckable: {
    marginTop: spacing[2],
    gap: spacing[3],
    flexDirection: 'row',
  },
  featureText: {
    marginTop: spacing[5],
    flexDirection: 'column',
  },
})
