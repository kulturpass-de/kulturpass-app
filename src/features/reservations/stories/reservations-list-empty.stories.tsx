import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { ReservationsListEmpty } from '../components/reservations-list-empty'

const componentMeta: ComponentMeta<typeof ReservationsListEmpty> = {
  title: 'Reservation List Empty',
  component: ReservationsListEmpty,
  args: {
    i18nTitleKey: 'reservations_list_noItems_title',
    i18nContentKey: 'reservations_list_noPendingItems_content',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof ReservationsListEmpty> = args => {
  return <ReservationsListEmpty {...args} />
}
