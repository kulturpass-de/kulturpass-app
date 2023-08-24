import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Divider } from '../../../components/divider/divider'
import { HtmlText } from '../../../components/html-text/html-text'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ScreenContent } from '../../../components/screen/screen-content'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TextWithIcon } from '../../../components/text-with-icon/text-with-icon'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { commerceApi } from '../../../services/api/commerce-api'
import { Offer, Order } from '../../../services/api/types/commerce/api-types'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { ProductDetailOffer } from '../../product-detail/components/product-detail-offer'
import { ProductDetailTitle } from '../../product-detail/components/product-detail-title'
import { ProductDetailTyped } from '../../product-detail/components/product-detail-typed'
import { ShopAccessibilityInfo } from '../../product-detail/components/shop-accessibility-info'
import { ProductDetail } from '../../product-detail/types/product-detail'
import { ConfirmCancellationAlert } from '../components/confirm-cancellation-alert'
import { ReservationDetailFooter } from '../components/reservation-detail-footer'
import { ReservationDetailHeader } from '../components/reservation-detail-header'
import { ReservationDetailPickupInfo } from '../components/reservation-detail-pickup-info'
import { ReservationDetailStatusImage } from '../components/reservation-detail-status-image'
import { ReservationDetailStatusInfo } from '../components/reservation-detail-status-info'
import { getReservationOrderTranslations } from '../reservation-i18n'

export type ReservationDetailScreenProps = {
  productDetail?: ProductDetail
  order: Order
  onClose: () => void
  afterCancelReservationTriggered: () => void
  onPressReportButton: () => void
  completedReservation?: boolean
}

export const ReservationDetailScreen: React.FC<ReservationDetailScreenProps> = ({
  productDetail,
  onClose,
  afterCancelReservationTriggered,
  onPressReportButton,
  order,
  completedReservation,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

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
        ErrorAlertManager.current?.showError(new UnknownError())
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
  const selectedOffer: Offer | undefined = productDetail.offers?.find(offer => offer.id === orderEntry.offerId)
  const orderStatusTranslattions = getReservationOrderTranslations(productDetail, orderStatus)

  return (
    <ModalScreen whiteBottom testID={buildTestId('reservationDetail')}>
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

          <ProductDetailTyped productDetail={productDetail} />
          <HtmlText
            testID={buildTestId('reservationDetail_productDescription')}
            style={[textStyles.BodyRegular, styles.bottomContainerProductDescription, { color: colors.labelColor }]}
            html={productDetail.description}
          />
          <View style={styles.report}>
            <TextWithIcon iconType="report" i18nKey="reservationDetail_report_button" onPress={onPressReportButton} />
          </View>
          {selectedOffer ? (
            <>
              <Divider marginBottom={0} marginTop={0} />
              <ShopAccessibilityInfo
                testID={buildTestId('reservationDetail_accessibility')}
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
})
