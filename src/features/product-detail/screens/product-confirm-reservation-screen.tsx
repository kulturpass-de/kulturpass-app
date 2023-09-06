import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button } from '../../../components/button/button'
import { LinkText } from '../../../components/link-text/link-text'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ScreenContent } from '../../../components/screen/screen-content'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { commerceApi } from '../../../services/api/commerce-api'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useDismissableError } from '../../../services/errors/use-dismissable-error'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useProductImageUrl } from '../../../utils/image/hooks/use-product-image-url'
import {
  useLocalizedEnvironmentUrl,
  getCdcDpsDocumentUrl,
} from '../../../utils/links/hooks/use-localized-environment-url'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { ReservationDetailRouteParams } from '../../reservations/screens/reservation-detail-route'
import { OfferSelectionHeader } from '../components/offer-selection-header'
import { ProductConfirmOverview } from '../components/product-confirm-overview'
import { ProductDetail } from '../types/product-detail'
import { ReservationPickup } from './reservation-pickup'

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
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()
  const [loading, setLoading] = useState(false)

  const productImage = useProductImageUrl(productDetail.images, 'zoom')
  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)
  const reservationFaqUrl = useFaqLink('RESERVATION_ABOUT')
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

  const displayErrorAlert =
    reservationMutationResult.isError || (reservationMutationResult.isSuccess && !reservationMutationResult.data.code)

  return (
    <ModalScreen testID={buildTestId('offerSelection')}>
      {displayErrorAlert && <ErrorAlert error={visibleError} onDismiss={onDismissVisibleError} />}
      <LoadingIndicator loading={loading} />
      <OfferSelectionHeader imageUrl={productImage?.imageUrl} onClose={onClose} onBack={onBack} />
      <ScreenContent style={styles.content}>
        <View style={styles.titleContainer}>
          <TranslatedText
            i18nKey="productDetail_confirmReservation_title"
            textStyle="HeadlineH3Extrabold"
            textStyleOverrides={[styles.title, { color: colors.labelColor }]}
            testID={buildTestId('productDetail_confirmReservation_title')}
          />
        </View>
        <View style={styles.subtitleContainer}>
          <Text
            style={[textStyles.BodyExtrabold, { color: colors.labelColor }]}
            accessibilityLabel={t('productDetail_confirmReservation_subtitle') + ' ' + selectedOffer.shopName}
            accessibilityHint={t('productDetail_confirmReservation_supplierName')}
            testID={buildTestId('productDetail_confirmReservation_supplierName')}>
            <TranslatedText
              i18nKey="productDetail_confirmReservation_subtitle"
              textStyle="BodyRegular"
              textStyleOverrides={{ color: colors.labelColor }}
              testID={buildTestId('productDetail_confirmReservation_subtitle')}
            />
            {' ' + selectedOffer.shopName}
          </Text>
        </View>
        <View style={styles.descriptionContainer}>
          <TranslatedText
            i18nKey="productDetail_confirmReservation_description"
            textStyle="BodySmallRegular"
            textStyleOverrides={{ color: colors.labelColor }}
            testID={buildTestId('productDetail_confirmReservation_description')}
          />
        </View>
        <ProductConfirmOverview productDetail={productDetail} price={selectedOffer.price} />
        <View style={[styles.reservationDetailsContainer]}>
          <ReservationPickup productDetail={productDetail} />
          <LinkText
            i18nKey="productDetail_confirmReservation_aboutReservationsFaqLink"
            testID={buildTestId('productDetail_confirmReservation_aboutReservationsFaqLink')}
            link={reservationFaqUrl}
            iconSize={20}
            textStyle="BodySmallMedium"
            style={styles.reservationDetailsLink}
          />
          <LinkText
            i18nKey="productDetail_confirmReservation_consentLink"
            testID={buildTestId('productDetail_confirmReservation_consentLink')}
            link={dpsDocumentUrl}
            iconSize={20}
            textStyle="BodySmallMedium"
            style={styles.reservationDetailsLink}
          />
        </View>
      </ScreenContent>
      <ModalScreenFooter>
        <Button
          testID={buildTestId('productDetail_confirmReservation_submitButton')}
          i18nKey="productDetail_confirmReservation_submitButton"
          onPress={reserveProduct}
          disabled={loading}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[5],
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing[7],
    marginBottom: spacing[5],
  },
  title: {
    textAlign: 'center',
  },
  subtitleContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: spacing[6],
  },
  descriptionContainer: {
    marginBottom: spacing[5],
    alignItems: 'center',
  },
  reservationDetailsContainer: {
    paddingTop: spacing[8],
  },
  reservationDetailsLink: {
    marginBottom: spacing[4],
    textDecorationLine: 'underline',
  },
})
