import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { IllustrationType } from '../../../components/illustration/illustration'

import { AvailableTranslations } from '../../../components/translated-text/types'
import { Order } from '../../../services/api/types/commerce/api-types'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { useQueryReservations } from '../hooks/use-query-reservations'
import { ReservationList } from './reservation-list'
import { ReservationsListEmpty } from './reservations-list-empty'
import { spacing } from '../../../theme/spacing'

type ReservationsListTabContentProps = {
  testID: string
  i18nNoItemsTitleKey: AvailableTranslations
  i18nNoItemsContentKey: AvailableTranslations
  i18nIllustrationAltKey: AvailableTranslations
  illustrationType: IllustrationType
  completedReservations: boolean
  onOrderPressed: (order: Order) => void
  setVisibleError: (error: ErrorWithCode | undefined) => void
}

export const ReservationsListTabContent: React.FC<ReservationsListTabContentProps> = ({
  testID,
  i18nNoItemsTitleKey,
  i18nNoItemsContentKey,
  i18nIllustrationAltKey,
  illustrationType,
  completedReservations,
  onOrderPressed,
  setVisibleError,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()

  const { orderEntryList, isLoading, error, refetch } = useQueryReservations(completedReservations)

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
    <View testID={addTestIdModifier(testID, 'tab')} style={styles.container}>
      <ReservationList
        orderEntries={orderEntryList?.orders ?? []}
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
    backgroundColor: colors.basicBackground,
    flexGrow: 1,
    marginTop: spacing[5],
  },
})
