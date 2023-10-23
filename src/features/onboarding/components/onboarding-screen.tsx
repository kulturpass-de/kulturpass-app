import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { Illustration, IllustrationType } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import {
  useLocalizedEnvironmentUrl,
  getCdcDpsDocumentUrl,
} from '../../../utils/links/hooks/use-localized-environment-url'

type OnboardingScreenProps = {
  testID: string
  titleI18nKey: AvailableTranslations
  illustrationType: IllustrationType
  illustrationI18nKey: AvailableTranslations
  contentTitleI18nKey: AvailableTranslations
  contentTextI18nKeyFirst: AvailableTranslations
  contentTextI18nKeySecond: AvailableTranslations
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          type={illustrationType}
          testID={addTestIdModifier(screenTestID, 'image')}
          i18nKey={illustrationI18nKey}
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={buildTestId(contentTitleI18nKey)}
            i18nKey={contentTitleI18nKey}
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            testID={buildTestId(contentTextI18nKeyFirst)}
            i18nKey={contentTextI18nKeyFirst}
            textStyle="BodyRegular"
          />
          <TranslatedText
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
            testID={buildTestId(contentTextI18nKeySecond)}
            i18nKey={contentTextI18nKeySecond}
            textStyle="BodyRegular"
          />
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
          <View style={styles.buttonSpacer} />
        )}
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
  },
  contentText: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
  },
  linkContainer: {
    paddingTop: spacing[6],
  },
  buttonSpacer: {
    height: 48,
  },
})
