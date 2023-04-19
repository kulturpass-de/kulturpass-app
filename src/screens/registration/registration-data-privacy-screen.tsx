import React, { useCallback, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Button } from '../../components/button/button'
import { Illustration } from '../../components/illustration/illustration'
import { LinkText } from '../../components/link-text/link-text'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { AvailableTranslations, AvailableTextStyles } from '../../components/translated-text/types'
import { addTestIdModifier, buildTestId, TestId } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
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
  textStyle?: AvailableTextStyles
  style?: StyleProp<ViewStyle>
}

export const BulletListItem: React.FC<BulletListItemProps> = ({
  testID,
  i18nKey,
  textStyle = 'BodyRegular',
  style,
}) => {
  return (
    <View style={[bulletStyles.container, style]}>
      {/* <Icon source={'ArrowBack'} width={24} height={24} /> */}
      <View style={bulletStyles.bulletPoint} />
      <TranslatedText testID={testID} i18nKey={i18nKey} textStyle={textStyle} textStyleOverrides={bulletStyles.text} />
    </View>
  )
}
const bulletStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: spacing[6],
    height: 24,
    // backgroundColor: 'red'
  },
  bulletPoint: {
    width: 4,
    height: 4,
    backgroundColor: colors.basicBlack,
    borderRadius: 2,
    marginRight: spacing[2],
    marginHorizontal: spacing[1],
  },
  text: {
    // paddingTop: spacing[5],
    color: colors.moonDarkest,
  },
})
export const RegistrationDataPrivacyScreen: React.FC<RegistrationDataPrivacyScreenProps> = ({
  onHeaderClose,
  onContinue,
  onCancelRegistration,
}) => {
  const [showCancelAlert, setShowCancelAlert] = useState(false)
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
          textStyleOverrides={styles.headline}
        />
        <TranslatedText
          i18nKey="registration_data_privacy_introtext"
          textStyle={'BodyRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'introtext')}
          textStyleOverrides={styles.introtext}
        />
        <BulletListItem
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item1')}
          i18nKey={'registration_data_privacy_item1'}
        />
        <BulletListItem
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item2')}
          i18nKey={'registration_data_privacy_item2'}
        />
        <BulletListItem
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item3')}
          i18nKey={'registration_data_privacy_item3'}
        />
        <BulletListItem
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item4')}
          i18nKey={'registration_data_privacy_item4'}
        />
        <BulletListItem
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item5')}
          i18nKey={'registration_data_privacy_item5'}
        />
        <BulletListItem
          testID={addTestIdModifier(SCREEN_TEST_ID, 'item6')}
          i18nKey={'registration_data_privacy_item6'}
        />
        <TranslatedText
          i18nKey="registration_data_privacy_copytext"
          textStyle={'BodyRegular'}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'dataPrivacy_copytext')}
          textStyleOverrides={styles.dataPrivacyCopyText}
        />
        <LinkText
          link="https://www.sap.de"
          i18nKey="registration_data_privacy_linktext"
          textStyle="BodyMedium"
          style={styles.dataPrivacyLinkText}
        />
      </ScreenContent>
      <View style={styles.buttonFooter}>
        <Button
          testID={buildTestId('registration_dataPrivacy_submit')}
          i18nKey="registration_data_privacy_submit"
          onPress={onContinue}
        />
        <View style={styles.cancelButtonView}>
          <Button
            testID={buildTestId('registration_dataPrivacy_cancel')}
            i18nKey="registration_data_privacy_cancel"
            onPress={onPressCancelRegistration}
          />
        </View>
      </View>
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
  buttonFooter: {
    paddingTop: spacing[5],
    paddingHorizontal: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
  cancelButtonView: {
    paddingTop: spacing[5],
  },
  headline: {
    paddingTop: spacing[7],
    paddingBottom: spacing[7],
    color: colors.basicBlack,
  },
  introtext: {
    paddingBottom: spacing[5],
    color: colors.moonDarkest,
  },
  dataPrivacyCopyText: {
    paddingTop: spacing[5],
    paddingBottom: spacing[2],
    color: colors.moonDarkest,
  },
  dataPrivacyLinkText: {
    paddingTop: spacing[2],
    paddingBottom: spacing[7],
  },
})
