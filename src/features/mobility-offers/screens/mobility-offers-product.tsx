import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { formatFullDate } from '../../../utils/date/date-format'
import { MobilityOffersHeader } from '../components/mobility-offers-header'
import { MobilityOffersLinkView } from '../components/mobility-offers-link-view'
import { ClaimVoucherCampaignResponse } from '../types/mobility-voucher-campaign-types'

export type MobilityOffersProductProps = {
  onClose: () => void
  isLoading?: boolean
  showVoucherAlert: () => void
  voucherData: ClaimVoucherCampaignResponse
}

export const MobilityOffersProduct: React.FC<MobilityOffersProductProps> = ({
  onClose,
  isLoading,
  showVoucherAlert,
  voucherData,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const linkToFTApp = voucherData?.redemptionUrl
  const screenTestId = buildTestId('mobility_offers_product')
  const description = voucherData?.description
  const validityInHours = voucherData?.validityInHours
  const formattedDate = useMemo(() => {
    return voucherData?.validityPeriodEnd ? formatFullDate(new Date(voucherData?.validityPeriodEnd)) : undefined
  }, [voucherData?.validityPeriodEnd])
  return (
    <ModalScreen whiteBottom={false} testID={screenTestId}>
      <MobilityOffersHeader showNavBarImage onClose={onClose} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <Illustration
            testID={addTestIdModifier(screenTestId, 'logo')}
            i18nKey="mobility-offers-ft-image-alt"
            type="mobility-offers-ft-image"
          />
          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            i18nKey="discover-more-mobility-offers"
            testID={addTestIdModifier(screenTestId, 'discover_more_mobility_offers_text')}
          />

          <View style={[styles.roundedView, { backgroundColor: colors.secondaryBackground }]}>
            <View style={styles.containerView}>
              <TranslatedText
                textStyle="BodySmallBold"
                textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
                i18nKey="mobility-offers-ft-rounded-view-title"
                testID={addTestIdModifier(screenTestId, 'title')}
              />
              <Text
                style={[textStyles.BodyRegular, styles.idListItemText, { color: colors.labelColor }]}
                testID={addTestIdModifier(screenTestId, 'voucher_campaign_title')}>
                {description}
              </Text>
              {validityInHours ? (
                <TranslatedText
                  textStyle="BodySmallBold"
                  textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
                  i18nKey="mobility-offers-ft-rounded-view-text-2"
                  i18nParams={{ validityInHours }}
                  testID={addTestIdModifier(screenTestId, 'booking_alert_text')}
                />
              ) : null}
            </View>
            <View style={styles.toprightCorner}>
              <Illustration
                testID={addTestIdModifier(screenTestId, 'voucher_campaign_logo')}
                i18nKey="ft-train-image-alt"
                type="ft-train-image"
              />
            </View>
          </View>

          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'sub_title')}
            i18nKey="ft-title-mobility-offers"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
            i18nKey="mobility-offers-ft-free-trip"
            testID={addTestIdModifier(screenTestId, 'sub_text')}
          />
          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
            i18nKey="mobility-offers-ft-and-this-is-how"
            testID={addTestIdModifier(screenTestId, 'working_text_title')}
          />

          <View style={styles.idListContainer}>
            <View style={styles.idListItem}>
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemPointer, { color: colors.labelColor }]}
                i18nKey="mobility-offers-ft-and-this-is-how-point-1"
                testID={addTestIdModifier(screenTestId, 'working_text_title_subpoint_1_pointer')}
              />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
                i18nParams={{
                  validTo: formattedDate,
                }}
                i18nKey="mobility-offers-ft-and-this-is-how-point-1-text"
                testID={addTestIdModifier(screenTestId, 'working_text_title_subpoint_1_text')}
              />
            </View>
            <View style={styles.linkStyle}>
              <LinkText
                testID={addTestIdModifier(screenTestId, 'app_redirection_link')}
                i18nKey="mobility-offers-ft-link-1"
                link={linkToFTApp}
              />
            </View>
            <View style={styles.idListItem}>
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemPointer, { color: colors.labelColor }]}
                i18nKey="mobility-offers-ft-and-this-is-how-point-2"
                testID={addTestIdModifier(screenTestId, 'working_text_title_subpoint_2_pointer')}
              />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
                i18nKey="mobility-offers-ft-and-this-is-how-point-2-text"
                i18nParams={{
                  validityInHours: voucherData?.validityInHours,
                }}
                testID={addTestIdModifier(screenTestId, 'working_text_title_subpoint_2_pointer_text')}
              />
            </View>
          </View>
          <MobilityOffersLinkView />
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={showVoucherAlert}
          variant="primary"
          disabled={isLoading}
          testID={addTestIdModifier(screenTestId, 'get_code_button')}
          i18nKey={'mobility-offers-get-code-now-button_text'}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  contentText: {
    paddingTop: spacing[8],
    flexWrap: 'wrap',
    flex: 1,
  },
  roundedView: {
    flexDirection: 'row',
    marginTop: spacing[7],
    borderRadius: spacing[5],
    backgroundColor: '#FFF',
    paddingStart: spacing[4],
    paddingBottom: spacing[4],
  },
  toprightCorner: {
    position: 'absolute',
    top: -31,
    right: -40,
    resizeMode: 'contain',
  },
  contentTitle: {
    paddingTop: spacing[7],
    flexWrap: 'wrap',
  },
  idListItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[2],
  },
  idListItemPointer: {
    flex: 0.1,
    paddingTop: spacing[3],
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
  },
  idListContainer: {
    paddingBottom: spacing[5],
    flexDirection: 'column',
  },
  containerView: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  idListItemText: {
    flex: 0.9,
    paddingTop: spacing[2],
    flexWrap: 'wrap',
  },
  linkStyle: {
    paddingHorizontal: spacing[7],
  },
})
