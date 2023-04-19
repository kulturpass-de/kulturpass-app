import React from 'react'
import { Text } from 'react-native'
import { ExhibitProductDetail } from '../../types/product-detail'
import { useTranslation } from '../../../../services/translation/translation'
import { Language } from '../../../../services/translation/types'
import { textStyles } from '../../../../theme/typography'
import { ProductDetailSection } from '../product-detail-section'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { colors } from '../../../../theme/colors'

export type ProductExhibitDetailProps = {
  productDetail: ExhibitProductDetail
}

const formatDate = (language: Language, startDateStr?: string, endDateStr?: string): string => {
  const startDate = startDateStr ? new Date(startDateStr) : undefined
  const endDate = endDateStr ? new Date(endDateStr) : undefined
  //TODO: How to handle one missing date correctly? Design question
  return `${startDate?.toLocaleDateString(language) ?? '?'} – ${endDate?.toLocaleDateString(language) ?? '?'}`
}

export const ProductExhibitDetail: React.FC<ProductExhibitDetailProps> = ({ productDetail }) => {
  const { l: language } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const { exhibitStartDate, exhibitEndDate } = productDetail
  return exhibitStartDate || exhibitEndDate ? (
    <ProductDetailSection iconSource="Calendar" sectionCaptioni18nKey="productDetail_exhibit_duration_caption">
      <Text
        testID={buildTestId('productDetail_exhibit_duration_content')}
        style={[textStyles.BodyBlack, { color: colors.moonDarkest }]}>
        {formatDate(language, exhibitStartDate, exhibitEndDate)}
      </Text>
    </ProductDetailSection>
  ) : null
}
