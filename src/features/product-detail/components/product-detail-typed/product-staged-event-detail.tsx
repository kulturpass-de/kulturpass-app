import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { colors } from '../../../../theme/colors'
import { textStyles } from '../../../../theme/typography'
import { useFormattedDateTime } from '../../../../utils/date/hooks/use-formatted-date-time'
import { StagedEventProductDetail } from '../../types/product-detail'
import { Address } from '../address'
import { ProductDetailSection } from '../product-detail-section'

export type ProductStagedEventDetailProps = {
  productDetail: StagedEventProductDetail
  testID: TestId
}

export const ProductStagedEventDetail: React.FC<ProductStagedEventDetailProps> = ({ productDetail, testID }) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'stagedEvent')
  const { venue, eventDateTime, durationInMins, venueDistance } = productDetail
  const formattedEventStartDate = useFormattedDateTime(eventDateTime)

  return (
    <>
      {venue ? (
        <ProductDetailSection
          testID={addTestIdModifier(sectionTestID, 'location_caption')}
          iconSource="MapPin"
          sectionCaptioni18nKey="productDetail_stagedEvent_location_caption">
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
      <ProductDetailSection
        testID={addTestIdModifier(sectionTestID, 'time')}
        iconSource="Calendar"
        sectionCaptioni18nKey="productDetail_stagedEvent_time_caption">
        {formattedEventStartDate ? (
          <Text
            testID={addTestIdModifier(sectionTestID, 'time_value')}
            style={[textStyles.BodyBlack, styles.colorMoonDarkest]}>
            {t('productDetail_stagedEvent_time_value', {
              date: formattedEventStartDate.date,
              time: formattedEventStartDate.time,
            })}
          </Text>
        ) : null}
        {durationInMins ? (
          <Text
            testID={addTestIdModifier(sectionTestID, 'time_duration')}
            style={[textStyles.BodyRegular, styles.colorMoonDarkest]}>
            {t('productDetail_stagedEvent_time_duration', { duration: durationInMins })}
          </Text>
        ) : null}
      </ProductDetailSection>
    </>
  )
}

const styles = StyleSheet.create({
  colorMoonDarkest: {
    color: colors.moonDarkest,
  },
})
