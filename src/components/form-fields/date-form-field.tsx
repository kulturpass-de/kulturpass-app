import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { type FieldError } from 'react-hook-form'
import { Pressable, StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native'
import DatePicker, { type DatePickerProps } from 'react-native-date-picker'

import { useTestIdBuilder, type TestId } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { Icon } from '../icon/icon'
import { AvailableTranslations } from '../translated-text/types'
import { dateToDotDate, dotDateToIsoDate, isoDateToDate, isoDateToDotDate } from './date-utils'
import { TextFormField } from './text-form-field'

export type DateFormFieldProps = {
  testID: TestId
  labelI18nKey: AvailableTranslations
  error?: FieldError
  containerStyle?: ViewStyle
  isRequired?: boolean
  disableAccessibilityForLabel?: boolean

  onChange?: (text: string | undefined) => void
  onBlur?: TextInputProps['onBlur']
  value?: TextInputProps['value']
  editable?: boolean
}

export const DateFormField = React.forwardRef<TextInput, DateFormFieldProps>(
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
      value: isoDate,
      editable = true,
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { addTestIdModifier } = useTestIdBuilder()
    /**
     * The initially provided date prop is kept in the local state in the format of dotDate. The onChangeText of the
     * TextInput will update that local state and will not triger the onChange prop. This is done so that the user can
     * edit manually the text in the field, un-focus and then we will check if the text in the field is usable as a date
     */
    const [isDatePickerShown, setDatePickerShown] = useState<boolean>(false)
    const [dotDate, setDotDate] = useState<TextInputProps['value']>(isoDateToDotDate(isoDate))

    useEffect(() => {
      const value = isoDateToDotDate(isoDate)
      if (value !== '') {
        setDotDate(value)
      }
    }, [isoDate])

    /**
     * We need a Date object from the provided date prop for the DatePicker
     */
    const date = useMemo(() => isoDateToDate(isoDate) || new Date(), [isoDate])

    useEffect(() => {
      // Empty values are considered as valid
      if (dotDate === '') {
        onChange?.(undefined)
        return
      }

      // If dotDate is a valid date
      const updatedIsoDate = dotDateToIsoDate(dotDate)
      if (updatedIsoDate !== '') {
        onChange?.(updatedIsoDate)
        return
      }

      // If dotDate is not a valid date just emit the current value
      onChange?.(dotDate ?? undefined)
    }, [dotDate, onChange])

    const toggleDatePicker = useCallback(() => {
      setDatePickerShown(prev => !prev)
    }, [])

    const onDatePickerConfirm: NonNullable<DatePickerProps['onConfirm']> = useCallback(updatedDate => {
      /**
       * When a date is selected from DatePicker, we receive a sanitized date
       */
      setDatePickerShown(false)
      setDotDate(dateToDotDate(updatedDate))
    }, [])

    const onDatePickerCancel = useCallback(() => {
      setDatePickerShown(false)
    }, [])

    return (
      <TextFormField
        ref={ref}
        testID={testID}
        labelI18nKey={labelI18nKey}
        error={error}
        containerStyle={containerStyle}
        isRequired={isRequired}
        disableAccessibilityForLabel={disableAccessibilityForLabel}
        onChange={setDotDate}
        onBlur={onBlur}
        placeholder={t('registration_form_dateOfBirth_placeholder')}
        value={dotDate}
        autoComplete="birthdate-full"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={10}
        editable={editable}>
        {editable ? (
          <>
            <Pressable
              style={styles.inputIcon}
              onPress={toggleDatePicker}
              accessible
              accessibilityLabel={t('registration_form_dateOfBirth_select_icon')}
              accessibilityRole="button"
              testID={addTestIdModifier(testID, 'showDatePickerButton')}>
              <Icon source="Calendar" width={24} height={24} />
            </Pressable>
            <DatePicker
              modal
              mode="date"
              open={isDatePickerShown}
              date={date}
              onConfirm={onDatePickerConfirm}
              onCancel={onDatePickerCancel}
              minimumDate={new Date('1900-01-01')}
              maximumDate={new Date()}
            />
          </>
        ) : (
          <View style={styles.inputIcon}>
            <Icon source="Calendar" width={24} height={24} tintColor={colors.transparentBlack40} />
          </View>
        )}
      </TextFormField>
    )
  },
)

const styles = StyleSheet.create({
  inputIcon: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[5],
  },
})
