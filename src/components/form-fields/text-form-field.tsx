import React, { useCallback, useMemo, useState } from 'react'
import { type FieldError } from 'react-hook-form'
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native'

import {
  FormFieldContainer,
  FormFieldContainerProps,
} from '../../features/form-validation/components/form-field-container'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { AvailableTranslations } from '../translated-text/types'

export type TextFormFieldProps = React.PropsWithChildren<
  {
    testID: TestId
    labelI18nKey: AvailableTranslations
    error?: FieldError
    containerStyle?: FormFieldContainerProps['containerStyle']
    isRequired?: boolean

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
  >
>

export const TextFormField: React.FC<TextFormFieldProps> = ({
  testID,
  labelI18nKey,
  error,
  containerStyle,
  isRequired,
  onChange,
  onBlur,
  children,
  ...textInputProps
}) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const [state, setState] = useState<{ isFocused?: boolean }>({})

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

  const borderColor: StyleProp<TextStyle> = useMemo(() => {
    if (error) {
      return { borderColor: colors.redBase }
    } else if (state.isFocused) {
      return { borderColor: colors.primaryLight }
    } else {
      return { borderColor: colors.moonDarkest }
    }
  }, [state.isFocused, error])

  return (
    <FormFieldContainer
      testID={testID}
      labelI18nKey={labelI18nKey}
      error={error}
      containerStyle={containerStyle}
      isRequired={isRequired}>
      <TextInput
        placeholderTextColor={colors.moonBase}
        onChangeText={onChange}
        style={[textStyles.BodyRegular, styles.textInput, borderColor]}
        testID={addTestIdModifier(testID, 'input')}
        accessibilityLabel={t(labelI18nKey)}
        accessible
        onBlur={handleBlur}
        onFocus={handleFocus}
        {...textInputProps}
      />
      {children}
    </FormFieldContainer>
  )
}

const styles = StyleSheet.create({
  textInput: {
    height: spacing[9],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    borderWidth: spacing[0],
    borderRadius: spacing[2],
    color: colors.moonDarkest,
    backgroundColor: colors.basicWhite,
  },
})
