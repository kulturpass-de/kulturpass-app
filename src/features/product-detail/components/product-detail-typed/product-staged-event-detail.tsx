import React from 'react'
import { Text } from 'react-native'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { Language } from '../../../../services/translation/types'
import { colors } from '../../../../theme/colors'
import { textStyles } from '../../../../theme/typography'
import { StagedEventProductDetail } from '../../types/product-detail'
import { ProductDetailSection } from '../product-detail-section'

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
  const { buildTestId } = useTestIdBuilder()
  const { venue, eventDateTime, durationInMins } = productDetail
  return (
    <>
      {venue ? (
        <ProductDetailSection iconSource="MapPin" sectionCaptioni18nKey="productDetail_stagedEvent_location_caption">
          {venue.name ? <Text style={[textStyles.BodyBlack, { color: colors.moonDarkest }]}>{venue.name}</Text> : null}
          <Text
            testID={buildTestId('productDetail_stagedEvent_location_street')}
            style={[textStyles.CaptionSemibold, { color: colors.moonDarkest }]}>
            {venue.street}
          </Text>
          <Text
            testID={buildTestId('productDetail_stagedEvent_location_city')}
            style={[textStyles.CaptionSemibold, { color: colors.moonDarkest }]}>
            {venue.postalCode} {venue.city}
          </Text>
        </ProductDetailSection>
      ) : null}
      <ProductDetailSection iconSource="Calendar" sectionCaptioni18nKey="productDetail_stagedEvent_time_caption">
        {eventDateTime ? (
          <Text
            testID={buildTestId('productDetail_stagedEvent_time_date')}
            style={[textStyles.BodyBlack, { color: colors.moonDarkest }]}>
            {formatDate(language, eventDateTime)}
          </Text>
        ) : null}
        {durationInMins ? (
          <Text
            testID={buildTestId('productDetail_stagedEvent_time_duration')}
            style={[textStyles.CaptionSemibold, { color: colors.moonDarkest }]}>
            {t('productDetail_stagedEvent_time_duration', { duration: durationInMins })}
          </Text>
        ) : null}
      </ProductDetailSection>
    </>
  )
}
