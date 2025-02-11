import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { MobilityOffersHeader } from '../components/mobility-offers-header'
import { MobilityOffersLinkView } from '../components/mobility-offers-link-view'
import { CampaignCodeExpiredError, CampaignNotEligibleError, MobilityCustomError } from '../errors/errors'

export type MobilityOffersErrorPageProps = {
  onClose: () => void
  error: MobilityCustomError
}

export const MobilityOffersErrorPage: React.FC<MobilityOffersErrorPageProps> = ({ onClose, error }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const screenTestId = buildTestId('mobility_offers_error')

  const titleI18Key: AvailableTranslations = useMemo(() => {
    if (error instanceof CampaignNotEligibleError) {
      return 'mobility-offers-not-eligible-title'
    } else if (error instanceof CampaignCodeExpiredError) {
      return 'mobility-offers-code-expired-title'
    } else {
      return 'initial-dynamic-string'
    }
  }, [error])

  const errorMessageI18Key: AvailableTranslations = useMemo(() => {
    if (error instanceof CampaignNotEligibleError) {
      return 'mobility-offers-not-eligible-text'
    } else if (error instanceof CampaignCodeExpiredError) {
      return 'mobility-offers-code-expired-text'
    } else {
      return 'initial-dynamic-string'
    }
  }, [error])

  return (
    <ModalScreen whiteBottom={false} testID={screenTestId}>
      <MobilityOffersHeader onClose={onClose} />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.primaryBackground }]}
        contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'title')}
            i18nKey={titleI18Key}
            textStyle="HeadlineH3Extrabold"
          />

          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            i18nKey={errorMessageI18Key}
            testID={addTestIdModifier(screenTestId, 'error_message')}
          />

          <View style={[styles.roundedView, { backgroundColor: colors.secondaryBackground }]}>
            <View style={styles.containerView}>
              <TranslatedText
                textStyle="BodySmallBold"
                textStyleOverrides={[styles.idListItemText, { color: colors.labelColor }]}
                i18nKey="mobility-offers-ft-rounded-view-title"
                testID={addTestIdModifier(screenTestId, 'sub_title')}
              />
              <Text
                style={[textStyles.BodyRegular, styles.idListItemText, { color: colors.labelColor }]}
                testID={addTestIdModifier(screenTestId, 'voucher_campaign_subject')}>
                {error.message}
              </Text>
            </View>
            <View style={styles.toprightCorner}>
              <Illustration
                testID={addTestIdModifier(screenTestId, 'image')}
                i18nKey="mobility-offers-error-image-alt"
                type="mobility-offers-error-image"
              />
            </View>
          </View>
          <MobilityOffersLinkView />
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={onClose}
          variant="primary"
          testID={addTestIdModifier(screenTestId, 'ok_text')}
          i18nKey="mobility-offers-ft-error-Page-Ok-text"
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
    paddingBottom: spacing[8],
  },
  toprightCorner: {
    position: 'absolute',
    top: -31,
    right: -40,
    resizeMode: 'contain',
  },
  contentTitle: {
    alignSelf: 'center',
    paddingTop: spacing[7],
    flexWrap: 'wrap',
  },
  containerView: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  idListItemText: {
    paddingTop: spacing[1],
    flexWrap: 'wrap',
  },
})
