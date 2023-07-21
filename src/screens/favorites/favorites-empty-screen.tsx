import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Illustration } from '../../components/illustration/illustration'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export const FavoritesEmptyScreen: React.FC = () => {
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  return (
    <View style={styles.screen} testID={buildTestId('favorites_empty')}>
      <Illustration
        testID={buildTestId('favorites_empty_hero_image_alt')}
        i18nKey="favorites_empty_hero_image_alt"
        type="favorites-empty-state"
      />
      <TranslatedText
        textStyle="HeadlineH4Extrabold"
        textStyleOverrides={[styles.title, { color: colors.labelColor }]}
        i18nKey="favorites_empty_no_favorites_title"
        testID={buildTestId('favorites_empty_no_favorites_title')}
      />
      <TranslatedText
        textStyle="BodyRegular"
        textStyleOverrides={[styles.hint, { color: colors.labelColor }]}
        i18nKey="favorites_empty_no_favorites_hint"
        testID={buildTestId('favorites_empty_no_favorites_hint')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: spacing[6],
    textAlign: 'center',
  },
  hint: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[5],
    marginBottom: spacing[6],
    textAlign: 'center',
  },
})
