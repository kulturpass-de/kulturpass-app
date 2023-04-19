import React from 'react'
import { useTranslation } from '../../../../services/translation/translation'
import { VideoProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'

type ProductVideoDetailProps = {
  productDetail: VideoProductDetail
}

const ageForAgeRating = (ageRating: VideoProductDetail['ageRating']): number => {
  switch (ageRating) {
    case 'NO_RESTRICTION':
      return 0
    case 'OVER_6':
      return 6
    case 'OVER_12':
      return 12
    case 'OVER_16':
      return 16
    case 'OVER_18':
      return 18
  }
}

export const ProductVideoDetail: React.FC<ProductVideoDetailProps> = ({ productDetail }) => {
  const { videoFormat, ageRating, durationInMins } = productDetail
  const { t } = useTranslation()

  let i18nKeyAgeRating: string
  if (ageRating === 'NO_RESTRICTION') {
    i18nKeyAgeRating = t('productDetail_video_ageRating_valueNoRestriction')
  } else {
    i18nKeyAgeRating = t('productDetail_video_ageRating_value', { age: ageForAgeRating(ageRating) })
  }

  return videoFormat || ageRating || durationInMins ? (
    <ProductDetailSection iconSource="Video" sectionCaptioni18nKey="productDetail_video_caption">
      {videoFormat ? (
        <ProductDetailEntry
          i18nKey="productDetail_video_videoFormat"
          value={videoFormat} //TODO: Add videoFormat translations
          valueTestId="productDetail_video_videoFormat_value"
        />
      ) : null}
      {ageRating ? (
        <ProductDetailEntry
          i18nKey="productDetail_video_ageRating"
          value={i18nKeyAgeRating}
          valueTestId="productDetail_video_ageRating_value"
        />
      ) : null}
      {durationInMins ? (
        <ProductDetailEntry
          i18nKey="productDetail_video_duration"
          value={t('productDetail_video_duration_value', { duration: durationInMins })}
          valueTestId="productDetail_video_duration_value"
        />
      ) : null}
    </ProductDetailSection>
  ) : null
}
