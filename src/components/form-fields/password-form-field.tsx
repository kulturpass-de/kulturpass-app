import React, { useCallback, useState } from 'react'
import { type FieldError } from 'react-hook-form'
import { Pressable, StyleSheet, type TextInputProps, type ViewStyle } from 'react-native'

import { type TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { spacing } from '../../theme/spacing'
import { Icon } from '../icon/icon'
import { type AvailableTranslations } from '../translated-text/types'
import { TextFormField } from './text-form-field'

export type PasswordFormFieldProps = {
  testID: TestId
  labelI18nKey: AvailableTranslations
  error?: FieldError
  containerStyle?: ViewStyle
  isRequired?: boolean

  onChange?: TextInputProps['onChangeText']
  onBlur?: TextInputProps['onBlur']
  value?: TextInputProps['value']
}

export const PasswordFormField: React.FC<PasswordFormFieldProps> = ({
  testID,
  labelI18nKey,
  error,
  containerStyle,
  isRequired,
  onChange,
  onBlur,
  value,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const [state, setState] = useState<{ isPasswordVisible?: boolean }>({})

  const toggleIsPasswordVisible = useCallback(() => {
    setState(currentState => ({ ...currentState, isPasswordVisible: !currentState.isPasswordVisible }))
  }, [])

  return (
    <TextFormField
      testID={testID}
      labelI18nKey={labelI18nKey}
      error={error}
      containerStyle={containerStyle}
      isRequired={isRequired}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      secureTextEntry={!state.isPasswordVisible}
      autoComplete="password"
      autoCapitalize="none"
      autoCorrect={false}>
      <Pressable
        style={styles.inputIcon}
        onPress={toggleIsPasswordVisible}
        testID={addTestIdModifier(testID, 'showPasswordButton')}>
        <Icon source={state.isPasswordVisible ? 'ShowPassword' : 'HidePassword'} width={24} height={24} />
      </Pressable>
    </TextFormField>
  )
}

const styles = StyleSheet.create({
  inputIcon: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[5],
  },
})
