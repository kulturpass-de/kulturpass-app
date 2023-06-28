import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Animated,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Platform,
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
import { HITSLOP_PIN } from '../../../theme/constants'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { FormFieldContainer } from '../../form-validation/components/form-field-container'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'

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

    useImperativeHandle(externalInputRef, () => innerInputRef.current as TextInput)

    const { t } = useTranslation()
    const [showPin, setShowPin] = useState(false)
    const [rowHeight, setRowHeight] = useState(0)

    const pinLengthArr = useMemo(() => new Array(pinLength / numRows).fill(0), [pinLength, numRows])

    const [focusedIndex, setFocusedIndex] = useState<number | undefined>()

    const nextInputIndex = value.length <= pinLength ? value.length : 0
    const selectedIndex = focusedIndex !== undefined ? focusedIndex : nextInputIndex

    const focusNextInput = useCallback(
      (incr: number) => {
        if (focusedIndex !== undefined) {
          setFocusedIndex(prev => {
            if (incr < 0 && prev === 0) {
              // user clicks backspace until the end is reached
              return prev
            }

            if (incr > 0 && prev === pinLength - 1) {
              // user enters until the end is reached
              return prev
            }

            return prev !== undefined ? prev + incr : 0
          })
        }
      },
      [focusedIndex, pinLength],
    )

    const handleChange = useCallback(
      (newInput: string) => {
        const newValue = newInput.replace(/[^0-9]/g, '')
        if (newValue.length > pinLength) {
          return
        }
        onChange?.(replaceCharAt(value, selectedIndex, newValue))
        focusNextInput(+1)
      },
      [onChange, pinLength, value, selectedIndex, focusNextInput],
    )

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
      setShowPin(!showPin)
    }, [showPin])

    const renderPinField = useCallback(
      (index: number, total: number) => {
        let borderStyle: ViewStyle
        const selected = index === selectedIndex && focusedIndex !== undefined
        if (selected) {
          borderStyle = styles.pinFieldFocused
        } else if (error !== undefined) {
          borderStyle = styles.pinFieldError
        } else {
          borderStyle = styles.pinFieldUnfocused
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
            accessibilityElementsHidden={false}
            importantForAccessibility={'yes'}
            accessibilityHint={t(`eid_${variant}_form_accessibilityHint_from_to`, { current: index + 1, total: total })}
            accessibilityLabel={t(
              Platform.OS === 'ios'
                ? `eid_${variant}_form_accessibilityLabel_label_ios`
                : `eid_${variant}_form_accessibilityLabel_label_android`,
            )}
            accessibilityRole={'none'}
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
            style={[styles.pinField, borderStyle]}>
            <Text
              accessible={false}
              style={[textStyles.HeadlineH4Bold, styles.pinFieldText, selected && styles.pinFieldFocusedText]}>
              {fieldValue}
            </Text>
            {selected && <Caret />}
          </Pressable>
        )
      },
      [selectedIndex, focusedIndex, error, value, showPin, t, variant, nextInputIndex, innerInputRef],
    )

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
            <Icon
              source={showPin ? 'ShowPassword' : 'HidePassword'}
              width={24}
              height={24}
              tintColor={colors.basicBlack}
            />
          </Pressable>
        </View>
      </FormFieldContainer>
    )
  },
)

const replaceCharAt = (str: string, pos: number, newChar: string): string => {
  return str.slice(0, pos) + newChar + str.slice(pos + 1)
}

const Caret = () => {
  const fadeAim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(fadeAim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.delay(500),
        Animated.timing(fadeAim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }, [fadeAim])

  return (
    <Animated.View style={[styles.caretContainer, { opacity: fadeAim }]}>
      <View style={styles.caret} />
    </Animated.View>
  )
}

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
  pinField: {
    position: 'relative',
    backgroundColor: colors.basicWhite,
    borderRadius: 8,
    width: 40,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    textAlign: 'center',
  },
  caretContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caret: {
    borderLeftColor: colors.primaryLight,
    borderLeftWidth: 2,
    width: 23,
    height: 26,
  },
  pinFieldText: {
    color: colors.moonDarkest,
  },
  pinFieldFocused: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  pinFieldFocusedText: {
    opacity: 0.5,
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
