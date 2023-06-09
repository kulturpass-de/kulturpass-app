import React, { FC, useCallback } from 'react'
import { Text, StyleSheet, Pressable, View } from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { Icon } from '../icon/icon'
import { AvailableTextStyles, AvailableTranslations } from '../translated-text/types'

const DEFAULT_CHECKBOX_FONT: AvailableTextStyles = 'BodySmallRegular'

export type CheckboxProps = {
  i18nKey: AvailableTranslations
  testID: TestId
  textStyle?: AvailableTextStyles
  i18nParams?: Record<string, any>
  selected?: boolean
  onChange: (value: boolean) => void
}

export const Checkbox: FC<CheckboxProps> = props => {
  const { i18nKey, testID, selected = false, textStyle = DEFAULT_CHECKBOX_FONT, i18nParams, onChange } = props
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { t } = useTranslation()
  const text = i18nParams ? t(i18nKey, i18nParams) : t(i18nKey)

  const toggleSelected = useCallback(() => {
    onChange(!selected)
  }, [onChange, selected])

  return (
    <Pressable
      testID={buildTestId(testID)}
      accessibilityLabel={text}
      accessibilityState={{ checked: selected }}
      accessibilityRole="checkbox"
      accessible
      onPress={toggleSelected}
      style={styles.container}>
      <View style={styles.iconContainer}>{selected ? <Icon source="Check" width={24} height={24} /> : null}</View>
      <Text testID={addTestIdModifier(testID, 'text')} style={[textStyles[textStyle], styles.textStyle]}>
        {text}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    height: spacing[7],
    width: spacing[7],
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.moonDarkest,
    borderWidth: spacing[0],
    borderRadius: spacing[2],
    backgroundColor: colors.basicWhite,
  },
  textStyle: {
    paddingLeft: spacing[4],
    color: colors.basicBlack,
    flex: 1,
  },
})
