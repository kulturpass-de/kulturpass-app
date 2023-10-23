import React from 'react'
import { Text } from 'react-native'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { textStyles } from '../../../../theme/typography'
import { useFormattedDateTime } from '../../../../utils/date/hooks/use-formatted-date-time'
import { ExhibitProductDetail } from '../../types/product-detail'
import { Address } from '../address'
import { ProductDetailSection } from '../product-detail-section'

export type ProductExhibitDetailProps = {
  productDetail: ExhibitProductDetail
  testID: TestId
}

const formatDate = (t: ReturnType<typeof useTranslation>['t'], startDate?: string, endDate?: string) => {
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
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()

  const sectionTestID = addTestIdModifier(testID, 'exhibit')
  const { exhibitStartDate, exhibitEndDate, venue, venueDistance, eventDateTime } = productDetail
  const formattedEventDateTime = useFormattedDateTime(eventDateTime)
  const formattedEventStartDate = useFormattedDateTime(exhibitStartDate)
  const formattedEvenEndDate = useFormattedDateTime(exhibitEndDate)
  const exhibitDate = formatDate(t, formattedEventStartDate?.date, formattedEvenEndDate?.date)

  return (
    <>
      {venue ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'location')}
          iconSource="map-pin"
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
      {formattedEventDateTime ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'time')}
          iconSource="calendar"
          sectionCaptioni18nKey="productDetail_exhibit_time_caption">
          <Text
            testID={addTestIdModifier(sectionTestID, 'time_value')}
            style={[textStyles.BodyBlack, { color: colors.labelColor }]}>
            {t('productDetail_exhibit_time_value', {
              date: formattedEventDateTime.date,
              time: formattedEventDateTime.time,
            })}
          </Text>
        </ProductDetailSection>
      ) : null}
      {exhibitStartDate || exhibitEndDate ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'duration')}
          iconSource="calendar"
          sectionCaptioni18nKey="productDetail_exhibit_duration_caption">
          <Text
            accessibilityLabel={exhibitDate.accessibilityLabel}
            accessible
            testID={addTestIdModifier(sectionTestID, 'duration_content')}
            style={[textStyles.BodyBlack, { color: colors.labelColor }]}>
            {exhibitDate.text}
          </Text>
        </ProductDetailSection>
      ) : null}
    </>
  )
}
