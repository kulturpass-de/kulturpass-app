import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { Illustration, IllustrationType } from '../../../components/illustration/illustration'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { LinkText } from '../../../components/link-text/link-text'
import { useDpsDocumentUrl } from '../../../services/environment-configuration/hooks/use-dps-document-url'
import { useModalNavigation } from '../../../navigation/modal/hooks'

type OnboardingScreenProps = {
  testID: string
  titleI18nKey: AvailableTranslations
  illustrationType: IllustrationType
  illustrationI18nKey: AvailableTranslations
  contentTitleI18nKey: AvailableTranslations
  contentTextI18nKey: AvailableTranslations
  dataprivacyI18nKey?: AvailableTranslations
  acceptButtonI18nKey: AvailableTranslations
  denyButtonI18nKey?: AvailableTranslations
  onAccept: () => void
  onDeny?: () => void
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  testID,
  titleI18nKey,
  illustrationType,
  illustrationI18nKey,
  contentTitleI18nKey,
  contentTextI18nKey,
  dataprivacyI18nKey,
  onAccept,
  onDeny,
  acceptButtonI18nKey,
  denyButtonI18nKey,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const screenTestID = buildTestId(testID)

  const dpsDocumentUrl = useDpsDocumentUrl()

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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          type={illustrationType}
          testID={addTestIdModifier(screenTestID, 'image')}
          i18nKey={illustrationI18nKey}
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentTitle}
            testID={buildTestId(contentTitleI18nKey)}
            i18nKey={contentTitleI18nKey}
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={buildTestId(contentTextI18nKey)}
            i18nKey={contentTextI18nKey}
            textStyle="BodyRegular"
          />
          {dataprivacyI18nKey ? (
            <View style={styles.linkContainer}>
              <LinkText i18nKey={dataprivacyI18nKey} link={dpsDocumentUrl} />
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.buttonFooter}>
        <Button
          onPress={onAccept}
          variant="primary"
          testID={buildTestId(acceptButtonI18nKey)}
          i18nKey={acceptButtonI18nKey}
        />
        {onDeny && denyButtonI18nKey ? (
          <View style={styles.denyButton}>
            <Button onPress={onDeny} testID={buildTestId(denyButtonI18nKey)} i18nKey={denyButtonI18nKey} />
          </View>
        ) : (
          <View style={styles.buttonSpacer} />
        )}
      </View>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    textAlign: 'center',
    alignItems: 'stretch',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    flexDirection: 'column',
  },
  contentTitle: {
    paddingTop: spacing[7],
    flexWrap: 'wrap',
    textAlign: 'center',
    color: colors.moonDarkest,
  },
  contentText: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  linkContainer: {
    paddingTop: spacing[6],
  },
  buttonFooter: {
    padding: spacing[5],
    borderTopWidth: 2,
    borderTopColor: colors.basicBlack,
    backgroundColor: colors.basicWhite,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  denyButton: {
    paddingTop: spacing[5],
  },
  buttonSpacer: {
    height: 48,
    paddingTop: spacing[5],
  },
})
