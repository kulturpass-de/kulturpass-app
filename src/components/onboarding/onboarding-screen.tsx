import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { useLocalizedEnvironmentUrl, getCdcDpsDocumentUrl } from '../../utils/links/hooks/use-localized-environment-url'
import { Button } from '../button/button'
import { IllustrationType, Illustration } from '../illustration/illustration'
import { LinkText } from '../link-text/link-text'
import { ModalScreen } from '../modal-screen/modal-screen'
import { ModalScreenFooter } from '../modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../modal-screen/modal-screen-header'
import { TranslatedText } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'
import { onboardingScreenStyles } from './onboarding-screen-styles'

type OnboardingScreenProps = {
  testID: string
  titleI18nKey: AvailableTranslations
  illustrationType: IllustrationType
  illustrationI18nKey: AvailableTranslations
  contentTitleI18nKey: AvailableTranslations
  contentTextI18nKeyFirst: AvailableTranslations
  contentTextI18nKeySecond: AvailableTranslations
  contentTextI18nKeyThird?: AvailableTranslations
  contentTextI18nKeyFourth?: AvailableTranslations
  dataprivacyI18nKey?: AvailableTranslations
  acceptButtonI18nKey: AvailableTranslations
  denyButtonI18nKey?: AvailableTranslations
  onAccept: () => void
  onDeny?: () => void
  additionalContent?: React.ReactNode
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  testID,
  titleI18nKey,
  illustrationType,
  illustrationI18nKey,
  contentTitleI18nKey,
  contentTextI18nKeyFirst,
  contentTextI18nKeySecond,
  contentTextI18nKeyThird,
  contentTextI18nKeyFourth,
  dataprivacyI18nKey,
  onAccept,
  onDeny,
  acceptButtonI18nKey,
  denyButtonI18nKey,
  additionalContent,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const screenTestID = buildTestId(testID)

  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)

  const modalNavigation = useModalNavigation()

  useEffect(() => {
    return modalNavigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        // Disable going back
        e.preventDefault()
      }
    })
  }, [modalNavigation])

  return (
    <ModalScreen whiteBottom testID={screenTestID}>
      <ModalScreenHeader testID={buildTestId(titleI18nKey)} titleI18nKey={titleI18nKey} />
      <ScrollView
        style={onboardingScreenStyles.scrollView}
        contentContainerStyle={onboardingScreenStyles.scrollViewContainer}>
        <Illustration
          type={illustrationType}
          testID={addTestIdModifier(screenTestID, 'image')}
          i18nKey={illustrationI18nKey}
        />
        <View style={onboardingScreenStyles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[onboardingScreenStyles.contentTitle, { color: colors.labelColor }]}
            testID={buildTestId(contentTitleI18nKey)}
            i18nKey={contentTitleI18nKey}
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={[onboardingScreenStyles.contentText, { color: colors.labelColor }]}
            testID={buildTestId(contentTextI18nKeyFirst)}
            i18nKey={contentTextI18nKeyFirst}
            textStyle="BodyRegular"
          />
          <TranslatedText
            textStyleOverrides={[onboardingScreenStyles.contentText, { color: colors.labelColor }]}
            testID={buildTestId(contentTextI18nKeySecond)}
            i18nKey={contentTextI18nKeySecond}
            textStyle="BodyRegular"
          />
          {contentTextI18nKeyThird ? (
            <TranslatedText
              textStyleOverrides={[onboardingScreenStyles.contentText, { color: colors.labelColor }]}
              testID={buildTestId(contentTextI18nKeyThird)}
              i18nKey={contentTextI18nKeyThird}
              textStyle="BodyRegular"
            />
          ) : null}
          {contentTextI18nKeyFourth ? (
            <TranslatedText
              textStyleOverrides={[onboardingScreenStyles.contentText, { color: colors.labelColor }]}
              testID={buildTestId(contentTextI18nKeyFourth)}
              i18nKey={contentTextI18nKeyFourth}
              textStyle="BodyRegular"
            />
          ) : null}
          {additionalContent}
          {dataprivacyI18nKey ? (
            <View style={styles.linkContainer}>
              <LinkText testID={buildTestId(dataprivacyI18nKey)} i18nKey={dataprivacyI18nKey} link={dpsDocumentUrl} />
            </View>
          ) : null}
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={onAccept}
          variant="primary"
          testID={buildTestId(acceptButtonI18nKey)}
          i18nKey={acceptButtonI18nKey}
        />
        {onDeny && denyButtonI18nKey ? (
          <Button onPress={onDeny} testID={buildTestId(denyButtonI18nKey)} i18nKey={denyButtonI18nKey} />
        ) : (
          <View style={onboardingScreenStyles.buttonSpacer} />
        )}
      </ModalScreenFooter>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  linkContainer: {
    paddingTop: spacing[6],
  },
})
