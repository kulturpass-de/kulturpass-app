import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { isDeviceTextScaled } from '../../../theme/utils'

type ProductDetailEntryProps = {
  i18nKey: AvailableTranslations
  value: string
}

export const ProductDetailEntry: React.FC<ProductDetailEntryProps> = ({ i18nKey, value }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const testID = buildTestId(i18nKey)
  const textStyles = useTextStyles()

  return (
    <View style={isDeviceTextScaled() ? styles.col : styles.row}>
      <TranslatedText
        i18nKey={i18nKey}
        testID={testID}
        textStyle="BodyExtrabold"
        textStyleOverrides={[styles.entryTitle, { color: colors.labelColor }]}
      />
      {isDeviceTextScaled() ? null : <Text style={textStyles.BodyRegular}> </Text>}
      <Text
        style={[textStyles.BodyRegular, styles.entryContent, { color: colors.labelColor }]}
        testID={addTestIdModifier(testID, 'value')}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  entryTitle: {
    flexShrink: 0,
  },
  entryContent: {
    flexShrink: 1,
  },
})
