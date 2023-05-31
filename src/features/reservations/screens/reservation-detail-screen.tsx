import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { Order } from '../../../services/api/types/commerce/api-types'

import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'

import { ProductDetailOffer } from '../../product-detail/components/product-detail-offer'
import { ProductDetailTitle } from '../../product-detail/components/product-detail-title'
import { ProductDetail } from '../../product-detail/types/product-detail'
import { ReservationDetailFooter } from '../components/reservation-detail-footer'
import { ReservationDetailHeader } from '../components/reservation-detail-header'
import { ProductDetailTyped } from '../../product-detail/components/product-detail-typed'
import { colors } from '../../../theme/colors'
import { ConfirmCancellationAlert } from '../components/confirm-cancellation-alert'
import { commerceApi } from '../../../services/api/commerce-api'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { getReservationOrderTranslations } from '../reservation-i18n'
import { Icon } from '../../../components/icon/icon'
import { ReservationDetailPickupInfo } from '../components/reservation-detail-pickup-info'
import { ReservationDetailStatusImage } from '../components/reservation-detail-status-image'
import { ReservationDetailStatusInfo } from '../components/reservation-detail-status-info'
import { ScreenContent } from '../../../components/screen/screen-content'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { HtmlText } from '../../../components/html-text/html-text'

export type ReservationDetailScreenProps = {
  productDetail?: ProductDetail
  order: Order
  onClose: () => void
  afterCancelReservationTriggered: () => void
}

export const ReservationDetailScreen: React.FC<ReservationDetailScreenProps> = ({
  productDetail,
  onClose,
  afterCancelReservationTriggered,
  order,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const [loading, setLoading] = useState(false)
  const [cancelReservation] = commerceApi.useCancelReservationMutation()

  const [visibleError, setVisibleError] = useState<ErrorWithCode>()
  const [visibleCancellationConfirmationAlert, setVisibleCancellationConfirmationAlert] = useState(false)

  const onPressCancellation = useCallback(() => {
    setVisibleCancellationConfirmationAlert(true)
  }, [])

  const onCancelReservation = useCallback(async () => {
    setVisibleCancellationConfirmationAlert(false)
    setLoading(true)

    try {
      await cancelReservation({ order }).unwrap()
      afterCancelReservationTriggered()
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
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
    <ModalScreen whiteBottom testID={buildTestId('pickupReservationDetail')}>
      <LoadingIndicator loading={loading} />
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <ConfirmCancellationAlert
        visible={visibleCancellationConfirmationAlert}
        onDismiss={onDismissCancellation}
        onConfirm={onCancelReservation}
      />
      <ReservationDetailHeader onClose={onClose} order={order} />

      <ScreenContent>
        <View style={styles.topContainer}>
          {orderStatusTranslattions?.headline ? (
            <TranslatedText
              i18nKey={orderStatusTranslattions.headline}
              testID={buildTestId(orderStatusTranslattions.headline)}
              textStyle={orderStatus === 'READY_FOR_PICKUP' ? 'HeadlineH3Extrabold' : 'HeadlineH4Extrabold'}
              textStyleOverrides={styles.topContainerHeadline}
            />
          ) : null}
          {orderStatus === 'READY_FOR_PICKUP' && orderEntry ? (
            <ReservationDetailPickupInfo orderEntry={orderEntry} />
          ) : null}
          {orderStatus !== 'READY_FOR_PICKUP' ? <ReservationDetailStatusImage order={order} /> : null}
          <ReservationDetailStatusInfo order={order} />
        </View>
        <View style={styles.bottomContainer}>
          {orderStatusTranslattions?.copytext ? (
            <>
              <View style={styles.bottomContainerStatusDescription}>
                <Icon source={'Boings'} width={24} height={24} style={styles.bottomContainerStatusDescriptionIcon} />
                <TranslatedText
                  testID={buildTestId('orderStatus')}
                  i18nKey={orderStatusTranslattions.copytext}
                  textStyle="BodySmallBold"
                  textStyleOverrides={styles.bottomContainerStatusDescriptionText}
                />
              </View>
              <View style={styles.bottomContainerStatusDescriptionSpacer} />
            </>
          ) : null}
          <ProductDetailTitle productDetail={productDetail} />
          <ProductDetailOffer offerInfo={orderEntry} copyAddressToClipboard />

          <ProductDetailTyped productDetail={productDetail} />
          <HtmlText
            testID={buildTestId('productDescription')}
            style={[textStyles.BodyRegular, styles.bottomContainerProductDescription]}
            html={productDetail.description}
          />
        </View>
      </ScreenContent>
      <ReservationDetailFooter
        cancellable={order.cancellable}
        price={order.totalPrice}
        refunds={order.refunds}
        onCancelReservation={onPressCancellation}
      />
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    marginHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingHorizontal: spacing[6],
    backgroundColor: colors.basicWhite,
    borderRadius: spacing[5],
    alignItems: 'center',
    zIndex: 20,
  },
  topContainerHeadline: {
    marginBottom: spacing[5],
    color: colors.moonDarkest,
  },

  bottomContainer: {
    marginTop: -spacing[5],
    paddingTop: spacing[7],
    paddingHorizontal: spacing[5],
    backgroundColor: colors.basicBackground,
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
    color: colors.moonDarkest,
  },
  bottomContainerStatusDescriptionSpacer: {
    backgroundColor: colors.transparentBlack30,
    height: 1,
    marginBottom: spacing[5],
  },
  bottomContainerProductDescription: {
    paddingVertical: spacing[6],
    color: colors.moonDarkest,
  },
})
