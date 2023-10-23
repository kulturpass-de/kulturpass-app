import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { PreferenceCategory } from '../../../services/api/types'
import { useTheme } from '../../../theme/hooks/use-theme'
import { usePreferences } from '../hooks/use-preferences'
import { Preferences } from './preferences'

const availableCategories: PreferenceCategory[] = [
  { id: 'concertAndStage', name: 'Konzert und Bühne' },
  { id: 'museumAndPark', name: 'Museen und Parks' },
  { id: 'cinema', name: 'Kino' },
  { id: 'book', name: 'Bücher' },
  { id: 'audioMedia', name: 'Tonträger' },
  { id: 'sheetMusic', name: 'Noten' },
  { id: 'musicInstrument', name: 'Musik-Instrumente' },
  { id: 'culturalWorkshop', name: 'Workshops' },
]

const componentMeta: ComponentMeta<typeof Preferences> = {
  title: 'Preferences',
  component: Preferences,
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
  args: {
    availableCategories,
  },
}

export default componentMeta

export const Default: ComponentStory<typeof Preferences> = args => {
  const preferencesForm = usePreferences({ getIsValidPostalCode: () => true as any })

  return <Preferences {...args} form={preferencesForm} />
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    height: '100%',
    width: '100%',
  },
})
