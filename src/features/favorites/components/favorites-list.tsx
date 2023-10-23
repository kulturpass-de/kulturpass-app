import * as React from 'react'
import { useCallback } from 'react'
import { FlatList, FlatListProps, ListRenderItem, StyleSheet } from 'react-native'
import { FavoritesEmptyScreen } from '../../../screens/favorites/favorites-empty-screen'
import { FavouritesEntry, Product } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { FavoritesListItem, ITEM_HEIGHT } from './favorites-list-item'
import { FavoritesListItemSeparator } from './favorites-list-item-separator'

export type FavoritesListProps = {
  favourites: FavouritesEntry[]
  onProductPressed?: (product: Product) => void
} & Pick<FlatListProps<FavouritesEntry>, 'onRefresh' | 'refreshing'>

export const FavoritesList = ({ favourites, onProductPressed, refreshing, onRefresh }: FavoritesListProps) => {
  const { buildTestId } = useTestIdBuilder()

  const renderItem = useCallback<ListRenderItem<FavouritesEntry>>(
    ({ item: favourite }) => {
      if (favourite.product === undefined) {
        return null
      }
      return <FavoritesListItem onPress={onProductPressed} product={favourite.product} />
    },
    [onProductPressed],
  )

  const handleItemLayout = useCallback((_data: unknown, index: number) => {
    return {
      index,
      offset: ITEM_HEIGHT * index,
      length: ITEM_HEIGHT,
    }
  }, [])

  const keyExtractor = useCallback((favorite: FavouritesEntry) => {
    return `${favorite.product?.code}`
  }, [])

  return (
    <FlatList
      testID={buildTestId('screens_favorites_favorites_list')}
      data={favourites}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={handleItemLayout}
      ItemSeparatorComponent={FavoritesListItemSeparator}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={<FavoritesEmptyScreen />}
      contentContainerStyle={styles.list}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
  },
})
