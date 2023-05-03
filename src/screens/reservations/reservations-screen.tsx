import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { ReservationsListTabContent } from '../../features/reservations/components/reservations-list-tab-content'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { Order } from '../../services/api/types/commerce/api-types'
import { ReservationsTabBar } from './reservations-tab-bar'

export type ReservationsTabsParamList = {
  PendingReservations: undefined
  CompletedReservations: undefined
}

const Tab = createMaterialTopTabNavigator<ReservationsTabsParamList>()

export type ReservationsScreenProps = {
  onReservationPressed: (orderCode: NonNullable<Order['code']>) => void
}

export const ReservationsScreen: React.FC<ReservationsScreenProps> = ({ onReservationPressed }) => {
  const { t } = useTranslation()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const [visibleError, setVisibleError] = useState<ErrorWithCode>()

  const onOrderPressed = useCallback(
    (order: Order) => {
      if (!order.code) {
        // This should be replaced with a suitable error in the future
        setVisibleError(new UnknownError())
        return
      }

      onReservationPressed(order.code)
    },
    [onReservationPressed],
  )

  const screenTestId = buildTestId('reservations')

  return (
    <Screen
      testID={screenTestId}
      header={
        <ScreenHeader
          testID={addTestIdModifier(screenTestId, 'headline')}
          title={t('reservations_headline')}
          borderBottom
        />
      }>
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <Tab.Navigator tabBar={ReservationsTabBar} style={styles.navigator}>
        <Tab.Screen name="PendingReservations">
          {() => (
            <ReservationsListTabContent
              onOrderPressed={onOrderPressed}
              testID={addTestIdModifier(screenTestId, 'pendingreservations')}
              i18nNoItemsTitleKey="reservations_list_noItems_title"
              i18nNoItemsContentKey="reservations_list_noPendingItems_content"
              i18nIllustrationAltKey="reservations_list_noPendingItems_image_alt"
              illustrationType="empty-state-reservations"
              completedReservations={false}
              setVisibleError={setVisibleError}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="CompletedReservations">
          {() => (
            <ReservationsListTabContent
              onOrderPressed={onOrderPressed}
              testID={addTestIdModifier(screenTestId, 'completedreservations')}
              i18nNoItemsTitleKey="reservations_list_noItems_title"
              i18nNoItemsContentKey="reservations_list_noCompletedItems_content"
              i18nIllustrationAltKey="reservations_list_noCompletedItems_image_alt"
              illustrationType="empty-state-reservations-closed"
              completedReservations={true}
              setVisibleError={setVisibleError}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </Screen>
  )
}

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: colors.basicBackground,
  },
})
