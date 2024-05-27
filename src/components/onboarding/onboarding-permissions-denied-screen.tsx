import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { Button } from '../button/button'
import { Illustration, IllustrationType } from '../illustration/illustration'
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
  contentPermissionLeftI18nKey: AvailableTranslations
  contentPermissionRightI18nKey: AvailableTranslations
  contentTextI18nKeyFirst: AvailableTranslations
  acceptButtonI18nKey: AvailableTranslations
  denyButtonI18nKey?: AvailableTranslations
  onAccept: () => void
  onDeny?: () => void
}

export const OnboardingPermissionsDeniedScreen: React.FC<OnboardingScreenProps> = ({
  testID,
  titleI18nKey,
  illustrationType,
  illustrationI18nKey,
  contentTitleI18nKey,
  contentPermissionLeftI18nKey,
  contentPermissionRightI18nKey,
  contentTextI18nKeyFirst,
  onAccept,
  onDeny,
  acceptButtonI18nKey,
  denyButtonI18nKey,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const screenTestID = buildTestId(testID)

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
            textStyleOverrides={[
              onboardingScreenStyles.contentTitle,
              styles.contentTitle,
              { color: colors.labelColor },
            ]}
            testID={buildTestId(contentTitleI18nKey)}
            i18nKey={contentTitleI18nKey}
            textStyle="HeadlineH3Extrabold"
          />

          <View style={styles.deviceStateContainer}>
            <TranslatedText
              textStyleOverrides={[onboardingScreenStyles.contentText, { color: colors.labelColor }]}
              testID={buildTestId(contentPermissionLeftI18nKey)}
              i18nKey={contentPermissionLeftI18nKey}
              textStyle="BodyRegular"
            />
            <TranslatedText
              textStyleOverrides={[
                onboardingScreenStyles.contentText,
                styles.deviceStateText,
                { color: colors.labelColor },
              ]}
              testID={buildTestId(contentPermissionRightI18nKey)}
              i18nKey={contentPermissionRightI18nKey}
              textStyle="BodyExtrabold"
            />
          </View>

          <TranslatedText
            textStyleOverrides={[onboardingScreenStyles.contentText, { color: colors.labelColor }]}
            testID={buildTestId(contentTextI18nKeyFirst)}
            i18nKey={contentTextI18nKeyFirst}
            textStyle="BodyRegular"
          />
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
  deviceStateContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: spacing[5],
  },
  deviceStateText: { textTransform: 'uppercase' },
  contentTitle: {
    textAlign: 'left',
  },
})
