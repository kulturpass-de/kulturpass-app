import React, { useMemo } from 'react'
import { type FieldError } from 'react-hook-form'
import { Platform, StyleSheet, TextInput, TextInputProps } from 'react-native'
import {
  FormFieldContainer,
  FormFieldContainerProps,
} from '../../features/form-validation/components/form-field-container'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTextStyles } from '../../theme/hooks/use-text-styles'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { toTransparentColor } from '../../theme/utils'
import { useInputState } from '../../utils/input/hooks/use-input-state'
import { AvailableTextStyles, AvailableTranslations } from '../translated-text/types'

export type TextFormFieldProps = React.PropsWithChildren<
  {
    testID: TestId
    labelI18nKey?: AvailableTranslations
    labelTextStyle?: AvailableTextStyles
    error?: FieldError
    ignoredErrorTypes?: [FieldError['type']]
    containerStyle?: FormFieldContainerProps['containerStyle']
    isRequired?: boolean
    disableAccessibilityForLabel?: boolean
    registrationScenario?: boolean
    onChange?: TextInputProps['onChangeText']
  } & Pick<
    TextInputProps,
    | 'autoCapitalize'
    | 'autoComplete'
    | 'autoCorrect'
    | 'keyboardType'
    | 'onBlur'
    | 'onFocus'
    | 'placeholder'
    | 'secureTextEntry'
    | 'value'
    | 'editable'
    | 'maxLength'
    | 'textContentType'
    | 'accessibilityRole'
  >
>

export const TextFormField = React.forwardRef<TextInput, TextFormFieldProps>(
  (
    {
      testID,
      labelI18nKey,
      labelTextStyle,
      error,
      ignoredErrorTypes,
      containerStyle,
      isRequired,
      disableAccessibilityForLabel,
      onChange,
      onBlur,
      onFocus,
      children,
      editable = true,
      textContentType,
      accessibilityRole,
      registrationScenario,
      ...textInputProps
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { colors, colorScheme } = useTheme()
    const { addTestIdModifier } = useTestIdBuilder()
    const { state, handleBlur, handleFocus } = useInputState({ onBlur, onFocus })
    const [textStyles] = useTextStyles()
    const accessibilityHint = error?.message || (isRequired && t('form_error_required')) || undefined

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
        labelTextStyle={labelTextStyle}
        error={error}
        ignoredErrorTypes={ignoredErrorTypes}
        containerStyle={containerStyle}
        disableAccessibilityForLabel={disableAccessibilityForLabel}
        isRequired={isRequired}>
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textFieldPlaceholder}
          accessibilityRole={accessibilityRole}
          onChangeText={onChange}
          style={[
            textStyles.BodyRegular,
            styles.textInput,
            {
              color: toTransparentColor(editable ? colors.labelColor : colors.secondaryLabelColor, 1, !editable),
              backgroundColor: toTransparentColor(
                colors.secondaryBackground,
                colorScheme === 'dark' ? 1 : 0.5,
                !editable,
              ),
              borderColor: toTransparentColor(borderColor, 0.4, !editable),
            },
            Platform.OS === 'ios' && {
              // fix line break issue. https://github.com/facebook/react-native/issues/28012
              lineHeight: undefined,
              ...(registrationScenario && { color: toTransparentColor(colors.secondaryLabelColor, 0.8, !editable) }),
            },
          ]}
          testID={addTestIdModifier(testID, 'input')}
          accessibilityLabel={labelI18nKey ? t(labelI18nKey) : undefined}
          accessibilityHint={accessibilityHint}
          accessible
          onBlur={handleBlur}
          onFocus={handleFocus}
          editable={editable}
          textContentType={textContentType}
          caretHidden={false}
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
    paddingRight: Platform.OS === 'ios' ? spacing[9] : spacing[4],
    borderWidth: spacing[0],
    borderRadius: spacing[2],
  },
})
