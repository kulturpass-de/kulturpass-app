import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { Language } from '../../../../services/translation/types'
import { colors } from '../../../../theme/colors'
import { textStyles } from '../../../../theme/typography'
import { StagedEventProductDetail } from '../../types/product-detail'
import { ProductDetailSection } from '../product-detail-section'
import { Address } from '../address'

export type ProductStagedEventDetailProps = {
  productDetail: StagedEventProductDetail
}

const formatDate = (language: Language, dateStr: string): string => {
  const date = new Date(dateStr)
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
  return `${date.toLocaleDateString(language)} | ${date.toLocaleTimeString(language, timeOpts)}`
}

export const ProductStagedEventDetail: React.FC<ProductStagedEventDetailProps> = ({ productDetail }) => {
  const { t, l: language } = useTranslation()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('productDetail_stagedEvent')
  const { venue, eventDateTime, durationInMins, venueDistance } = productDetail

  return (
    <>
      {venue ? (
        <ProductDetailSection
          testID={addTestIdModifier(testID, 'location_caption')}
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
            baseTestId="productDetail_stagedEvent_location"
          />
        </ProductDetailSection>
      ) : null}
      <ProductDetailSection
        testID={addTestIdModifier(testID, 'stagedEvent_time')}
        iconSource="Calendar"
        sectionCaptioni18nKey="productDetail_stagedEvent_time_caption">
        {eventDateTime ? (
          <Text
            testID={addTestIdModifier(testID, 'stagedEvent_time_date')}
            style={[textStyles.BodyBlack, styles.colorMoonDarkest]}>
            {formatDate(language, eventDateTime)}
          </Text>
        ) : null}
        {durationInMins ? (
          <Text
            testID={addTestIdModifier(testID, 'stagedEvent_time_duration')}
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
