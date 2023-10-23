import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { AudioProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'

export type ProductAudioDetailProps = {
  productDetail: AudioProductDetail
  testID: TestId
}

export const ProductAudioDetail: React.FC<ProductAudioDetailProps> = ({ productDetail, testID }) => {
  const { audioFormat, ean } = productDetail
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'audio')
  const { t } = useTranslation()

  return (
    <>
      {audioFormat || ean ? (
        <ProductDetailSection
          testID={sectionTestID}
          iconSource="tag"
          sectionCaptioni18nKey="productDetail_audio_caption">
          {ean ? <ProductDetailEntry i18nKey="productDetail_audio_ean" value={ean} /> : null}
          {audioFormat ? (
            <ProductDetailEntry
              i18nKey="productDetail_audio_audioFormat"
              value={t(`productDetail_audio_audioFormat_${audioFormat}`)}
            />
          ) : null}
        </ProductDetailSection>
      ) : null}
    </>
  )
}
