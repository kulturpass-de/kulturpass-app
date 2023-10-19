import Clipboard from '@react-native-clipboard/clipboard'
import React, { useCallback } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../components/button/button'
import { CopyToClipboard } from '../../../components/copy-to-clipboard/copy-to-clipboard'
import { Divider } from '../../../components/divider/divider'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../../components/screen/screen-content'
import {
  notificationsDebugActions,
  selectNotificationsDebugEvents,
} from '../../../services/notifications/store/notifications-debug-slice'
import { selectPersistedNotificationsState } from '../../../services/notifications/store/notifications-selectors'
import { AppDispatch } from '../../../services/redux/configure-store'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'

export type NotificationsScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onHeaderPressBack, onHeaderPressClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { fcmToken, apnsToken } = useSelector(selectPersistedNotificationsState)
  const notificationsDebugEvents = useSelector(selectNotificationsDebugEvents)

  const onCopyFcm = useCallback(() => {
    if (!fcmToken) {
      return
    }

    Clipboard.setString(fcmToken)
  }, [fcmToken])

  const onCopyApns = useCallback(() => {
    if (!apnsToken) {
      return
    }

    Clipboard.setString(apnsToken)
  }, [apnsToken])

  const clearNotificationsDebugEvents = useCallback(() => {
    dispatch(notificationsDebugActions.clearEvents())
  }, [dispatch])

  return (
    <ModalScreen withoutBottomSafeArea testID={buildTestId('Notifications')}>
      <ModalScreenHeader
        titleI18nKey="notifications_headline_title"
        testID={buildTestId('Notifications_headline_title')}
        onPressBack={onHeaderPressBack}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent style={{ paddingBottom: spacing[4], backgroundColor: colors.secondaryBackground }}>
        <View
          style={[
            styles.screenSection,
            { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
          ]}>
          <View style={styles.row}>
            <Text style={[textStyles.BodySmallRegular, { color: colors.labelColor }]}>{'FCM token'}</Text>
            <CopyToClipboard
              baseTestId="notifications_copyToClipboard_button"
              accessibilityLabelI18nKey="notifications_copyToClipboard_button"
              copiedAccessibilityI18nKey="notifications_copiedToClipboard_button"
              onPress={onCopyFcm}
            />
          </View>
          <Text
            style={[
              styles.token,
              textStyles.BodySmallRegular,
              { color: colors.labelColor, borderColor: colors.labelColor },
            ]}>
            {fcmToken}
          </Text>
        </View>
        {Platform.OS === 'ios' ? (
          <View
            style={[
              styles.screenSection,
              { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
            ]}>
            <View style={styles.row}>
              <Text style={[textStyles.BodySmallRegular, { color: colors.labelColor }]}>{'APNS token'}</Text>
              <CopyToClipboard
                baseTestId="notifications_copyToClipboard_button"
                accessibilityLabelI18nKey="notifications_copyToClipboard_button"
                copiedAccessibilityI18nKey="notifications_copiedToClipboard_button"
                onPress={onCopyApns}
              />
            </View>
            <Text
              style={[
                styles.token,
                textStyles.BodySmallRegular,
                { color: colors.labelColor, borderColor: colors.labelColor },
              ]}>
              {apnsToken}
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.screenSection,

            { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
          ]}>
          <Button onPress={clearNotificationsDebugEvents} i18nKey="notifications_clear_button" />
        </View>
        <View style={[styles.screenSection, styles.notifications, { backgroundColor: colors.secondaryBackground }]}>
          {notificationsDebugEvents.map((notificationEvent, i) => (
            <View key={notificationEvent.id}>
              <Text style={[textStyles.BodySmallRegular, { color: colors.labelColor }]}>
                {`${notificationEvent.type}: ${JSON.stringify(notificationEvent.payload, null, 4)}`}
              </Text>
              {i < notificationsDebugEvents.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </View>
      </ScreenContent>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenSection: {
    flexDirection: 'column',
    paddingHorizontal: spacing[6],
    borderBottomWidth: 2,
    paddingVertical: 12,
  },
  notifications: {
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    columnGap: 12,
  },
  token: {
    marginVertical: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderWidth: 1,
    borderRadius: 5,
  },
})
