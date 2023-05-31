import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { useTranslation } from '../../services/translation/translation'
import { ListItem } from '../../components/list-item/list-item'
import { Button } from '../../components/button/button'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useUserInfo } from '../../services/user/use-user-info'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../../components/svg-image/svg-image'
import { getFaqHomeUrl } from '../../services/environment-configuration/redux/environment-configuration-selectors'
import { useLocalizedEnvironmentUrl } from '../../utils/links/hooks/use-localized-environment-url'
import { openLink } from '../../utils/links/utils'

export type ViewProfileScreenProps = {
  onPressChangeLanguage: () => void
  onPressEditPreferences: () => void
  onPressUpdateProfile: () => void
  onPressAppInformations: () => void
  onPressContact: () => void
  onPressDeleteAccount: () => void
  onPressDeveloperMenu: () => void
  onPressLogin: () => void
  onPressLogout: () => void
}

export const ViewProfileScreen: React.FC<ViewProfileScreenProps> = ({
  onPressChangeLanguage,
  onPressEditPreferences,
  onPressUpdateProfile,
  onPressAppInformations,
  onPressContact,
  onPressDeleteAccount,
  onPressDeveloperMenu,
  onPressLogin,
  onPressLogout,
}) => {
  const { t } = useTranslation()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const faqDocumentUrl = useLocalizedEnvironmentUrl(getFaqHomeUrl)

  const onFaqLinkPress = useCallback(() => openLink(faqDocumentUrl), [faqDocumentUrl])

  const onHeaderPressTitle = useCallback(() => {
    onPressDeveloperMenu()
  }, [onPressDeveloperMenu])

  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const { firstName } = useUserInfo()

  const SCREEN_TEST_ID = buildTestId('settings')

  return (
    <Screen
      testID={SCREEN_TEST_ID}
      header={
        <ScreenHeader
          testID={buildTestId('settings_headline')}
          title={firstName ? t('settings_title_withFirstName', { firstName }) : t('settings_title_withoutFirstName')}
          onPress={onHeaderPressTitle}
        />
      }>
      <ScreenContent style={styles.screenContent}>
        <ListItem
          icon={
            <SvgImage
              testID={addTestIdModifier(SCREEN_TEST_ID, 'changeLanguage_icon')}
              type="globe"
              width={24}
              height={24}
            />
          }
          title={t('changeLanguage_title')}
          testID={buildTestId('changeLanguage_title')}
          onPress={onPressChangeLanguage}
          type="navigation"
        />
        {isLoggedIn ? (
          <>
            <ListItem
              icon={
                <SvgImage
                  testID={addTestIdModifier(SCREEN_TEST_ID, 'editPreferences_icon')}
                  type="preferences"
                  width={24}
                  height={24}
                />
              }
              title={t('editPreferences_title')}
              testID={buildTestId('editPreferences_title')}
              onPress={onPressEditPreferences}
              type="navigation"
            />
            <ListItem
              icon={
                <SvgImage
                  testID={addTestIdModifier(SCREEN_TEST_ID, 'editProfile_icon')}
                  type="human-sketch"
                  width={24}
                  height={24}
                />
              }
              title={t('editProfile_title')}
              testID={buildTestId('editProfile_title')}
              onPress={onPressUpdateProfile}
              type="navigation"
            />
          </>
        ) : null}
        <ListItem
          icon={
            <SvgImage testID={addTestIdModifier(SCREEN_TEST_ID, 'contact_icon')} type="e-mail" width={24} height={24} />
          }
          title={t('contact_title')}
          testID={buildTestId('contact_title')}
          onPress={onPressContact}
          type="navigation"
        />
        <ListItem
          icon={<SvgImage testID={buildTestId('settings_faq_icon')} type="speech-bubbles" width={24} height={24} />}
          title={t('faq_title')}
          testID={buildTestId('faq_title')}
          onPress={onFaqLinkPress}
          type="link"
        />
        <ListItem
          icon={
            <SvgImage
              testID={addTestIdModifier(SCREEN_TEST_ID, 'app_informations_icon')}
              type="information-circle-small"
              width={24}
              height={24}
            />
          }
          title={t('settings_app_informations')}
          testID={addTestIdModifier(SCREEN_TEST_ID, 'app_informations')}
          onPress={onPressAppInformations}
          type="navigation"
          noBorderBottom={!isLoggedIn}
        />
        {isLoggedIn ? (
          <ListItem
            icon={
              <SvgImage
                testID={addTestIdModifier(SCREEN_TEST_ID, 'deleteAccount_icon')}
                type="delete-account"
                width={24}
                height={24}
              />
            }
            title={t('deleteAccount_title')}
            testID={buildTestId('deleteAccount_title')}
            onPress={onPressDeleteAccount}
            type="navigation"
            noBorderBottom
          />
        ) : null}
        <View style={styles.buttonContainer}>
          {!isLoggedIn ? (
            <Button
              variant="primary"
              onPress={onPressLogin}
              i18nKey="login_button"
              testID={buildTestId('login_button')}
            />
          ) : (
            <Button
              variant="tertiary"
              onPress={onPressLogout}
              i18nKey="logout_button"
              testID={buildTestId('logout_button')}
            />
          )}
        </View>
      </ScreenContent>
    </Screen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: spacing[6],
    flex: 1,
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[5],
  },
})
