import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { StyleSheet, TextInputProps, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { Button } from '../../../../components/button/button'
import { Divider } from '../../../../components/divider/divider'
import { FormFieldWithControl } from '../../../../components/form-fields/form-field-with-control'
import { SearchFormField } from '../../../../components/form-fields/search-form-field'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { AppDispatch } from '../../../../services/redux/configure-store'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { POSTAL_CODE_OR_CITY_SCHEMA } from '../../form/form-validation'
import { getDefaultSelection, getSelectedSuggestion, getSuggestionsVisible } from '../../redux/product-detail-selector'
import { productDetailSlice } from '../../redux/product-detail-slice'
import { isValidLocationSuggestionString, isStartingWithNumber } from '../../utils'
import { OfferSelectionFilterProps } from './offer-selection-filter-body'

const POSTAL_CODE_MAX_LENGTH = 5

export type PostalCodeSectionProps = Pick<
  OfferSelectionFilterProps,
  'getIsValidPostalCode' | 'fetchLocationSuggestions'
> & {
  defaultPostalCodeOrCity?: string
  onSubmit: (postalCode: string) => void
  testID: string
}

export type PostalCodeSectionFormData = {
  postalCodeOrCity: string
}

export const PostalCodeSection = ({
  onSubmit,
  getIsValidPostalCode,
  fetchLocationSuggestions,
  testID,
}: PostalCodeSectionProps) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const dispatch = useDispatch<AppDispatch>()

  const selectedSuggestion = useSelector(getSelectedSuggestion)
  const suggestionsVisible = useSelector(getSuggestionsVisible)
  const defaultSelection = useSelector(getDefaultSelection)

  const defaultPostalCodeOrCity = typeof defaultSelection === 'string' ? defaultSelection : defaultSelection?.name

  const form = useForm<PostalCodeSectionFormData>({
    shouldFocusError: false,
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        postalCodeOrCity: z
          .literal('')
          .or(POSTAL_CODE_OR_CITY_SCHEMA(t, getIsValidPostalCode, fetchLocationSuggestions, true)),
      }),
    ),
  })

  const [formInitialLoading, setFormInitialLoading] = useState<boolean>(!!defaultPostalCodeOrCity)

  /** set initial/default value for the form, prevent display issues via formInitialLoading flag */
  useEffect(() => {
    if (defaultPostalCodeOrCity) {
      form.setValue('postalCodeOrCity', defaultPostalCodeOrCity, { shouldValidate: true })
    }

    setFormInitialLoading(false)
  }, [form, defaultPostalCodeOrCity])

  const submit = form.handleSubmit(values => {
    onSubmit(values.postalCodeOrCity)
  })

  const postalCodeOrCity: string | undefined = useWatch({
    control: form.control,
    name: 'postalCodeOrCity',
    defaultValue: defaultPostalCodeOrCity,
  })

  // separate between postal code and city input, handle different input and validation
  const isPostalCode = isStartingWithNumber(postalCodeOrCity)

  const onFocus = useCallback<NonNullable<TextInputProps['onBlur']>>(() => {
    // user focused input, so show suggestions if it is not a postal code
    if (!isPostalCode) {
      dispatch(productDetailSlice.actions.setShowSuggestions(true))
    }
  }, [isPostalCode, dispatch])

  /** reset the form and parts of the redux store, to clean up suggestions */
  const onClearSearchField = useCallback(() => {
    form.resetField('postalCodeOrCity', { defaultValue: '' })
    dispatch(productDetailSlice.actions.resetSelectedSuggestion())
  }, [form, dispatch])

  /** reset on tab switch / clear field and reset data */
  useEffect(() => {
    return onClearSearchField
  }, [onClearSearchField])

  /** set form value based on user selection */
  useEffect(() => {
    if (selectedSuggestion) {
      form.setValue('postalCodeOrCity', selectedSuggestion.name, { shouldValidate: true })
    }
  }, [selectedSuggestion, form])

  /** set user input in the redux store */
  useEffect(() => {
    dispatch(productDetailSlice.actions.setUserEnteredCityPostalCode(postalCodeOrCity))

    if (!isValidLocationSuggestionString(postalCodeOrCity)) {
      dispatch(productDetailSlice.actions.resetSelectedSuggestion())

      // input is still focused
      dispatch(productDetailSlice.actions.setShowSuggestions(true))
    }
  }, [postalCodeOrCity, dispatch])

  return (
    <View style={styles.container}>
      <View>
        {formInitialLoading ? null : (
          <FormFieldWithControl
            name="postalCodeOrCity"
            component={SearchFormField}
            onClear={onClearSearchField}
            labelI18nKey="offerSelectionFilter_postalCode_input_label"
            testID={addTestIdModifier(testID, 'postalCodeOrCity')}
            control={form.control}
            placeholder={t('offerSelectionFilter_postalCode_input_placeholder')}
            maxLength={isPostalCode ? POSTAL_CODE_MAX_LENGTH : undefined}
            onFocus={onFocus}
            containerStyle={styles.formFieldContainer}
            accessibilityLabelI18nKey="offerSelectionFilter_postalCode_input_accessibility_label"
          />
        )}
      </View>
      {suggestionsVisible ? null : (
        <>
          <Divider marginTop={spacing[2]} marginBottom={spacing[3]} />
          <TranslatedText
            textStyle="CaptionSemibold"
            textStyleOverrides={[styles.hint, { color: colors.labelColor }]}
            i18nKey="offerSelectionFilter_hint"
          />
          <Button
            testID={addTestIdModifier(testID, 'postalCode_submit_button')}
            i18nKey="offerSelectionFilter_submit_button_label"
            onPress={submit}
            disabled={(!form.formState.isValid && isPostalCode) || (!selectedSuggestion && !isPostalCode)}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[5],
  },
  hint: {
    marginBottom: spacing[6],
  },
  formFieldContainer: { marginBottom: 0 },
})
