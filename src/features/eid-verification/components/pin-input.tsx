import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { HITSLOP_PIN } from '../../../theme/constants'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { spacing } from '../../../theme/spacing'
import { FormFieldContainer } from '../../form-validation/components/form-field-container'
import { usePinField } from '../hooks/use-pin-field'

export type PinInputProps = {
  value?: string
  onChange?: (newValue: string) => void
  pinLength: number
  numRows?: 1 | 2
  testID: string
  error?: FieldError
  variant: 'pin' | 'can' | 'puk' | 'transportPin'
}

export const PinInput = React.forwardRef<TextInput, PinInputProps>(
  ({ value = '', onChange, pinLength, numRows = 1, testID, error, variant }, externalInputRef) => {
    const [innerInputRef, setFocusInnerInputRef] = useAccessibilityFocus()
    const [toggleShowPinRef, setFocusToggleShowPinRef] = useAccessibilityFocus()
    const { addTestIdModifier } = useTestIdBuilder()
    const [textStyles] = useTextStyles()

    useImperativeHandle(externalInputRef, () => innerInputRef.current as TextInput)

    const { t } = useTranslation()
    const [showPin, setShowPin] = useState(false)
    const [rowHeight, setRowHeight] = useState(0)

    const pinLengthArr = useMemo(() => new Array(pinLength / numRows).fill(0), [pinLength, numRows])

    const [focusedIndex, setFocusedIndex] = useState<number | undefined>()

    const nextInputIndex = value.length <= pinLength ? value.length : 0
    const selectedIndex = focusedIndex ?? nextInputIndex

    const { renderPinField, focusNextInput, handleChange } = usePinField({
      nextInputIndex,
      selectedIndex,
      error,
      value,
      variant,
      focusedIndex,
      showPin,
      innerInputRef,
      setFocusedIndex,
      pinLength,
      onChange,
      testID: addTestIdModifier(testID, 'field'),
    })

    const handleKeyPress = useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key === 'Backspace') {
          onChange?.(value.slice(0, value.length - 1))
          focusNextInput(-1)
        }
      },
      [onChange, value, focusNextInput],
    )

    const handleRowLayout = useCallback((event: LayoutChangeEvent) => {
      setRowHeight(event.nativeEvent.layout.height)
    }, [])

    const toggleShowPin = useCallback(() => {
      setShowPin(oldShowPin => !oldShowPin)
    }, [])

    const focusSelectedIndex = useCallback(() => {
      setFocusedIndex(selectedIndex)
    }, [selectedIndex])

    const resetSelectedIndex = useCallback(() => {
      setFocusedIndex(undefined)

      if (value.length >= pinLength) {
        setFocusToggleShowPinRef()
      } else {
        setFocusInnerInputRef()
      }
    }, [pinLength, setFocusInnerInputRef, setFocusToggleShowPinRef, value.length])

    useEffect(() => {
      if (focusedIndex !== undefined && focusedIndex >= 0) {
        innerInputRef.current?.focus()
      }
    }, [focusedIndex, innerInputRef])

    return (
      <FormFieldContainer testID={testID} error={error}>
        <View style={styles.container}>
          <TextInput
            style={[textStyles.HeadlineH4Bold, styles.input]}
            ref={innerInputRef}
            testID={testID}
            value=""
            onFocus={focusSelectedIndex}
            onBlur={resetSelectedIndex}
            onChangeText={handleChange}
            onKeyPress={handleKeyPress}
            autoComplete="off"
            autoCapitalize="none"
            keyboardType="number-pad"
            caretHidden
            accessible
            accessibilityLabel={t(`eid_${variant}_form_accessibilityHint_input_description`)}
            accessibilityHint={error?.message ?? t('form_error_required')}
            numberOfLines={1}
          />
          <View style={styles.pinRowsContainer}>
            <View style={styles.pinFieldContainer} onLayout={handleRowLayout}>
              {pinLengthArr.map((_, i) => renderPinField(i, pinLength))}
            </View>
            {numRows === 2 ? (
              <View style={styles.pinFieldContainer}>
                {pinLengthArr.map((_, i) => renderPinField(i + pinLengthArr.length, pinLength))}
              </View>
            ) : null}
          </View>

          <Pressable
            ref={toggleShowPinRef}
            onPress={toggleShowPin}
            style={[styles.showPin, { height: rowHeight }]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={t(
              showPin ? `eid_${variant}_form_accessibilityLabel_hide` : `eid_${variant}_form_accessibilityLabel_show`,
            )}
            hitSlop={HITSLOP_PIN}>
            <SvgImage type={showPin ? 'show-password' : 'hide-password'} width={24} height={24} />
          </Pressable>
        </View>
      </FormFieldContainer>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  pinRowsContainer: {
    flexDirection: 'column',
    gap: spacing[6],
    minHeight: 56,
    flexShrink: 1,
  },
  pinFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 14,
    flexGrow: 1,
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    color: 'transparent',
    width: '100%',
    height: '100%',
  },
  showPin: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: spacing[5],
  },
})
