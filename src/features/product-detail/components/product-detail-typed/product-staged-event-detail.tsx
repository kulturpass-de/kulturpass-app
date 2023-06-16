import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { Language } from '../../../../services/translation/types'
import { colors } from '../../../../theme/colors'
import { textStyles } from '../../../../theme/typography'
import { StagedEventProductDetail } from '../../types/product-detail'
import { ProductDetailSection } from '../product-detail-section'
import { Address } from '../address'

export type ProductStagedEventDetailProps = {
  productDetail: StagedEventProductDetail
  testID: TestId
}

const formatDate = (language: Language, dateStr: string, oClockLabel: string): string => {
  const date = new Date(dateStr)
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
  return `${date.toLocaleDateString(language)} | ${date.toLocaleTimeString(language, timeOpts)} ${oClockLabel}`
}

export const ProductStagedEventDetail: React.FC<ProductStagedEventDetailProps> = ({ productDetail, testID }) => {
  const { t, l: language } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'stagedEvent')
  const { venue, eventDateTime, durationInMins, venueDistance } = productDetail

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
        {eventDateTime ? (
          <Text
            testID={addTestIdModifier(sectionTestID, 'time_date')}
            style={[textStyles.BodyBlack, styles.colorMoonDarkest]}>
            {formatDate(language, eventDateTime, t('productDetail_stagedEvent_time_oclock_label'))}
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
