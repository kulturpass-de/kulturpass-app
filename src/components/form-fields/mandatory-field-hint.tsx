import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { TranslatedText } from '../translated-text/translated-text'

export const MandatoryFieldHint: React.FC = () => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const testID = buildTestId('mandatory_field_hint')

  return (
    <View style={styles.mandatoryFieldContainer}>
      <View accessible={false}>
        <Text style={[textStyles.CaptionSemibold, styles.asterisk, { color: colors.labelColor }]}>{'*'}</Text>
      </View>

      <TranslatedText
        testID={addTestIdModifier(testID, 'mandatory_field_note')}
        i18nKey={'mandatory_field_note'}
        textStyle={'CaptionSemibold'}
        textStyleOverrides={[{ color: colors.labelColor }]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mandatoryFieldContainer: { flexDirection: 'row', marginVertical: spacing[2] },
  asterisk: { marginRight: 6 },
})
