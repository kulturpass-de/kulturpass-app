import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { View, ViewStyle } from 'react-native'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { OfferSelectionFilterSuggestionsItem } from './offer-selection-filter-suggestions-item'
import { OfferSelectionFilterSuggestionsItemEmpty } from './offer-selection-filter-suggestions-item-empty'

const STYLE: ViewStyle = { flex: 1, padding: 16 }

const componentMeta: ComponentMeta<typeof OfferSelectionFilterSuggestionsItem> = {
  title: 'Offer Selection Filter Suggestions Item',
  component: OfferSelectionFilterSuggestionsItem,
  args: {
    accessibilityHint: 'Item 1 from 5',
    name: 'List Item',
  },
  argTypes: { onPress: { action: 'onPress' } },
  decorators: [
    Story => {
      const { colors } = useTheme()

      return (
        <View style={[STYLE, { backgroundColor: colors.primaryBackground }]}>
          <Story />
        </View>
      )
    },
  ],
}

export default componentMeta

export const Default: ComponentStory<typeof OfferSelectionFilterSuggestionsItem> = args => (
  <OfferSelectionFilterSuggestionsItem {...args} />
)

export const Empty: ComponentStory<typeof OfferSelectionFilterSuggestionsItemEmpty> = args => (
  <OfferSelectionFilterSuggestionsItemEmpty {...args} />
)

export const TopRadius: ComponentStory<typeof OfferSelectionFilterSuggestionsItem> = args => (
  <OfferSelectionFilterSuggestionsItem {...args} topRadius />
)

export const BottomRadius: ComponentStory<typeof OfferSelectionFilterSuggestionsItem> = args => (
  <OfferSelectionFilterSuggestionsItem {...args} bottomRadius />
)
