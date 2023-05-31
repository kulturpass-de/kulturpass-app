import * as React from 'react'
import { useCallback } from 'react'
import { FlatList, FlatListProps, ListRenderItem, StyleSheet, Pressable } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { FavoritesListItem, ITEM_HEIGHT } from './favorites-list-item'
import { FavoritesListItemSeparator } from './favorites-list-item-separator'
import { FavouritesItem, OrderEntry, Product } from '../../services/api/types/commerce/api-types'
import { FavoritesEmptyScreen } from './favorites-empty-screen'

export type OnProductPressedProps = {
  onProductPressed?: (product: Product) => void
}

export type FavoritesListProps = {
  favourites: FavouritesItem[]
} & OnProductPressedProps &
  Pick<FlatListProps<OrderEntry>, 'onRefresh' | 'refreshing'>

type ListItemProps = {
  favourite: FavouritesItem
} & OnProductPressedProps

const ListItem: React.FC<ListItemProps> = ({ favourite, onProductPressed }) => {
  const { product } = favourite

  const _onProductPressed = useCallback(() => {
    onProductPressed?.(product)
  }, [onProductPressed, product])

  return (
    <Pressable onPress={_onProductPressed} accessibilityRole="button">
      <FavoritesListItem favourite={favourite} />
    </Pressable>
  )
}

export const FavoritesList = ({ favourites, onProductPressed, refreshing, onRefresh }: FavoritesListProps) => {
  const { buildTestId } = useTestIdBuilder()

  const renderItem = useCallback<ListRenderItem<FavouritesItem>>(
    ({ item: favourite }) => {
      return <ListItem favourite={favourite} onProductPressed={onProductPressed} />
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
