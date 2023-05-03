import React from 'react'
import { AudioProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'

export type ProductAudioDetailProps = {
  productDetail: AudioProductDetail
}

export const ProductAudioDetail: React.FC<ProductAudioDetailProps> = ({ productDetail }) => {
  const { audioFormat } = productDetail
  const { buildTestId } = useTestIdBuilder()
  return (
    <>
      {audioFormat ? (
        <ProductDetailSection
          testID={buildTestId('productDetail_audio')}
          iconSource="Tag"
          sectionCaptioni18nKey="productDetail_audio_caption">
          <ProductDetailEntry
            i18nKey="productDetail_audio_audioFormat"
            value={audioFormat} //TODO: Add audioFormat translations
            valueTestId="productDetail_audio_audioFormat_value"
          />
        </ProductDetailSection>
      ) : null}
    </>
  )
}
