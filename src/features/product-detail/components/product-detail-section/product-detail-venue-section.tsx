import React from 'react'
import { Text } from 'react-native'
import { GoToSearchButton } from '../../../../components/go-to-search-button/go-to-search-button'
import { AvailableTranslations } from '../../../../components/translated-text/types'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useTextStyles } from '../../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { useFormattedDateTime } from '../../../../utils/date/hooks/use-formatted-date-time'
import { VenueDetails } from '../../types/product-detail'
import { isDefinedAddress } from '../../utils'
import { Address } from '../address'
import { ProductDetailSection } from '../product-detail-section/product-detail-section'
import { ProductDetailSectionDateTime } from '../product-detail-section/product-detail-section-date-time'

export type ProductDetailVenueSectionProps = {
  productDetail: VenueDetails
  testID: TestId
  detailType: 'OrderDetail' | 'ProductDetail'
  startDate?: string
  endDate?: string
  durationInMins?: number
  durationCaptionI18nKey: AvailableTranslations
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

export const ProductDetailVenueSection: React.FC<ProductDetailVenueSectionProps> = ({
  testID,
  detailType,
  startDate,
  endDate,
  durationInMins,
  durationCaptionI18nKey,
  productDetail,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()
  const textStyles = useTextStyles()

  const { venue, venueDistance, eventDateTime } = productDetail
  const formattedEventDateTime = useFormattedDateTime(eventDateTime)
  const formattedEventStartDate = useFormattedDateTime(startDate)
  const formattedEventEndDate = useFormattedDateTime(endDate)
  const formattedDate = formatDate(t, formattedEventStartDate?.date, formattedEventEndDate?.date)

  const address = isDefinedAddress(venue) ? (
    <Address
      name={venue.name}
      city={venue.city}
      street={venue.street}
      postalCode={venue.postalCode}
      distance={venueDistance}
      showDistance
      showCopyToClipboard={detailType === 'OrderDetail'}
      baseTestId={addTestIdModifier(testID, 'location')}
      accessibilityLabelI18nKey="productDetail_exhibit_location_copyToClipboard"
      copiedAccessibilityI18nKey="productDetail_exhibit_location_copiedToClipboard"
    />
  ) : undefined

  return (
    <>
      {address !== undefined ? (
        <ProductDetailSection
          testID={addTestIdModifier(testID, 'location')}
          iconSource="map-pin"
          sectionCaptioni18nKey="productDetail_exhibit_location_caption">
          {detailType !== 'OrderDetail' ? (
            <GoToSearchButton searchTerm={venue?.name} testID={addTestIdModifier(testID, 'location_button')}>
              {address}
            </GoToSearchButton>
          ) : (
            address
          )}
        </ProductDetailSection>
      ) : null}
      {formattedEventDateTime !== undefined || durationInMins !== undefined ? (
        <ProductDetailSectionDateTime
          testID={testID}
          sectionCaptioni18nKey="productDetail_exhibit_time_caption"
          translatedEventDateTime={
            formattedEventDateTime
              ? t('productDetail_exhibit_time_value', {
                  date: formattedEventDateTime.date,
                  time: formattedEventDateTime.time,
                })
              : undefined
          }
          translatedDurationInMins={
            durationInMins ? t('productDetail_stagedEvent_time_duration', { duration: durationInMins }) : undefined
          }
        />
      ) : null}
      {startDate || endDate ? (
        <ProductDetailSection
          testID={addTestIdModifier(testID, 'duration')}
          iconSource="calendar"
          sectionCaptioni18nKey={durationCaptionI18nKey}>
          <Text
            accessibilityLabel={formattedDate.accessibilityLabel}
            accessible
            testID={addTestIdModifier(testID, 'duration_content')}
            style={[textStyles.BodyBlack, { color: colors.labelColor }]}>
            {formattedDate.text}
          </Text>
        </ProductDetailSection>
      ) : null}
    </>
  )
}
