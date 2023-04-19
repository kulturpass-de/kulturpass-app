import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { textStyles } from '../../../theme/typography'

type ProductDetailEntryProps = {
  i18nKey: AvailableTranslations
  value: string
  valueTestId: string
}

export const ProductDetailEntry: React.FC<ProductDetailEntryProps> = ({ i18nKey, value, valueTestId }) => {
  const { buildTestId } = useTestIdBuilder()

  return (
    <View style={styles.container}>
      <TranslatedText
        i18nKey={i18nKey}
        testID={buildTestId(i18nKey)}
        textStyle="BodyExtrabold"
        textStyleOverrides={{ color: colors.moonDarkest }}
      />
      <Text style={textStyles.BodyRegular}> </Text>
      <Text style={[textStyles.BodyRegular, { color: colors.moonDarkest }]} testID={buildTestId(valueTestId)}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
})
