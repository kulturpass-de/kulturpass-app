import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useFormattedDateTime } from '../../../../utils/date/hooks/use-formatted-date-time'
import { CinemaProductDetail } from '../../types/product-detail'
import { ProductDetailSectionDateTime } from '../product-detail-section/product-detail-section-date-time'

export type ProductCinemaDetailProps = {
  productDetail: Partial<Pick<CinemaProductDetail, 'eventStartDate' | 'durationInMins'>>
  testID: TestId
}

export const ProductCinemaDetail: React.FC<ProductCinemaDetailProps> = ({ productDetail, testID }) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { eventStartDate, durationInMins } = productDetail
  const sectionTestID = addTestIdModifier(testID, 'cinema')
  const { t } = useTranslation()
  const formattedEventDateTime = useFormattedDateTime(eventStartDate)

  if (eventStartDate === undefined && durationInMins === undefined) {
    return null
  }

  return (
    <ProductDetailSectionDateTime
      testID={sectionTestID}
      sectionCaptioni18nKey="productDetail_cinema_eventDateTime_caption"
      translatedEventDateTime={
        formattedEventDateTime
          ? t('productDetail_cinema_eventDateTime_value', {
              date: formattedEventDateTime.date,
              time: formattedEventDateTime.time,
            })
          : undefined
      }
      translatedDurationInMins={
        durationInMins !== undefined
          ? t('productDetail_cinema_durationInMins_caption', {
              mins: durationInMins,
            })
          : undefined
      }
    />
  )
}
