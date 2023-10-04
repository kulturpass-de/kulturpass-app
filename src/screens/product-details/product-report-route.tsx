import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { ProductReportBody } from '../../features/product-detail/components/product-report-body'
import { PdpParamList, PdpScreenProps } from '../../navigation/pdp/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { useTranslation } from '../../services/translation/translation'
import { modalCardStyle } from '../../theme/utils'
import { sendMail } from '../../utils/links/utils'
import { ReportScreen } from '../reservations/report-screen'

const MAIL_RECIPIENT = 'meldung@kulturpass.de'

export const ProductReportRouteName = 'ProductReport'

export type ProductReportRouteParams = {
  offerId?: string
  shopName?: string
  shopId?: string
}

export const ProductReportRoute: React.FC<PdpScreenProps<'ProductReport'>> = ({ route }) => {
  const { offerId, shopId, shopName } = route.params

  const { t } = useTranslation()

  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()

  const onPressReportSendMail = useCallback(() => {
    sendMail(
      MAIL_RECIPIENT,
      t('productDetail_report_screen_mail_subject'),
      t('productDetail_report_screen_mail_body', { shopId, offerId, shopName }),
    )
  }, [t, offerId, shopId, shopName])

  const onPressReportAbort = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <ReportScreen
      screenKey="productDetail_report"
      headlineTitleI18nKey="productDetail_report_screen_headline_title"
      bodyTitleI18nKey="productDetail_report_screen_body_title"
      footerAcceptI18nKey="productDetail_report_screen_footer_accept"
      footerAbortI18nKey="productDetail_report_screen_footer_abort"
      onPressAccept={onPressReportSendMail}
      onPressAbort={onPressReportAbort}>
      <ProductReportBody />
    </ReportScreen>
  )
}

export const ProductReportRouteConfig = createRouteConfig({
  name: ProductReportRouteName,
  component: ProductReportRoute,
  options: { cardStyle: modalCardStyle },
})
