import React, { useCallback, useMemo, useState } from 'react'
import { type FieldError } from 'react-hook-form'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import {
  FormFieldContainer,
  FormFieldContainerProps,
} from '../../features/form-validation/components/form-field-container'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { toTransparentColor } from '../../theme/utils'
import { AvailableTranslations } from '../translated-text/types'

export type TextFormFieldProps = React.PropsWithChildren<
  {
    testID: TestId
    labelI18nKey: AvailableTranslations
    error?: FieldError
    containerStyle?: FormFieldContainerProps['containerStyle']
    isRequired?: boolean
    disableAccessibilityForLabel?: boolean

    onChange?: TextInputProps['onChangeText']
  } & Pick<
    TextInputProps,
    | 'autoCapitalize'
    | 'autoComplete'
    | 'autoCorrect'
    | 'keyboardType'
    | 'onBlur'
    | 'placeholder'
    | 'secureTextEntry'
    | 'value'
    | 'editable'
    | 'maxLength'
    | 'textContentType'
  >
>

export const TextFormField = React.forwardRef<TextInput, TextFormFieldProps>(
  (
    {
      testID,
      labelI18nKey,
      error,
      containerStyle,
      isRequired,
      disableAccessibilityForLabel,
      onChange,
      onBlur,
      children,
      editable = true,
      textContentType,
      ...textInputProps
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { colors } = useTheme()
    const { addTestIdModifier } = useTestIdBuilder()
    const [state, setState] = useState<{ isFocused?: boolean }>({})
    const accessibilityHint = error?.message || (isRequired && t('form_error_required')) || undefined

    const handleBlur: NonNullable<TextInputProps['onBlur']> = useCallback(
      event => {
        setState(currentState => ({ ...currentState, isFocused: false }))
        onBlur?.(event)
      },
      [onBlur],
    )

    const handleFocus: NonNullable<TextInputProps['onFocus']> = useCallback(() => {
      setState(currentState => ({ ...currentState, isFocused: true }))
    }, [])

    const borderColor: string = useMemo(() => {
      if (error) {
        return colors.textFieldBorderError
      } else if (state.isFocused) {
        return colors.textFieldBorderFocused
      } else {
        return colors.textFieldBorder
      }
    }, [error, state.isFocused, colors.textFieldBorderError, colors.textFieldBorderFocused, colors.textFieldBorder])

    return (
      <FormFieldContainer
        testID={testID}
        labelI18nKey={labelI18nKey}
        error={error}
        containerStyle={containerStyle}
        disableAccessibilityForLabel={disableAccessibilityForLabel}
        isRequired={isRequired}>
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textFieldPlaceholder}
          onChangeText={onChange}
          style={[
            textStyles.BodyRegular,
            styles.textInput,
            {
              color: toTransparentColor(colors.labelColor, 0.4, !editable),
              backgroundColor: toTransparentColor(colors.secondaryBackground, 0.4, !editable),
              borderColor: toTransparentColor(borderColor, 0.5, !editable),
            },
          ]}
          testID={addTestIdModifier(testID, 'input')}
          accessibilityLabel={t(labelI18nKey)}
          accessibilityHint={accessibilityHint}
          accessible
          onBlur={handleBlur}
          onFocus={handleFocus}
          editable={editable}
          textContentType={textContentType}
          {...textInputProps}
        />
        {children}
      </FormFieldContainer>
    )
  },
)

const styles = StyleSheet.create({
  textInput: {
    minHeight: spacing[9],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    borderWidth: spacing[0],
    borderRadius: spacing[2],
  },
})
