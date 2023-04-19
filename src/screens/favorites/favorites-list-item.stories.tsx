import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { FavoritesListItem } from './favorites-list-item'

const componentMeta: ComponentMeta<typeof FavoritesListItem> = {
  title: 'Favorite List Item',
  component: FavoritesListItem,
  args: {
    title: 'Nathan der Weise',
    price: {
      value: 3342.53,
      currencyIso: 'EUR',
    },
    imageUrl: 'https://placeimg.com/640/480/arch',
    imageAlt: 'Bühne',
  },
  argTypes: {
    onPressAddFavorite: {
      action: 'onPressAddFavorite',
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof FavoritesListItem> = args => <FavoritesListItem {...args} />
