import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { View, ViewStyle } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { SuggestionListItem } from './suggestion-list-item'
import { SuggestionListItemEmpty } from './suggestion-list-item-empty'

const STYLE: ViewStyle = { flex: 1, padding: 16 }

const componentMeta: ComponentMeta<typeof SuggestionListItem> = {
  title: 'Suggestion List Item',
  component: SuggestionListItem,
  args: {
    accessibilityHint: 'Item 1 from 5',
    title: 'List Item',
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

export const Default: ComponentStory<typeof SuggestionListItem> = args => <SuggestionListItem {...args} />

export const Empty: ComponentStory<typeof SuggestionListItemEmpty> = args => <SuggestionListItemEmpty {...args} />

export const TopRadius: ComponentStory<typeof SuggestionListItem> = args => <SuggestionListItem {...args} topRadius />

export const BottomRadius: ComponentStory<typeof SuggestionListItem> = args => (
  <SuggestionListItem {...args} bottomRadius />
)
