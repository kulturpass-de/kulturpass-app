import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { ExhibitProductDetail } from '../../types/product-detail'
import { useTranslation } from '../../../../services/translation/translation'
import { Language } from '../../../../services/translation/types'
import { textStyles } from '../../../../theme/typography'
import { ProductDetailSection } from '../product-detail-section'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { colors } from '../../../../theme/colors'
import { Address } from '../address'

export type ProductExhibitDetailProps = {
  productDetail: ExhibitProductDetail
}

const formatDate = (
  t: ReturnType<typeof useTranslation>['t'],
  language: Language,
  startDateStr?: string,
  endDateStr?: string,
) => {
  const startDate = startDateStr ? new Date(startDateStr).toLocaleDateString(language) : undefined
  const endDate = endDateStr ? new Date(endDateStr).toLocaleDateString(language) : undefined

  //TODO: How to handle one missing date correctly? Design question
  if (startDate && endDate) {
    const text = `${startDate} - ${endDate}`
    const accessibilityLabel = t('productDetail_exhibit_duration_contentFromTo', { startDate, endDate })
    return { text, accessibilityLabel }
  } else if (startDate) {
    const text = t('productDetail_exhibit_duration_contentFrom', { startDate })
    return { text, accessibilityLabel: text }
  } else {
    const text = t('productDetail_exhibit_duration_contentTo', { endDate })
    return { text, accessibilityLabel: text }
  }
}

export const ProductExhibitDetail: React.FC<ProductExhibitDetailProps> = ({ productDetail }) => {
  const { t, l: language } = useTranslation()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('productDetail_exhibit')
  const { exhibitStartDate, exhibitEndDate, venue, venueDistance } = productDetail
  const exhibitDate = formatDate(t, language, exhibitStartDate, exhibitEndDate)

  return (
    <>
      {venue ? (
        <ProductDetailSection
          testID={addTestIdModifier(testID, 'location_caption')}
          iconSource="MapPin"
          sectionCaptioni18nKey="productDetail_exhibit_location_caption">
          <Address
            name={venue.name}
            city={venue.city}
            street={venue.street}
            postalCode={venue.postalCode}
            distance={venueDistance}
            showDistance
            showCopyToClipboard
            baseTestId="productDetail_exhibit_location"
          />
        </ProductDetailSection>
      ) : null}
      {exhibitStartDate || exhibitEndDate ? (
        <ProductDetailSection
          testID={buildTestId('productDetail_exhibit_duration')}
          iconSource="Calendar"
          sectionCaptioni18nKey="productDetail_exhibit_duration_caption">
          <Text
            accessibilityLabel={exhibitDate.accessibilityLabel}
            accessible
            testID={buildTestId('productDetail_exhibit_duration_content')}
            style={[textStyles.BodyBlack, styles.colorMoonDarkest]}>
            {exhibitDate.text}
          </Text>
        </ProductDetailSection>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  colorMoonDarkest: {
    color: colors.moonDarkest,
  },
})
