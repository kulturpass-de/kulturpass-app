import Clipboard from '@react-native-clipboard/clipboard'
import { t } from 'i18next'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { CopyToClipboard } from '../../../components/copy-to-clipboard/copy-to-clipboard'
import { Divider } from '../../../components/divider/divider'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ScreenContent } from '../../../components/screen/screen-content'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { addTestIdModifier, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { formatFullDate } from '../../../utils/date/date-format'
import { openLink, linkLogger } from '../../../utils/links/utils'
import { MobilityOffersDetailFooter } from '../components/mobility-offers-detail-footer'
import { MobilityOffersHeader } from '../components/mobility-offers-header'
import { ClaimVoucherCampaignResponse } from '../types/mobility-voucher-campaign-types'

export type MobilityOffersProductDetailScreenProps = {
  onClose: () => void
  voucherData: ClaimVoucherCampaignResponse
}

export const MobilityOffersProductDetailScreen: React.FC<MobilityOffersProductDetailScreenProps> = ({
  onClose,
  voucherData,
}) => {
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()
  const [textStyles] = useTextStyles()
  const screenTestId = buildTestId('mobility_offers_product_detail')
  const copyCodeToClipboard = useCallback((code: string) => {
    Clipboard.setString(code)
  }, [])
  const handleCopyPress = useCallback(() => {
    if (voucherData?.voucher?.code) {
      copyCodeToClipboard(voucherData.voucher.code)
    }
  }, [voucherData, copyCodeToClipboard])

  const mobilityOfferAppUrl = voucherData?.redemptionUrl
  const onPressRedirectToMobilityOfferAppUrl = useCallback(async () => {
    await openLink(mobilityOfferAppUrl).catch(linkLogger)
  }, [mobilityOfferAppUrl])

  const formattedDate = useMemo(() => {
    return voucherData?.validityPeriodEnd ? formatFullDate(new Date(voucherData?.validityPeriodEnd)) : undefined
  }, [voucherData?.validityPeriodEnd])

  const faqLink = useFaqLink('VOUCHER_CAMPAIGN_FLIXTRAIN')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <MobilityOffersHeader showBackDrop onClose={onClose} />
      <ScreenContent>
        <View style={[styles.topContainer, { backgroundColor: colors.secondaryBackground }]}>
          <Illustration
            testID={addTestIdModifier(screenTestId, 'logo')}
            i18nKey="mobility-offers-ft-image-alt"
            type="mobility-offers-ft-image"
          />
          <TranslatedText
            textStyle="HeadlineH3Extrabold"
            i18nKey="mobility_offers_ft_product_detail_title"
            testID={addTestIdModifier(screenTestId, 'title')}
            textStyleOverrides={[styles.title, textStyles.HeadlineH3Extrabold, { color: colors.labelColor }]}
          />
          <TranslatedText
            i18nKey="mobility_offers_code_title"
            textStyle="HeadlineH3Extrabold"
            textStyleOverrides={[styles.title, textStyles.BodySmallRegular, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'code_title')}
          />
          <View style={styles.copyContentContainer}>
            <Text
              style={[styles.voucherCodeStyle, textStyles.HeadlineH3Extrabold, { color: colors.labelColor }]}
              testID={addTestIdModifier(screenTestId, 'voucher_code')}>
              {voucherData?.voucher?.code}
            </Text>
            <CopyToClipboard
              baseTestId={'baseTestId'}
              accessibilityLabelI18nKey={'mobility_offers_ft_product_detail_copy_to_clipboard'}
              copiedAccessibilityI18nKey={'mobility_offers_ft_product_detail_copy_to_clipboard'}
              onPress={handleCopyPress}
            />
          </View>
          <Button
            variant="tertiary"
            i18nKey="mobility_offers_ft_product_detail_redirection_text"
            iconSource="link-arrow"
            iconPosition="left"
            widthOption="grow"
            onPress={onPressRedirectToMobilityOfferAppUrl}
            accessibilityHint={t('external_link_accessibility_announcement')}
          />
          <TranslatedText
            i18nKey="mobility_offers_ft_product_detail_disclaimer_text"
            textStyle="HeadlineH3Extrabold"
            textStyleOverrides={[styles.disclaimerText, textStyles.CaptionSemibold, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'disclaimer_text')}
          />
        </View>
        <View style={[styles.middleContainer, { backgroundColor: colors.primaryBackground }]}>
          <View style={styles.topContainerSubtext}>
            <SvgImage type={'boings'} width={24} height={24} />
            <TranslatedText
              i18nKey="mobility_offers_ft_product_detail_booking_alert_text"
              i18nParams={{
                validityInHours: voucherData?.validityInHours,
                validTo: formattedDate,
              }}
              textStyle="HeadlineH3Extrabold"
              textStyleOverrides={[textStyles.BodyBold, { color: colors.labelColor }]}
              testID={addTestIdModifier(screenTestId, 'booking_alert_text')}
            />
          </View>
          <Divider marginBottom={spacing[3]} />
          <View style={styles.bottomContainer}>
            <TranslatedText
              i18nKey="ft-title-mobility-offers"
              textStyle="HeadlineH3Extrabold"
              textStyleOverrides={[textStyles.HeadlineH3Extrabold, { color: colors.labelColor }]}
              testID={addTestIdModifier(screenTestId, 'sub_title')}
            />
            <TranslatedText
              i18nKey="mobility_offers_ft_product_detail_sub_text"
              i18nParams={{
                validityInHours: voucherData?.validityInHours,
                validTo: formattedDate,
              }}
              textStyle="HeadlineH3Extrabold"
              textStyleOverrides={[styles.bottomContainerSubText, textStyles.BodyRegular, { color: colors.labelColor }]}
              testID={addTestIdModifier(screenTestId, 'sub_text')}
            />
          </View>
          <View style={[styles.mobilityOffersFaqContainer]}>
            <LinkText
              i18nKey="mobility_offers_ft_product_detail_hyperlink"
              testID={addTestIdModifier(screenTestId, 'faq_hyperlink')}
              link={faqLink}
              iconSize={20}
              textStyle="BodySmallSemibold"
              style={styles.mobilityOffersFaqContainerLink}
            />
          </View>
        </View>
      </ScreenContent>
      <MobilityOffersDetailFooter />
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    marginHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[7],
    borderRadius: spacing[5],
    alignItems: 'center',
    zIndex: 20,
  },
  title: {
    textAlign: 'center',
    marginTop: spacing[5],
  },
  voucherCodeStyle: {
    textAlign: 'center',
  },
  disclaimerText: {
    textAlign: 'center',
    marginTop: spacing[7],
  },
  topContainerSubtext: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
    flexDirection: 'row',
    columnGap: spacing[3],
  },
  mobilityOffersFaqContainer: {
    paddingTop: spacing[8],
  },
  mobilityOffersFaqContainerLink: {
    marginBottom: spacing[4],
    textDecorationLine: 'underline',
  },
  middleContainer: {
    zIndex: 10,
    paddingTop: spacing[4],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  bottomContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  bottomContainerSubText: {
    marginTop: spacing[6],
  },
  copyContentContainer: {
    flexDirection: 'row',
    columnGap: 12,
    marginBottom: spacing[5],
    marginTop: spacing[2],
  },
})
