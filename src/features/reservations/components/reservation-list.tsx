import React, { useCallback } from 'react'
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native'
import { OrderHistory } from '../../../services/api/types/commerce/api-types'
import { spacing } from '../../../theme/spacing'
import { useProductImageUrl } from '../../../utils/image/hooks/use-product-image-url'
import { ReservationsListItem } from './reservations-list-item'

type ReservationListProps = {
  orderEntries: OrderHistory[]
  onOrderPressed: (order: OrderHistory) => void
  onRefresh: () => void
  loading: boolean
  completedReservations: boolean
  listEmptyComponent: FlatList['props']['ListEmptyComponent']
}

type ListItemProps = {
  item: OrderHistory
  onOrderPressed: (item: OrderHistory) => void
  completedReservations: boolean
}

const ListItem: React.FC<ListItemProps> = ({ item, onOrderPressed, completedReservations }) => {
  const entry = item.entries?.[0]
  const productImage = useProductImageUrl(entry?.product?.images, 'product')
  const onPress = useCallback(() => onOrderPressed(item), [item, onOrderPressed])

  return (
    <View style={styles.listItem}>
      <ReservationsListItem
        onPress={onPress}
        productName={entry?.product?.name}
        price={item.total}
        shopName={entry?.shopName}
        completed={completedReservations}
        imageUrl={productImage?.imageUrl}
        fulfillmentOption={entry?.product?.fulfillmentOption}
        status={item.status}
        deliveryScenario={entry?.deliveryScenario}
      />
    </View>
  )
}

export const ReservationList: React.FC<ReservationListProps> = ({
  orderEntries,
  onOrderPressed,
  loading,
  onRefresh,
  completedReservations,
  listEmptyComponent,
}) => {
  const renderItem: ListRenderItem<OrderHistory> = useCallback(
    ({ item }) => (
      <ListItem
        key={item.code}
        item={item}
        onOrderPressed={onOrderPressed}
        completedReservations={completedReservations}
      />
    ),
    [completedReservations, onOrderPressed],
  )
  return (
    <FlatList
      contentContainerStyle={styles.list}
      ListEmptyComponent={listEmptyComponent}
      data={orderEntries}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={loading}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingTop: spacing[5],
  },
  listItem: {
    marginBottom: spacing[6],
    marginHorizontal: spacing[5],
  },
})
