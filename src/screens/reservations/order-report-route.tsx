import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { OrderReportBody } from '../../features/reservations/components/order-report-body'
import { OrderReportConfirmDialog } from '../../features/reservations/components/order-report-confirm-dialog'
import { PdpParamList, PdpScreenProps } from '../../navigation/pdp/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { useTranslation } from '../../services/translation/translation'
import { modalCardStyle } from '../../theme/utils'
import { sendMail } from '../../utils/links/utils'
import { ReportScreen } from './report-screen'

const MAIL_RECIPIENT = 'support@kulturpass.de'

export const OrderReportRouteName = 'OrderReport'

export type OrderReportRouteParams = {
  offerId?: string
  shopName?: string
  shopId?: string
  orderId?: string
}

export const OrderReportRoute: React.FC<PdpScreenProps<'OrderReport'>> = ({ route }) => {
  const { offerId, shopId, shopName, orderId } = route.params

  const { t } = useTranslation()

  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()
  const [orderReportConfirmationVisible, setOrderReportConfirmationVisible] = useState(false)

  const onPressReportSendMail = useCallback(() => {
    setOrderReportConfirmationVisible(false)
    sendMail(
      MAIL_RECIPIENT,
      t('reservationDetail_report_screen_mail_subject'),
      t('reservationDetail_report_screen_mail_body', { shopId, offerId, shopName, orderId }),
    )
  }, [t, shopId, offerId, shopName, orderId])

  const onPressShowConfirmation = useCallback(() => {
    setOrderReportConfirmationVisible(true)
  }, [])

  const onPressDismissConfirmation = useCallback(() => {
    setOrderReportConfirmationVisible(false)
    navigation.goBack()
  }, [navigation])

  const onPressReportAbort = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <>
      <OrderReportConfirmDialog
        visible={orderReportConfirmationVisible}
        onDismiss={onPressDismissConfirmation}
        onConfirm={onPressReportSendMail}
      />
      <ReportScreen
        screenKey="reservationDetail_report"
        headlineTitleI18nKey="reservationDetail_report_screen_headline_title"
        bodyTitleI18nKey="reservationDetail_report_screen_body_title"
        footerAcceptI18nKey="reservationDetail_report_screen_footer_accept"
        footerAbortI18nKey="reservationDetail_report_screen_footer_abort"
        onPressAccept={onPressShowConfirmation}
        onPressAbort={onPressReportAbort}>
        <OrderReportBody />
      </ReportScreen>
    </>
  )
}

export const OrderReportRouteConfig = createRouteConfig({
  name: OrderReportRouteName,
  component: OrderReportRoute,
  options: { cardStyle: modalCardStyle },
})
