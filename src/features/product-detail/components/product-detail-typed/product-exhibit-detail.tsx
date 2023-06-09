import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { Language } from '../../../../services/translation/types'
import { colors } from '../../../../theme/colors'
import { textStyles } from '../../../../theme/typography'
import { ExhibitProductDetail } from '../../types/product-detail'
import { Address } from '../address'
import { ProductDetailSection } from '../product-detail-section'

export type ProductExhibitDetailProps = {
  productDetail: ExhibitProductDetail
  testID: TestId
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

export const ProductExhibitDetail: React.FC<ProductExhibitDetailProps> = ({ productDetail, testID }) => {
  const { t, l: language } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'exhibit')
  const { exhibitStartDate, exhibitEndDate, venue, venueDistance } = productDetail
  const exhibitDate = formatDate(t, language, exhibitStartDate, exhibitEndDate)

  return (
    <>
      {venue ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'location')}
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
            baseTestId={addTestIdModifier(sectionTestID, 'location')}
          />
        </ProductDetailSection>
      ) : null}
      {exhibitStartDate || exhibitEndDate ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'duration')}
          iconSource="Calendar"
          sectionCaptioni18nKey="productDetail_exhibit_duration_caption">
          <Text
            accessibilityLabel={exhibitDate.accessibilityLabel}
            accessible
            testID={addTestIdModifier(sectionTestID, 'duration_content')}
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
