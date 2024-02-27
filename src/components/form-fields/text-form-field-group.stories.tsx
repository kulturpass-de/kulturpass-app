import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { TextFormField } from './text-form-field'

const componentMeta: ComponentMeta<typeof TextFormField> = {
  title: 'Text Form Field Group',
  component: TextFormField,
  args: {
    labelI18nKey: 'registration_form_firstName',
    value: 'Input Text',
  },
  decorators: [
    Story => {
      const { colors } = useTheme()

      return (
        <View style={[styles.container, { backgroundColor: colors.primaryBackground }]}>
          <Story />
        </View>
      )
    },
  ],
}

export default componentMeta

export const Basic: ComponentStory<typeof TextFormField> = args => (
  <>
    <TextFormField {...args} placeholder="optional Promttext" value={undefined} />
    <TextFormField {...args} />
    <TextFormField {...args} error={{ type: 'onChange' }} />
    <TextFormField {...args} editable={false} />
  </>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
  },
})
