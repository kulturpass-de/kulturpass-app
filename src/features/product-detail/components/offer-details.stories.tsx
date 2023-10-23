import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { OfferDetails } from './offer-details'

const componentMeta: ComponentMeta<typeof OfferDetails> = {
  title: 'OfferDetails',
  component: OfferDetails,
  args: {
    priceAdditionalInfo: 'Kategorie 1 Normalpreis',
    description: 'LASKFJLKJ ASFJ LÖASJDÖDLSAKD ÖASLKF ÖASLKFÖ LAÖSLF ASFLK',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof OfferDetails> = props => {
  return <OfferDetails {...props} />
}
