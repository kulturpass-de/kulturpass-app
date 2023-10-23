import { zodResolver } from '@hookform/resolvers/zod'
import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { z } from 'zod'
import { Button } from '../../../components/button/button'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { TextFormField } from '../../../components/form-fields/text-form-field'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ScreenContent } from '../../../components/screen/screen-content'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { commerceApi } from '../../../services/api/commerce-api'
import { AccountInfoData, PreferenceCategory } from '../../../services/api/types'
import { CdcStatusValidationError } from '../../../services/errors/cdc-errors'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { useFocusErrors } from '../../form-validation/hooks/use-focus-errors'
import { useValidationErrors } from '../../form-validation/hooks/use-validation-errors'
import { POSTAL_CODE_SCHEMA } from '../../form-validation/utils/form-validation'
import { sanitizeSelectedCategories } from '../utils/sanitize-selected-categories'
import { PreferencesCategorySelector } from './preferences-category-selector'

export type PreferencesFormData = {
  postalCode: string
  categories: string[]
}

export type PreferencesProps = {
  withCategoriesLabel?: boolean
  inModal: boolean
  availableCategories?: PreferenceCategory[]
  userPreferences?: AccountInfoData | null
  onPressSubmit: (preferences: AccountInfoData) => Promise<void>
  submitButtonI18nKey: AvailableTranslations
  getIsValidPostalCode: LazyQueryTrigger<typeof commerceApi.endpoints.getIsValidPostalCode.Types.QueryDefinition>
}

export const Preferences: React.FC<PreferencesProps> = ({
  withCategoriesLabel,
  inModal,
  availableCategories,
  userPreferences,
  onPressSubmit,
  submitButtonI18nKey,
  getIsValidPostalCode,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const [loading, setLoading] = useState(false)

  const form = useForm<PreferencesFormData>({
    shouldFocusError: false,
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        postalCode: z.literal('').or(POSTAL_CODE_SCHEMA(t, getIsValidPostalCode, true)),
        categories: z.string().array().min(0),
      }),
    ),
    defaultValues: {
      postalCode: '',
      categories: [],
    },
  })

  useEffect(() => {
    if (!userPreferences) {
      // trigger the validation once as it does `reset` to make sure the submit button is enabled
      form.trigger()
      return
    }

    const defaultValues = {
      postalCode: userPreferences.preferredPostalCode,
      categories: sanitizeSelectedCategories({
        availableCategories,
        selectedCategoryIds: [
          userPreferences.preferredProductCategoryId1,
          userPreferences.preferredProductCategoryId2,
          userPreferences.preferredProductCategoryId3,
          userPreferences.preferredProductCategoryId4,
        ],
      }),
    }

    form.reset(defaultValues, { keepDefaultValues: true })
  }, [userPreferences, availableCategories, form])

  useFocusErrors(form)
  const { setErrors } = useValidationErrors(form)
  const [visibleError, setVisibleError] = useState<ErrorWithCode>()

  const onSubmit = form.handleSubmit(async formValues => {
    setLoading(true)
    const selectedCategoryIds = sanitizeSelectedCategories({
      availableCategories,
      selectedCategoryIds: formValues.categories,
    })
    const preferences: AccountInfoData = {
      preferredPostalCode: formValues.postalCode,
      preferredProductCategoryId1: selectedCategoryIds[0] ?? null,
      preferredProductCategoryId2: selectedCategoryIds[1] ?? null,
      preferredProductCategoryId3: selectedCategoryIds[2] ?? null,
      preferredProductCategoryId4: selectedCategoryIds[3] ?? null,
    }

    try {
      await onPressSubmit(preferences)
    } catch (error: unknown) {
      if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
      }
    } finally {
      setLoading(false)
    }
  })

  return (
    <>
      <LoadingIndicator loading={loading} />
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <ScreenContent>
        <View style={styles.content}>
          <TranslatedText
            textStyle="HeadlineH4Bold"
            textStyleOverrides={styles.yourPreferencesTitle}
            i18nKey="preferences_your_preferences"
            testID={buildTestId('preferences_your_preferences_title')}
          />
          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={styles.yourPreferencesDescription}
            i18nKey="preferences_your_preferences_description"
            testID={buildTestId('preferences_your_preferences_description')}
          />
          {withCategoriesLabel ? (
            <TranslatedText
              textStyle="CaptionSemibold"
              textStyleOverrides={styles.yourPreferencesSelectionTitle}
              i18nKey="preferences_your_preferences_selection_title"
              testID={buildTestId('preferences_your_preferences_selection_title')}
            />
          ) : null}
          <FormFieldWithControl
            name="categories"
            control={form.control}
            component={PreferencesCategorySelector}
            availableCategories={availableCategories}
            testID={buildTestId('preferences_select_categories')}
          />
          <View style={styles.postalCodeContainer}>
            <TranslatedText
              textStyle="HeadlineH4Bold"
              textStyleOverrides={styles.postalCodeTitle}
              i18nKey="preferences_postal_code_title"
              testID={buildTestId('preferences_your_preferences_title')}
            />
            <View>
              <FormFieldWithControl
                name="postalCode"
                component={TextFormField}
                labelI18nKey="preferences_postal_code_input"
                testID={buildTestId('preferences_form_postal_code')}
                control={form.control}
                maxLength={5}
                keyboardType="number-pad"
              />
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={styles.description}
                i18nKey="preferences_location"
                testID={buildTestId('preferences_location_text')}
              />
            </View>
          </View>
        </View>
      </ScreenContent>
      <ModalScreenFooter ignorePaddingWithSafeArea={inModal}>
        <Button
          disabled={!form.formState.isValid}
          testID={buildTestId('preferences_form_submit')}
          i18nKey={submitButtonI18nKey}
          onPress={onSubmit}
        />
      </ModalScreenFooter>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[7],
  },
  description: {
    marginBottom: spacing[6],
    color: colors.moonDarkest,
  },
  yourPreferencesTitle: {
    marginBottom: spacing[2],
    color: colors.moonDarkest,
  },
  yourPreferencesDescription: {
    color: colors.moonDarkest,
    marginBottom: spacing[5],
  },
  yourPreferencesSelectionTitle: {
    marginBottom: spacing[5],
    fontWeight: '400',
    fontSize: spacing[6] / 2,
    lineHeight: spacing[5],
    color: colors.moonDarkest,
  },
  postalCodeContainer: {
    marginTop: spacing[5],
  },
  postalCodeTitle: {
    marginBottom: spacing[5],
    color: colors.moonDarkest,
  },
})
