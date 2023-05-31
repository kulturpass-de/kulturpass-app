import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'

import { Alert } from '../../../../components/alert/alert'
import { AlertContent } from '../../../../components/alert/alert-content'
import { AlertMessage } from '../../../../components/alert/alert-message'
import { AlertTitle } from '../../../../components/alert/alert-title'
import { Button } from '../../../../components/button/button'
import { RootStackParams } from '../../../../navigation/types'
import { authLogout } from '../../../../services/auth/store/thunks/auth-logout'
import { AppDispatch } from '../../../../services/redux/configure-store'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'

export type AccountVerifiedAlertProps = {
  onDismiss?: () => void
  testID?: TestId
}

export const AccountVerifiedAlert: React.FC<AccountVerifiedAlertProps> = ({
  onDismiss,
  testID = 'account_verified_alert',
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const navigation = useNavigation<NavigationProp<RootStackParams, 'Tabs'>>()
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = useCallback(async () => {
    await dispatch(authLogout())
    navigation.navigate('Tabs', {
      screen: 'Settings',
    })
    onDismiss?.()
  }, [onDismiss, navigation, dispatch])

  return (
    <Alert visible={true}>
      <AlertContent>
        <AlertTitle testID={addTestIdModifier(testID, 'title')} i18nKey="account_verified_alert_title" />
        <AlertMessage
          testID={addTestIdModifier(testID, 'text')}
          i18nKey="account_verified_alert_content"
          textStyleOverrides={styles.text}
        />
        <Button
          testID={addTestIdModifier(testID, 'confirm_button')}
          i18nKey="account_verified_alert_button"
          variant="primary"
          onPress={onSubmit}
        />
      </AlertContent>
    </Alert>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
})
