import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Illustration } from '../../components/illustration/illustration'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export const EndOfLifeScreen: React.FC = () => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const screenTestId = buildTestId('endOfLife')

  return (
    <ScrollView testID={screenTestId} contentContainerStyle={styles.container}>
      <Illustration
        testID={addTestIdModifier(screenTestId, 'image_alt')}
        type="end-of-life"
        i18nKey="endOfLife_image_alt"
      />
      <TranslatedText
        textStyleOverrides={[styles.title, { color: colors.labelColor }]}
        textStyle="HeadlineH3Extrabold"
        i18nKey="endOfLife_title"
      />
      <TranslatedText
        textStyleOverrides={[styles.text, { color: colors.labelColor }]}
        textStyle="BodyRegular"
        i18nKey={'endOfLife_content'}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[6],
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    paddingTop: spacing[9],
    paddingHorizontal: spacing[8],
    textAlign: 'center',
  },
  text: {
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[5],
    textAlign: 'center',
  },
})
