import React, { useCallback } from 'react'
import { Platform, Pressable, StyleSheet, Text, TextInput, ViewStyle } from 'react-native'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { AnimatedCaret } from '../components/animated-caret'
import { PinInputProps } from '../components/pin-input'

const replaceCharAt = (str: string, pos: number, newChar: string): string => {
  return str.slice(0, pos) + newChar + str.slice(pos + 1)
}

type UsePinFieldProps = Omit<PinInputProps, 'numRows' | 'testID'> & {
  nextInputIndex: number
  selectedIndex: number
  focusedIndex?: number
  showPin: boolean
  innerInputRef: React.MutableRefObject<TextInput>
  setFocusedIndex: React.Dispatch<React.SetStateAction<number | undefined>>
  testID?: string
}

export const usePinField = ({
  nextInputIndex,
  selectedIndex,
  error,
  value = '',
  variant,
  focusedIndex,
  showPin,
  innerInputRef,
  setFocusedIndex,
  pinLength,
  onChange,
  testID,
}: UsePinFieldProps) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const renderPinField = useCallback(
    (index: number, total: number) => {
      let borderStyle: ViewStyle
      const selected = index === selectedIndex && focusedIndex !== undefined

      // in case the focus goes out of bounds, we still want to highlight the last pin field, but not the text
      const visiblySelected = selected || (focusedIndex === total && index === total - 1)

      if (visiblySelected) {
        borderStyle = { borderColor: colors.textFieldBorderFocused }
      } else if (error !== undefined) {
        borderStyle = { borderColor: colors.textFieldBorderError }
      } else {
        borderStyle = { borderColor: colors.textFieldBorder }
      }

      let fieldValue: string | undefined = value[index]
      if (fieldValue === undefined) {
        fieldValue = ''
      } else if (!showPin) {
        fieldValue = '*'
      }

      const onPress = () => {
        if (index < value.length) {
          setFocusedIndex(index)
        } else {
          innerInputRef.current?.blur()
          setFocusedIndex(nextInputIndex)
        }
      }

      return (
        <Pressable
          key={index}
          testID={testID}
          accessibilityElementsHidden={false}
          importantForAccessibility={'yes'}
          accessibilityHint={t(`eid_${variant}_form_accessibilityHint_from_to`, { current: index + 1, total: total })}
          accessibilityLabel={t(
            Platform.OS === 'ios'
              ? `eid_${variant}_form_accessibilityLabel_label_ios`
              : `eid_${variant}_form_accessibilityLabel_label_android`,
          )}
          accessibilityRole={'none'} // NOTE: leave 'none' here, if removed the screenreaders will read out "button", which we do not want
          accessibilityActions={[{ name: 'activate' }]}
          accessibilityValue={{ text: fieldValue }}
          // eslint-disable-next-line react/jsx-no-bind
          onAccessibilityAction={e => {
            // trigger/focus text input
            if (e.nativeEvent.actionName === 'activate') {
              onPress()
            }
          }}
          disabled={index > nextInputIndex}
          // eslint-disable-next-line react/jsx-no-bind
          onPress={onPress}
          style={[
            styles.pinField,
            { backgroundColor: colors.secondaryBackground },
            borderStyle,
            styles.pinFieldBorder,
          ]}>
          <Text
            accessible={false}
            style={[textStyles.HeadlineH4Bold, { color: colors.labelColor }, selected && styles.pinFieldFocusedText]}>
            {fieldValue}
          </Text>
          {visiblySelected && <AnimatedCaret />}
        </Pressable>
      )
    },
    [
      selectedIndex,
      focusedIndex,
      error,
      value,
      showPin,
      t,
      variant,
      nextInputIndex,
      colors.secondaryBackground,
      colors.labelColor,
      colors.textFieldBorderFocused,
      colors.textFieldBorderError,
      colors.textFieldBorder,
      innerInputRef,
      setFocusedIndex,
      testID,
    ],
  )

  const focusNextInput = useCallback(
    (incr: number) => {
      if (focusedIndex !== undefined) {
        setFocusedIndex(prev => {
          if (incr < 0 && prev === 0) {
            // user clicks backspace until the end is reached
            return prev
          }

          // the last index is one out of bounds, for visual reasons
          if (incr > 0 && prev !== undefined && prev >= pinLength - 1) {
            // user enters until the end is reached
            return pinLength
          }

          return prev !== undefined ? prev + incr : 0
        })
      }
    },
    [focusedIndex, pinLength, setFocusedIndex],
  )

  const handleChange = useCallback(
    (newInput: string) => {
      const enteredPin = newInput.replace(/\D/g, '')

      // note: selectedIndex can go out of bounds, for visual reasons. that is why we need to decrement
      const correctedSelectedIndex = selectedIndex < pinLength ? selectedIndex : pinLength - 1

      if (enteredPin.length !== 1) {
        return
      }

      const newValue = replaceCharAt(value, correctedSelectedIndex, enteredPin)

      if (newValue.length > pinLength) {
        return
      }

      onChange?.(newValue)
      focusNextInput(+1)
    },
    [onChange, pinLength, value, selectedIndex, focusNextInput],
  )

  return {
    renderPinField,
    focusNextInput,
    handleChange,
  }
}

const styles = StyleSheet.create({
  pinField: {
    position: 'relative',
    borderRadius: 8,
    width: spacing[8],
    minHeight: spacing[10],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    textAlign: 'center',
  },
  pinFieldBorder: {
    borderWidth: 2,
  },
  pinFieldFocusedText: {
    opacity: 0.5,
  },
})
