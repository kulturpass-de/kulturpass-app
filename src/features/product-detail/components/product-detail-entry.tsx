import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { textStyles } from '../../../theme/typography'

type ProductDetailEntryProps = {
  i18nKey: AvailableTranslations
  value: string
}

export const ProductDetailEntry: React.FC<ProductDetailEntryProps> = ({ i18nKey, value }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const testID = buildTestId(i18nKey)

  return (
    <View style={styles.container}>
      <TranslatedText
        i18nKey={i18nKey}
        testID={testID}
        textStyle="BodyExtrabold"
        textStyleOverrides={[styles.entryTitle, { color: colors.labelColor }]}
      />
      <Text style={textStyles.BodyRegular}> </Text>
      <Text style={[styles.entryContent, { color: colors.labelColor }]} testID={addTestIdModifier(testID, 'value')}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  entryTitle: {
    flexShrink: 0,
  },
  entryContent: {
    ...textStyles.BodyRegular,
    flexShrink: 1,
  },
})
