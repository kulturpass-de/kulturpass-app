import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BulletListItem } from '../../../components/bullet-list-item/bullet-list-item'
import { LinkText } from '../../../components/link-text/link-text'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export const OrderReportBody: React.FC = () => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const reportOrderAboutCancellationsLink = useFaqLink('REPORT_ORDER_ABOUT_CANCELLATIONS')
  const reportOrderVoucherRedemptionLink = useFaqLink('REPORT_ORDER_VOUCHER_REDEMPTION')
  const reportOrderContactSellerLink = useFaqLink('REPORT_ORDER_CONTACT_SELLER')

  const testId = buildTestId('reservationDetail_report_screen_body')

  return (
    <View>
      <TranslatedText
        i18nKey="reservationDetail_report_screen_body_text_first"
        testID={addTestIdModifier(testId, 'text_first')}
        textStyle="BodyBold"
        textStyleOverrides={{ color: colors.labelColor }}
      />
      <TranslatedText
        i18nKey="reservationDetail_report_screen_body_text_second"
        testID={addTestIdModifier(testId, 'text_second')}
        textStyle="BodyRegular"
        textStyleOverrides={[styles.paddingBottom, { color: colors.labelColor }]}
      />

      <BulletListItem bulletSize={8}>
        <TranslatedText
          i18nKey="reservationDetail_report_screen_body_list_first_item"
          testID={addTestIdModifier(testId, 'list_first_item')}
          textStyle="BodyBold"
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
        />
      </BulletListItem>
      <View style={styles.link}>
        <LinkText
          testID={addTestIdModifier(testId, 'aboutCancellation_link')}
          link={reportOrderAboutCancellationsLink}
          i18nKey="reservationDetail_report_faq_link_text"
        />
      </View>
      <BulletListItem bulletSize={8}>
        <TranslatedText
          i18nKey="reservationDetail_report_screen_body_list_second_item"
          testID={addTestIdModifier(testId, 'list_second_item')}
          textStyle="BodyBold"
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
        />
      </BulletListItem>
      <View style={styles.link}>
        <LinkText
          testID={addTestIdModifier(testId, 'orderVoucherRedemption_link')}
          link={reportOrderVoucherRedemptionLink}
          i18nKey="reservationDetail_report_faq_link_text"
        />
      </View>
      <BulletListItem bulletSize={8}>
        <TranslatedText
          i18nKey="reservationDetail_report_screen_body_list_third_item"
          testID={addTestIdModifier(testId, 'list_third_item')}
          textStyle="BodyBold"
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
        />
      </BulletListItem>
      <BulletListItem bulletSize={8}>
        <TranslatedText
          i18nKey="reservationDetail_report_screen_body_list_fourth_item"
          testID={addTestIdModifier(testId, 'list_fourth_item')}
          textStyle="BodyBold"
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
        />
      </BulletListItem>
      <TranslatedText
        i18nKey="reservationDetail_report_screen_body_text_third"
        testID={addTestIdModifier(testId, 'text_third')}
        textStyle="BodyRegular"
        textStyleOverrides={[styles.paddingTop, { color: colors.labelColor }]}
      />
      <LinkText
        testID={addTestIdModifier(testId, 'contactSeller_link')}
        link={reportOrderContactSellerLink}
        i18nKey="reservationDetail_report_faq_link_text"
      />
      <TranslatedText
        i18nKey="reservationDetail_report_screen_body_text_fourth"
        testID={addTestIdModifier(testId, 'text_fourth')}
        textStyle="BodyRegular"
        textStyleOverrides={[styles.paddingTop, { color: colors.labelColor }]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  text: { flexShrink: 1 },
  paddingBottom: {
    paddingBottom: spacing[6],
  },
  paddingTop: {
    paddingTop: spacing[6],
  },
  link: {
    paddingLeft: 25,
  },
})
