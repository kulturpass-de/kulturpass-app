import React from 'react'
import { Text } from 'react-native'
import { GoToSearchButton } from '../../../../components/go-to-search-button/go-to-search-button'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useTextStyles } from '../../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { useFormattedDateTime } from '../../../../utils/date/hooks/use-formatted-date-time'
import { StagedEventProductDetail } from '../../types/product-detail'
import { isDefinedAddress } from '../../utils'
import { Address } from '../address'
import { ProductDetailSection } from '../product-detail-section/product-detail-section'

export type ProductStagedEventDetailProps = {
  productDetail: StagedEventProductDetail
  testID: TestId
  detailType: 'OrderDetail' | 'ProductDetail'
}

export const ProductStagedEventDetail: React.FC<ProductStagedEventDetailProps> = ({
  productDetail,
  testID,
  detailType,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()
  const [textStyles] = useTextStyles()

  const sectionTestID = addTestIdModifier(testID, 'stagedEvent')
  const { venue, eventDateTime, durationInMins, venueDistance } = productDetail
  const formattedEventStartDate = useFormattedDateTime(eventDateTime)

  const address = isDefinedAddress(venue) ? (
    <Address
      name={venue.name}
      city={venue.city}
      street={venue.street}
      postalCode={venue.postalCode}
      distance={venueDistance}
      showDistance
      showCopyToClipboard={detailType === 'OrderDetail'}
      baseTestId={addTestIdModifier(sectionTestID, 'location')}
      accessibilityLabelI18nKey="productDetail_stagedEvent_copyToClipboard"
      copiedAccessibilityI18nKey="productDetail_stagedEvent_copiedToClipboard"
    />
  ) : undefined

  return (
    <>
      {address !== undefined ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'location_caption')}
          iconSource="map-pin"
          sectionCaptioni18nKey="productDetail_stagedEvent_location_caption">
          {detailType !== 'OrderDetail' ? (
            <GoToSearchButton searchTerm={venue?.name} testID={addTestIdModifier(sectionTestID, 'location_button')}>
              {address}
            </GoToSearchButton>
          ) : (
            address
          )}
        </ProductDetailSection>
      ) : null}
      {formattedEventStartDate || durationInMins ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'time')}
          iconSource="calendar"
          sectionCaptioni18nKey="productDetail_stagedEvent_time_caption">
          {formattedEventStartDate ? (
            <Text
              testID={addTestIdModifier(sectionTestID, 'time_value')}
              style={[textStyles.BodyBlack, { color: colors.labelColor }]}>
              {t('productDetail_stagedEvent_time_value', {
                date: formattedEventStartDate.date,
                time: formattedEventStartDate.time,
              })}
            </Text>
          ) : null}
          {durationInMins ? (
            <Text
              testID={addTestIdModifier(sectionTestID, 'time_duration')}
              style={[textStyles.BodyRegular, { color: colors.labelColor }]}>
              {t('productDetail_stagedEvent_time_duration', { duration: durationInMins })}
            </Text>
          ) : null}
        </ProductDetailSection>
      ) : null}
    </>
  )
}
