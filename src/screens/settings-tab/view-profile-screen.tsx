import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTranslation } from '../../services/translation/translation'
import { ListItem } from '../../components/list-item/list-item'
import { Icon } from '../../components/icon/icon'
import { Button } from '../../components/button/button'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useUserInfo } from '../../services/user/use-user-info'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../../components/svg-image/svg-image'

export type ViewProfileScreenProps = {
  onPressChangeLanguage: () => void
  onPressEditPreferences: () => void
  onPressUpdateProfile: () => void
  onPressAppInformations: () => void
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
  onPressDeleteAccount,
  onPressDeveloperMenu,
  onPressLogin,
  onPressLogout,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const onHeaderPressTitle = useCallback(() => {
    onPressDeveloperMenu()
  }, [onPressDeveloperMenu])

  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const { firstName } = useUserInfo()

  return (
    <Screen
      testID={buildTestId('settings')}
      header={
        <ScreenHeader
          testID={buildTestId('settings_headline')}
          title={firstName ? t('settings_title_withFirstName', { firstName }) : t('settings_title_withoutFirstName')}
          onPress={onHeaderPressTitle}
        />
      }>
      <View style={styles.screenContent}>
        <ListItem
          icon={<Icon source="Globe" width={29} height={24} />}
          title={t('changeLanguage_title')}
          testID={buildTestId('settings_changeLanguage_button')}
          onPress={onPressChangeLanguage}
          chevron
        />
        {isLoggedIn ? (
          <>
            <ListItem
              icon={<Icon source="Preferences" width={29} height={24} />}
              title={t('editPreferences_title')}
              testID={buildTestId('settings_editPreferences_button')}
              onPress={onPressEditPreferences}
              chevron
            />
            <ListItem
              icon={<Icon source="Profile" width={29} height={24} />}
              title={t('editProfile_title')}
              testID={buildTestId('settings_editProfile_button')}
              onPress={onPressUpdateProfile}
              chevron
            />
          </>
        ) : null}
        <ListItem
          icon={<Icon source="Info" width={29} height={24} />}
          title={t('settings_app_informations')}
          testID={buildTestId('settings_app_informations_button')}
          onPress={onPressAppInformations}
          chevron
          noBorderBottom={!isLoggedIn}
        />
        {isLoggedIn ? (
          <ListItem
            icon={<SvgImage testID="deleteAccount_icon" type="delete-account" width={29} height={24} />}
            title={t('deleteAccount_title')}
            testID={buildTestId('settings_deleteAccount_button')}
            onPress={onPressDeleteAccount}
            chevron
            noBorderBottom
          />
        ) : null}
        <View style={styles.buttonContainer}>
          {!isLoggedIn ? (
            <Button
              variant="primary"
              onPress={onPressLogin}
              testID={buildTestId('settings_login_button')}
              i18nKey="login_button"
            />
          ) : (
            <Button
              variant="tertiary"
              onPress={onPressLogout}
              testID={buildTestId('settings_logout_button')}
              i18nKey="logout_button"
            />
          )}
        </View>
      </View>
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
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
})
