import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IllustrationType } from '../../../components/illustration/illustration'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { OrderHistory } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { ReservationList } from './reservation-list'
import { ReservationsListEmpty } from './reservations-list-empty'

type ReservationsListTabContentProps = {
  orderEntries: OrderHistory[]
  refetch: () => void
  isLoading: boolean
  testID: string
  i18nNoItemsTitleKey: AvailableTranslations
  i18nNoItemsContentKey: AvailableTranslations
  i18nIllustrationAltKey: AvailableTranslations
  illustrationType: IllustrationType
  completedReservations: boolean
  onOrderPressed: (order: OrderHistory) => void
}

export const ReservationsListTabContent: React.FC<ReservationsListTabContentProps> = ({
  orderEntries,
  refetch,
  isLoading,
  testID,
  i18nNoItemsTitleKey,
  i18nNoItemsContentKey,
  i18nIllustrationAltKey,
  illustrationType,
  completedReservations,
  onOrderPressed,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  return (
    <View
      testID={addTestIdModifier(testID, 'tab')}
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}>
      <ReservationList
        orderEntries={orderEntries}
        onOrderPressed={onOrderPressed}
        onRefresh={refetch}
        loading={isLoading}
        completedReservations={completedReservations}
        listEmptyComponent={
          <ReservationsListEmpty
            testID={addTestIdModifier(testID, 'tab_empty')}
            i18nTitleKey={i18nNoItemsTitleKey}
            i18nContentKey={i18nNoItemsContentKey}
            i18nIllustrationAltKey={i18nIllustrationAltKey}
            illustrationType={illustrationType}
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: spacing[5],
  },
})
