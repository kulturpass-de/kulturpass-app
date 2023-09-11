import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { BulletListItem } from '../../components/bullet-list-item/bullet-list-item'
import { Button } from '../../components/button/button'
import { Illustration } from '../../components/illustration/illustration'
import { LinkText } from '../../components/link-text/link-text'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../components/translated-text/types'
import { addTestIdModifier, buildTestId, TestId } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { useLocalizedEnvironmentUrl, getCdcDpsDocumentUrl } from '../../utils/links/hooks/use-localized-environment-url'
import { RegistrationDataPrivacyCancelAlert } from './registration-data-privacy-cancel-alert'

export type RegistrationDataPrivacyScreenProps = {
  onHeaderClose: () => void
  onContinue: () => void
  onCancelRegistration: () => void
}
const SCREEN_TEST_ID = 'registration_data_privacy'

export type BulletListItemProps = {
  testID: TestId
  i18nKey: AvailableTranslations
}

const BulletListItemWrapper: React.FC<BulletListItemProps> = ({ testID, i18nKey }) => {
  const { colors } = useTheme()
  return (
    <BulletListItem>
      <TranslatedText
        textStyle="BodyRegular"
        testID={testID}
        i18nKey={i18nKey}
        textStyleOverrides={{ color: colors.labelColor }}
      />
    </BulletListItem>
  )
}

export const RegistrationDataPrivacyScreen: React.FC<RegistrationDataPrivacyScreenProps> = ({
  onHeaderClose,
  onContinue,
  onCancelRegistration,
}) => {
  const { colors } = useTheme()
  const [showCancelAlert, setShowCancelAlert] = useState(false)
  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)

  const onPressCancelRegistration = useCallback(() => {
    setShowCancelAlert(true)
  }, [])
  const modalOnCancelPressed = useCallback(() => {
    setShowCancelAlert(false)
    onCancelRegistration()
  }, [onCancelRegistration])
  const modalOnContinuePressed = useCallback(() => {
    setShowCancelAlert(false)
  }, [])

  return (
    <ModalScreen whiteBottom testID={buildTestId(SCREEN_TEST_ID)}>
      <ModalScreenHeader
        titleI18nKey="registration_data_privacy_screen_title"
        testID={addTestIdModifier(SCREEN_TEST_ID, 'screen_title')}
        onPressClose={onHeaderClose}
      />
      <ScreenContent style={styles.screenContent}>
        <Illustration
          testID={addTestIdModifier(SCREEN_TEST_ID, 'screen_image_alt')}
          i18nKey="registration_data_privacy_screen_image_alt"
          type="data-privacy"
        />
        <TranslatedText
          i18nKey="registration_data_privacy_headline"
          textStyle={'HeadlineH3Extrabold'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'headline')}
          textStyleOverrides={[styles.headline, { color: colors.labelColor }]}
        />
        <TranslatedText
          i18nKey="registration_data_privacy_introtext"
          textStyle={'BodyRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'introtext')}
          textStyleOverrides={[styles.introtext, { color: colors.labelColor }]}
        />
        <BulletListItemWrapper
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item1')}
          i18nKey={'registration_data_privacy_item1'}
        />
        <BulletListItemWrapper
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item2')}
          i18nKey={'registration_data_privacy_item2'}
        />
        <BulletListItemWrapper
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item3')}
          i18nKey={'registration_data_privacy_item3'}
        />
        <BulletListItemWrapper
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item4')}
          i18nKey={'registration_data_privacy_item4'}
        />
        <BulletListItemWrapper
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item5')}
          i18nKey={'registration_data_privacy_item5'}
        />
        <BulletListItemWrapper
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item6')}
          i18nKey={'registration_data_privacy_item6'}
        />
        <TranslatedText
          i18nKey="registration_data_privacy_copytext_first"
          textStyle={'BodyRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'copytext_first')}
          textStyleOverrides={[styles.dataPrivacyCopyText, { color: colors.labelColor }]}
        />
        <TranslatedText
          i18nKey="registration_data_privacy_copytext_second"
          textStyle={'BodyRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'copytext_second')}
          textStyleOverrides={[styles.dataPrivacyCopyText, { color: colors.labelColor }]}
        />
        <TranslatedText
          i18nKey="registration_data_privacy_copytext_third"
          textStyle={'BodyRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'copytext_third')}
          textStyleOverrides={[styles.dataPrivacyCopyText, { color: colors.labelColor }]}
        />
        <LinkText
          link={dpsDocumentUrl}
          i18nKey="registration_data_privacy_linktext"
          testID={addTestIdModifier(SCREEN_TEST_ID, 'linktext')}
          textStyle="BodyMedium"
          style={styles.dataPrivacyLinkText}
        />
      </ScreenContent>
      <ModalScreenFooter>
        <Button
          testID={buildTestId('registration_data_privacy_submit')}
          i18nKey="registration_data_privacy_submit"
          onPress={onContinue}
        />
        <Button
          testID={buildTestId('registration_data_privacy_cancel')}
          i18nKey="registration_data_privacy_cancel"
          onPress={onPressCancelRegistration}
        />
      </ModalScreenFooter>
      {showCancelAlert ? (
        <RegistrationDataPrivacyCancelAlert
          onCancelRegistration={modalOnCancelPressed}
          onDismiss={modalOnContinuePressed}
        />
      ) : null}
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
  headline: {
    paddingTop: spacing[7],
    paddingBottom: spacing[7],
  },
  introtext: {
    paddingBottom: spacing[5],
  },
  dataPrivacyCopyText: {
    paddingTop: spacing[5],
    paddingBottom: spacing[2],
  },
  dataPrivacyLinkText: {
    paddingTop: spacing[2],
    paddingBottom: spacing[7],
  },
})
