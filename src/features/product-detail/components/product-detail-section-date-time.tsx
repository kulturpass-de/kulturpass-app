import React from 'react'
import { Text } from 'react-native'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { textStyles } from '../../../theme/typography'
import { ProductDetailSection } from './product-detail-section'

export type ProductDetailSectionDateTimeProps = {
  testID: TestId
  sectionCaptioni18nKey: AvailableTranslations
  translatedEventDateTime?: string
  translatedDurationInMins?: string
}

export const ProductDetailSectionDateTime: React.FC<ProductDetailSectionDateTimeProps> = ({
  testID,
  sectionCaptioni18nKey,
  translatedEventDateTime,
  translatedDurationInMins,
}) => {
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <ProductDetailSection
      testID={addTestIdModifier(testID, 'time')}
      iconSource="calendar"
      sectionCaptioni18nKey={sectionCaptioni18nKey}>
      {translatedEventDateTime !== undefined && (
        <Text
          testID={addTestIdModifier(testID, 'time_value')}
          style={[textStyles.BodyBlack, { color: colors.labelColor }]}>
          {translatedEventDateTime}
        </Text>
      )}

      {translatedDurationInMins !== undefined && (
        <Text
          testID={addTestIdModifier(testID, 'duration_mins_value')}
          style={[textStyles.BodyRegular, { color: colors.labelColor }]}>
          {translatedDurationInMins}
        </Text>
      )}
    </ProductDetailSection>
  )
}
