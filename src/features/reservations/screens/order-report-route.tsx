import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { ReportScreen } from '../../../components/report/report-screen'
import { PdpParamList, PdpScreenProps } from '../../../navigation/pdp/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { useTranslation } from '../../../services/translation/translation'
import { modalCardStyle } from '../../../theme/utils'
import { sendMail } from '../../../utils/links/utils'
import { OrderReportBody } from '../components/order-report-body'

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

  const onPressReportSendMail = useCallback(() => {
    sendMail(
      MAIL_RECIPIENT,
      t('reservationDetail_report_screen_mail_subject'),
      t('reservationDetail_report_screen_mail_body', { shopId, offerId, shopName, orderId }),
    )
  }, [t, shopId, offerId, shopName, orderId])

  const onPressReportAbort = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <ReportScreen
      screenKey="reservationDetail_report"
      headlineTitleI18nKey="reservationDetail_report_screen_headline_title"
      bodyTitleI18nKey="reservationDetail_report_screen_body_title"
      footerAcceptI18nKey="reservationDetail_report_screen_footer_accept"
      footerAbortI18nKey="reservationDetail_report_screen_footer_abort"
      onPressAccept={onPressReportSendMail}
      onPressAbort={onPressReportAbort}>
      <OrderReportBody />
    </ReportScreen>
  )
}

export const OrderReportRouteConfig = createRouteConfig({
  name: OrderReportRouteName,
  component: OrderReportRoute,
  options: { cardStyle: modalCardStyle },
})
