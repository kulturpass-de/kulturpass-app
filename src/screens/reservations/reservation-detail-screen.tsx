import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider } from '../../components/divider/divider'
import { HtmlText } from '../../components/html-text/html-text'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ScreenContent } from '../../components/screen/screen-content'
import { SvgImage } from '../../components/svg-image/svg-image'
import { TextWithIcon } from '../../components/text-with-icon/text-with-icon'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { OfferDetails } from '../../features/product-detail/components/offer-details'
import { ProductDetailOffer } from '../../features/product-detail/components/product-detail-section/product-detail-offer'
import { ShopAccessibilityInfo } from '../../features/product-detail/components/product-detail-section/shop-accessibility-info'
import { ShopDescription } from '../../features/product-detail/components/product-detail-section/shop-description'
import { ProductDetailTitle } from '../../features/product-detail/components/product-detail-title'
import { ProductDetailTyped } from '../../features/product-detail/components/product-detail-typed'
import { ProductDetail } from '../../features/product-detail/types/product-detail'
import { ConfirmCancellationAlert } from '../../features/reservations/components/confirm-cancellation-alert'
import { ReservationDetailFooter } from '../../features/reservations/components/reservation-detail-footer'
import { ReservationDetailHeader } from '../../features/reservations/components/reservation-detail-header'
import { ReservationDetailPickupInfo } from '../../features/reservations/components/reservation-detail-pickup-info'
import { ReservationDetailStatusImage } from '../../features/reservations/components/reservation-detail-status-image'
import { ReservationDetailStatusInfo } from '../../features/reservations/components/reservation-detail-status-info'
import { getReservationOrderTranslations } from '../../features/reservations/reservation-i18n'
import { commerceApi } from '../../services/api/commerce-api'
import { Offer, Order } from '../../services/api/types/commerce/api-types'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { logger } from '../../services/logger'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTextStyles } from '../../theme/hooks/use-text-styles'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type ReservationDetailScreenProps = {
  productDetail: ProductDetail
  selectedOffer?: Offer
  order: Order
  onClose: () => void
  afterCancelReservationTriggered: () => void
  onPressReportButton: () => void
  completedReservation?: boolean
}

export const ReservationDetailScreen: React.FC<ReservationDetailScreenProps> = ({
  productDetail,
  selectedOffer,
  onClose,
  afterCancelReservationTriggered,
  onPressReportButton,
  order,
  completedReservation,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const testID = buildTestId('reservationDetail')
  const textStyles = useTextStyles()

  const [loading, setLoading] = useState(false)
  const [isCancelTriggered, setIsCancelTriggered] = useState(false)
  const [cancelReservation] = commerceApi.useCancelReservationMutation()

  const [visibleCancellationConfirmationAlert, setVisibleCancellationConfirmationAlert] = useState(false)

  const onPressCancellation = useCallback(() => {
    setVisibleCancellationConfirmationAlert(true)
  }, [])

  const onCancelReservation = useCallback(async () => {
    setIsCancelTriggered(true)
    setVisibleCancellationConfirmationAlert(false)
    setLoading(true)

    try {
      await cancelReservation({ order }).unwrap()
      afterCancelReservationTriggered()
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        ErrorAlertManager.current?.showError(error)
      } else {
        logger.warn('cancel reservation error cannot be interpreted', JSON.stringify(error))
        ErrorAlertManager.current?.showError(new UnknownError('Cancel Reservation'))
      }
    } finally {
      setLoading(false)
    }
  }, [afterCancelReservationTriggered, cancelReservation, order])

  const onDismissCancellation = useCallback(() => {
    setVisibleCancellationConfirmationAlert(false)
  }, [])

  const orderStatus = order.status
  const orderEntry = order.entries?.find(() => true)

  if (!productDetail || !orderEntry) {
    return null
  }

  const orderStatusTranslattions = getReservationOrderTranslations(productDetail, orderStatus)

  return (
    <ModalScreen whiteBottom testID={testID}>
      <LoadingIndicator loading={loading} />
      <ConfirmCancellationAlert
        visible={visibleCancellationConfirmationAlert}
        onDismiss={onDismissCancellation}
        onConfirm={onCancelReservation}
      />
      <ReservationDetailHeader onClose={onClose} order={order} />

      <ScreenContent>
        <View style={[styles.topContainer, { backgroundColor: colors.secondaryBackground }]}>
          {orderStatusTranslattions?.headline ? (
            <TranslatedText
              i18nKey={orderStatusTranslattions.headline}
              testID={buildTestId(orderStatusTranslattions.headline)}
              textStyle={orderStatus === 'READY_FOR_PICKUP' ? 'HeadlineH3Extrabold' : 'HeadlineH4Extrabold'}
              textStyleOverrides={[styles.topContainerHeadline, { color: colors.labelColor }]}
            />
          ) : null}
          {orderStatus === 'READY_FOR_PICKUP' && orderEntry ? (
            <ReservationDetailPickupInfo orderEntry={orderEntry} />
          ) : null}
          {orderStatus !== 'READY_FOR_PICKUP' ? <ReservationDetailStatusImage order={order} /> : null}
          <ReservationDetailStatusInfo order={order} />
        </View>
        <View style={[styles.bottomContainer, { backgroundColor: colors.primaryBackground }]}>
          {orderStatusTranslattions?.copytext ? (
            <>
              <View style={styles.bottomContainerStatusDescription}>
                <SvgImage type={'boings'} width={24} height={24} style={styles.bottomContainerStatusDescriptionIcon} />
                <TranslatedText
                  testID={buildTestId(orderStatusTranslattions.copytext)}
                  i18nKey={orderStatusTranslattions.copytext}
                  textStyle="BodySmallBold"
                  textStyleOverrides={[styles.bottomContainerStatusDescriptionText, { color: colors.labelColor }]}
                />
              </View>
              <Divider marginBottom={spacing[5]} marginTop={0} />
            </>
          ) : null}
          <ProductDetailTitle productDetail={productDetail} />
          <ProductDetailOffer offerInfo={orderEntry} copyAddressToClipboard />

          <ProductDetailTyped productDetail={productDetail} detailType="OrderDetail" />
          <HtmlText
            testID={addTestIdModifier(testID, 'productDescription')}
            style={[textStyles.BodyRegular, styles.bottomContainerProductDescription, { color: colors.labelColor }]}
            html={productDetail.description}
          />
          <View style={styles.report}>
            <TextWithIcon iconType="report" i18nKey="reservationDetail_report_button" onPress={onPressReportButton} />
          </View>
          {orderEntry.offerPriceAdditionalInfo || orderEntry.offerDescription ? (
            <View style={styles.offerDetailsSection}>
              <Divider marginBottom={0} marginTop={0} />
              <View style={styles.offerDetailsSectionVerticalSpacing}>
                <OfferDetails
                  testID={addTestIdModifier(testID, 'accessibility')}
                  description={orderEntry.offerDescription}
                  priceAdditionalInfo={orderEntry.offerPriceAdditionalInfo}
                />
              </View>
            </View>
          ) : null}
          {orderEntry.shopDescription ? (
            <View style={styles.offerDetailsSection}>
              <Divider marginBottom={0} marginTop={0} />
              <View style={styles.offerDetailsSectionVerticalSpacing}>
                <ShopDescription
                  testID={addTestIdModifier(testID, 'shop_description')}
                  shopDescription={orderEntry.shopDescription}
                />
              </View>
            </View>
          ) : null}
          {selectedOffer ? (
            <>
              <Divider marginBottom={0} marginTop={0} />
              <ShopAccessibilityInfo
                testID={addTestIdModifier(testID, 'accessibility')}
                selectedOffer={selectedOffer}
              />
            </>
          ) : null}
        </View>
      </ScreenContent>
      <ReservationDetailFooter
        isCancelTriggered={isCancelTriggered}
        completedReservation={completedReservation}
        orderStatus={order.status}
        cancellable={order.cancellable}
        price={order.totalPrice}
        refunds={order.refunds}
        onCancelReservation={onPressCancellation}
        fulfillmentOption={productDetail.fulfillmentOption}
      />
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    marginHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingHorizontal: spacing[6],
    borderRadius: spacing[5],
    alignItems: 'center',
    zIndex: 20,
  },
  topContainerHeadline: {
    marginBottom: spacing[5],
  },

  bottomContainer: {
    marginTop: -spacing[5],
    paddingTop: spacing[7],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    zIndex: 10,
  },
  bottomContainerStatusDescription: {
    flexDirection: 'row',
    marginHorizontal: spacing[2],
  },
  bottomContainerStatusDescriptionIcon: {
    marginRight: spacing[2],
  },
  bottomContainerStatusDescriptionText: {
    flex: 1,
    marginBottom: spacing[5],
  },
  bottomContainerProductDescription: {
    paddingTop: spacing[6],
  },
  report: {
    flex: 1,
    width: '100%',
    marginVertical: spacing[6],
    alignItems: 'center',
  },
  offerDetailsSection: {
    flexDirection: 'column',
    width: '100%',
  },
  offerDetailsSectionVerticalSpacing: {
    paddingVertical: spacing[7],
  },
})
