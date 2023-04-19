import React, { useCallback, useMemo, useRef, useState } from 'react'
import { FieldError } from 'react-hook-form'
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
  ViewStyle,
} from 'react-native'
import { Icon } from '../../../components/icon/icon'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { FormFieldContainer } from '../../form-validation/components/form-field-container'

export type PinInputProps = {
  value?: string
  onChange?: (newValue: string) => void
  pinLength: number
  testID: string
  error?: FieldError
}

export const PinInput: React.FC<PinInputProps> = ({ value = '', onChange, pinLength, testID, error }) => {
  const input = useRef<TextInput | null>(null)
  const [focused, setFocused] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [fullWidth, setFullWidth] = useState(0)
  const [showPinWidth, setShowPinWidth] = useState(0)
  const valueArr = useMemo(() => {
    return value.split('')
  }, [value])

  const handlePress = useCallback(() => {
    input.current?.focus()
  }, [input])

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setFocused(false)
  }, [])

  const handleChange = useCallback(
    (newInput: string) => {
      const newValue = newInput.replace(/[^0-9]/g, '')
      if (newValue.length > pinLength) {
        return
      }
      onChange?.((value + newValue).slice(0, pinLength))
    },
    [onChange, pinLength, value],
  )

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace') {
        onChange?.(value.slice(0, value.length - 1))
      }
    },
    [onChange, value],
  )

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setFullWidth(event.nativeEvent.layout.width)
  }, [])

  const handleShowPinLayout = useCallback((event: LayoutChangeEvent) => {
    setShowPinWidth(event.nativeEvent.layout.width)
  }, [])

  const toggleShowPin = useCallback(() => {
    setShowPin(!showPin)
  }, [showPin])

  const pinLengthArr = new Array(pinLength).fill(0)
  const selectedIndex = valueArr.length < pinLengthArr.length ? valueArr.length : undefined

  const elementWidth = (fullWidth - showPinWidth) / pinLength
  const inputPosition = {
    left: selectedIndex ? selectedIndex * elementWidth : undefined,
    opacity: selectedIndex !== undefined ? 1 : 0,
  }

  return (
    <FormFieldContainer testID={testID} error={error}>
      <Pressable onPress={handlePress}>
        <View style={styles.container} onLayout={handleLayout}>
          {pinLengthArr.map((_, i) => {
            let borderStyle: ViewStyle
            if (i === selectedIndex && focused) {
              borderStyle = styles.pinFieldFocused
            } else if (error !== undefined) {
              borderStyle = styles.pinFieldError
            } else {
              borderStyle = styles.pinFieldUnfocused
            }

            let fieldValue: string | undefined = valueArr[i]
            if (fieldValue === undefined) {
              fieldValue = ''
            } else if (!showPin) {
              fieldValue = '*'
            }
            return (
              <View key={i} style={styles.pinFieldContainer}>
                <View style={[styles.pinField, borderStyle]}>
                  <Text style={[textStyles.HeadlineH4Bold, styles.pinFieldText]}>{fieldValue}</Text>
                </View>
                <View style={styles.spacer} />
              </View>
            )
          })}
          <TextInput
            style={[textStyles.HeadlineH4Bold, styles.input, inputPosition]}
            ref={input}
            testID={testID}
            value=""
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChange}
            onKeyPress={handleKeyPress}
            autoComplete="off"
            autoCapitalize="none"
            keyboardType="number-pad"
          />
          <Pressable onLayout={handleShowPinLayout} onPress={toggleShowPin} style={styles.showPin} hitSlop={10}>
            <Icon
              source={showPin ? 'ShowPassword' : 'HidePassword'}
              width={24}
              height={24}
              tintColor={colors.basicBlack}
            />
          </Pressable>
        </View>
      </Pressable>
    </FormFieldContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pinFieldContainer: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  pinField: {
    backgroundColor: colors.basicWhite,
    borderRadius: 8,
    width: 40,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    textAlign: 'center',
  },
  pinFieldText: {
    color: colors.moonDarkest,
  },
  spacer: {
    flexGrow: 1,
    maxWidth: 14,
    height: 56,
  },
  pinFieldFocused: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  pinFieldUnfocused: {
    borderWidth: 2,
    borderColor: colors.basicBlack,
  },
  pinFieldError: {
    borderWidth: 2,
    borderColor: colors.redBase,
  },
  input: {
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'transparent',
    width: 40,
    height: 56,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  showPin: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: spacing[0],
  },
})
