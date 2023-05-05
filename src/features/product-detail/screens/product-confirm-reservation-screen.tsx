import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { Button } from '../../../components/button/button'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ScreenContent } from '../../../components/screen/screen-content'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { commerceApi } from '../../../services/api/commerce-api'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useProductImageUrl } from '../../../utils/image/hooks/use-product-image-url'
import { ReservationDetailRouteParams } from '../../reservations/screens/reservation-detail-route'
import { OfferSelectionHeader } from '../components/offer-selection-header'
import { ProductDetail } from '../types/product-detail'
import { useDpsDocumentUrl } from '../../../services/environment-configuration/hooks/use-dps-document-url'
import { ProductConfirmOverview } from '../components/product-confirm-overview'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { useDismissableError } from '../../../services/errors/use-dismissable-error'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'

export type ProductConfirmReservationScreenProps = {
  onBack: () => void
  onClose: () => void
  afterReserveProduct: (params: ReservationDetailRouteParams) => void
  productDetail: ProductDetail
  selectedOffer: Offer
}

export const ProductConfirmReservationScreen: React.FC<ProductConfirmReservationScreenProps> = ({
  onBack,
  onClose,
  afterReserveProduct,
  productDetail,
  selectedOffer,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const [loading, setLoading] = useState(false)

  const productImage = useProductImageUrl(productDetail.images, 'zoom')
  const dpsDocumentUrl = useDpsDocumentUrl()
  const [reservationMutation, reservationMutationResult] = commerceApi.useCreateReservationMutation()

  const reserveProduct = useCallback(async () => {
    if (!selectedOffer.code) {
      return
    }
    setLoading(true)
    const reservation = await reservationMutation({ offerCode: selectedOffer.code })
    if (!('error' in reservation) && reservation.data.code) {
      afterReserveProduct({ orderCode: reservation.data.code })
    }
    setLoading(false)
  }, [reservationMutation, selectedOffer, afterReserveProduct])

  const { visibleError, onDismissVisibleError } = useDismissableError(
    !reservationMutationResult.isLoading ? reservationMutationResult.error : undefined,
  )

  if (
    reservationMutationResult.isError ||
    (reservationMutationResult.isSuccess && !reservationMutationResult.data.code)
  ) {
    return <ErrorAlert error={visibleError} onDismiss={onDismissVisibleError} />
  }

  return (
    <ModalScreen testID={buildTestId('offerSelection')}>
      <LoadingIndicator loading={loading} />
      <OfferSelectionHeader imageUrl={productImage?.imageUrl} onClose={onClose} onBack={onBack} />
      <ScreenContent style={styles.content}>
        <View style={styles.titleContainer}>
          <TranslatedText
            i18nKey="productDetail_confirmReservation_title"
            textStyle="HeadlineH3Extrabold"
            textStyleOverrides={styles.title}
            testID={buildTestId('productDetail_confirmReservation_title')}
          />
          <TranslatedText
            i18nKey="productDetail_confirmReservation_subtitle"
            textStyle="BodyRegular"
            textStyleOverrides={styles.subtitle}
            testID={buildTestId('productDetail_confirmReservation_subtitle')}
          />
          <Text
            style={[textStyles.BodyExtrabold, styles.subtitleBody]}
            accessibilityLabel={t('productDetail_confirmReservation_supplierName')}
            testID={buildTestId('productDetail_confirmReservation_supplierName')}>
            {selectedOffer.shopName}
          </Text>
        </View>
        <ProductConfirmOverview productDetail={productDetail} price={selectedOffer.price} />
        <View style={[styles.consentContainer]}>
          <TranslatedText
            i18nKey="productDetail_confirmReservation_consentText"
            textStyle="BodyRegular"
            testID={buildTestId('productDetail_confirmReservation_consentText')}
            textStyleOverrides={styles.consentText}
          />
          <LinkText
            i18nKey="productDetail_confirmReservation_consentLink"
            link={dpsDocumentUrl}
            iconSize={20}
            textStyle="BodyRegular"
          />
        </View>
      </ScreenContent>
      <View style={styles.submitButton}>
        <Button
          testID={buildTestId('productDetail_confirmReservation_submitButton')}
          i18nKey="productDetail_confirmReservation_submitButton"
          onPress={reserveProduct}
        />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[5],
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
  title: {
    color: colors.moonDarker,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  subtitle: {
    marginBottom: spacing[4],
    color: colors.moonDarkest,
  },
  subtitleBody: {
    textAlign: 'center',
    color: colors.moonDarkest,
  },
  consentContainer: {
    paddingTop: spacing[8],
  },
  consentText: {
    marginBottom: spacing[6],
    color: colors.moonDarkest,
  },
  submitButton: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
})
