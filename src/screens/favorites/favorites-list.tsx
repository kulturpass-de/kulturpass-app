import * as React from 'react'
import { useCallback } from 'react'
import { FlatList, FlatListProps, ListRenderItem, StyleSheet } from 'react-native'

import { useTestIdBuilder } from '../../services/test-id/test-id'
import { FavoritesListItem, ITEM_HEIGHT } from './favorites-list-item'
import { FavoritesListItemSeparator } from './favorites-list-item-separator'
import { FavouritesItem, Product } from '../../services/api/types/commerce/api-types'
import { FavoritesEmptyScreen } from './favorites-empty-screen'

export type FavoritesListProps = {
  favourites: FavouritesItem[]
  onProductPressed?: (product: Product) => void
} & Pick<FlatListProps<FavouritesItem>, 'onRefresh' | 'refreshing'>

export const FavoritesList = ({ favourites, onProductPressed, refreshing, onRefresh }: FavoritesListProps) => {
  const { buildTestId } = useTestIdBuilder()

  const renderItem = useCallback<ListRenderItem<FavouritesItem>>(
    ({ item: favourite }) => {
      return <FavoritesListItem onPress={onProductPressed} favourite={favourite} />
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

  const keyExtractor = useCallback((favorite: FavouritesItem) => {
    return `${favorite.product.code}`
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
  },
})
