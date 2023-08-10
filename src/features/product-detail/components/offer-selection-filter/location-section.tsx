import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../../../components/button/button'
import { Divider } from '../../../../components/divider/divider'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'

export type LocationSectionProps = {
  onSubmit: () => void
}

export const LocationSection = ({ onSubmit }: LocationSectionProps) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <Divider marginTop={spacing[2]} marginBottom={spacing[3]} />
      <TranslatedText
        textStyle="CaptionSemibold"
        textStyleOverrides={[styles.hint, { color: colors.labelColor }]}
        i18nKey="offerSelectionFilter_hint"
        testID={buildTestId('offerSelectionFilter_hint')}
      />
      <Button i18nKey="offerSelectionFilter_submit_button_label" onPress={onSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[5],
  },
  hint: {
    marginBottom: spacing[6],
  },
})
