import React, { PropsWithChildren } from 'react'
import { type FieldError } from 'react-hook-form'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Icon } from '../../../components/icon/icon'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'

export type FormFieldContainerProps = PropsWithChildren<{
  testID: TestId
  labelI18nKey?: AvailableTranslations
  error?: FieldError
  containerStyle?: ViewStyle
  isRequired?: boolean
  disableAccessibilityForLabel?: boolean
}>

export const FormFieldContainer: React.FC<FormFieldContainerProps> = ({
  testID,
  labelI18nKey,
  error,
  containerStyle,
  isRequired,
  disableAccessibilityForLabel,
  children,
}) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()

  let errorMessage: string | undefined
  if (error) {
    errorMessage = error.message ?? t(`form_error_${error.type}`, t('form_error_fallback'))
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {labelI18nKey && (
        <Text
          testID={addTestIdModifier(testID, 'label')}
          accessibilityLabel={t(labelI18nKey)}
          accessible={!disableAccessibilityForLabel}
          style={[textStyles.BodyRegular, styles.textColor]}>
          {t(labelI18nKey) + (isRequired ? ' *' : '')}
        </Text>
      )}
      <View style={styles.textInputContainer}>{children}</View>
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Icon source="InputError" width={20} height={20} />
          <Text
            testID={addTestIdModifier(testID, 'error')}
            accessibilityLabel={errorMessage}
            accessible
            style={[textStyles.CaptionSemibold, styles.errorText]}>
            {errorMessage}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  textInputContainer: {
    marginTop: spacing[2],
  },
  textColor: {
    color: colors.moonDarkest,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  errorText: {
    marginLeft: spacing[2],
    // This marginTop does not exist in Figma, but it makes the text properly center aligned with the icon
    marginTop: spacing[1],
    color: colors.moonDarkest,
    flex: 1,
  },
})
