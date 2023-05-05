import * as React from 'react'
import { useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { FavoritesListItem, ITEM_HEIGHT } from './favorites-list-item'
import { FavoritesListItemSeparator } from './favorites-list-item-separator'
import { OrderEntry } from '../../services/api/types/commerce/api-types'
import { useProductImageUrl } from '../../utils/image/hooks/use-product-image-url'

export type FavoritesListProps = {
  orderEntries: OrderEntry[]
}

type ListItemProps = {
  item: OrderEntry
  onPressAddFavorite: (productCode?: string) => void
}

const ListItem: React.FC<ListItemProps> = ({ item, onPressAddFavorite }) => {
  const productImage = useProductImageUrl(item.product?.images, 'product')

  const handleAddFavorite = useCallback(() => {
    onPressAddFavorite(item.product?.code)
  }, [item.product?.code, onPressAddFavorite])

  return (
    <FavoritesListItem
      onPressAddFavorite={handleAddFavorite}
      title={item.product?.name ?? ''}
      price={item.totalPrice}
      imageUrl={productImage.imageUrl}
      imageAlt={productImage.image?.altText}
    />
  )
}

export const FavoritesList = ({ orderEntries }: FavoritesListProps) => {
  const { buildTestId } = useTestIdBuilder()

  const handleAddFavorite = useCallback((productCode?: string) => {
    console.log(`Favorited: ${productCode}`)
  }, [])

  const renderItem = useCallback<ListRenderItem<OrderEntry>>(
    ({ item }) => {
      return <ListItem item={item} onPressAddFavorite={handleAddFavorite} />
    },
    [handleAddFavorite],
  )

  const handleItemLayout = useCallback((data: unknown, index: number) => {
    return {
      index,
      offset: ITEM_HEIGHT * index,
      length: ITEM_HEIGHT,
    }
  }, [])

  return (
    <FlatList
      testID={buildTestId('screens_favorites_favorites_list')}
      data={orderEntries}
      renderItem={renderItem}
      getItemLayout={handleItemLayout}
      ItemSeparatorComponent={FavoritesListItemSeparator}
    />
  )
}
