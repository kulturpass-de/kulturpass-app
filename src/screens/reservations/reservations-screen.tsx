import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { useCallback, useEffect, useState } from 'react'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { ReservationsListTabContent } from '../../features/reservations/components/reservations-list-tab-content'
import { useQueryReservations } from '../../features/reservations/hooks/use-query-reservations'
import { Order } from '../../services/api/types/commerce/api-types'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { ReservationsTabBar } from './reservations-tab-bar'

export type ReservationsTabsParamList = {
  PendingReservations: undefined
  CompletedReservations: undefined
}

const Tab = createMaterialTopTabNavigator<ReservationsTabsParamList>()

export type ReservationsScreenProps = {
  onReservationPressed: (orderCode: NonNullable<Order['code']>, completedReservation?: boolean) => void
}

export const ReservationsScreen: React.FC<ReservationsScreenProps> = ({ onReservationPressed }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const screenTestId = buildTestId('reservations')

  const [visibleError, setVisibleError] = useState<ErrorWithCode>()

  const onOrderPressed = useCallback(
    (completedReservation: boolean) => (order: Order) => {
      if (!order.code) {
        // This should be replaced with a suitable error in the future
        setVisibleError(new UnknownError())
        return
      }

      onReservationPressed(order.code, completedReservation)
    },
    [onReservationPressed],
  )

  const { pendingReservations, completedReservations, isLoading, error, refetch } = useQueryReservations()

  useEffect(() => {
    if (error === undefined) {
      setVisibleError(undefined)
    } else if (error instanceof ErrorWithCode) {
      setVisibleError(error)
    } else {
      setVisibleError(new UnknownError())
    }
  }, [error, setVisibleError])

  return (
    <Screen
      testID={screenTestId}
      header={<ScreenHeader testID={addTestIdModifier(screenTestId, 'headline')} title={t('reservations_headline')} />}>
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <Tab.Navigator tabBar={ReservationsTabBar} sceneContainerStyle={{ backgroundColor: colors.primaryBackground }}>
        <Tab.Screen name="PendingReservations">
          {() => (
            <ReservationsListTabContent
              orderEntries={pendingReservations}
              refetch={refetch}
              isLoading={isLoading}
              onOrderPressed={onOrderPressed(false)}
              testID={addTestIdModifier(screenTestId, 'pendingreservations')}
              i18nNoItemsTitleKey="reservations_list_noItems_title"
              i18nNoItemsContentKey="reservations_list_noPendingItems_content"
              i18nIllustrationAltKey="reservations_list_noPendingItems_image_alt"
              illustrationType="empty-state-reservations"
              completedReservations={false}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="CompletedReservations">
          {() => (
            <ReservationsListTabContent
              orderEntries={completedReservations}
              refetch={refetch}
              isLoading={isLoading}
              onOrderPressed={onOrderPressed(true)}
              testID={addTestIdModifier(screenTestId, 'completedreservations')}
              i18nNoItemsTitleKey="reservations_list_noItems_title"
              i18nNoItemsContentKey="reservations_list_noCompletedItems_content"
              i18nIllustrationAltKey="reservations_list_noCompletedItems_image_alt"
              illustrationType="empty-state-reservations-closed"
              completedReservations={true}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </Screen>
  )
}
