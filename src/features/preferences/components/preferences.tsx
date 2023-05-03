import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { TextFormField } from '../../../components/form-fields/text-form-field'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { AccountInfoData, PreferenceCategory } from '../../../services/api/types'
import { ScreenContent } from '../../../components/screen/screen-content'
import { Button } from '../../../components/button/button'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { colors } from '../../../theme/colors'
import { PreferencesCategorySelector } from './preferences-category-selector'
import { useValidationErrors } from '../../form-validation/hooks/use-validation-errors'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { POSTAL_CODE_SCHEMA } from '../../form-validation/utils/form-validation'
import { useTranslation } from '../../../services/translation/translation'
import { CdcStatusValidationError } from '../../../services/errors/cdc-errors'
import { sanitizeSelectedCategories } from '../utils/sanitize-selected-categories'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'

export type PreferencesFormData = {
  postalCode: string
  categories: string[]
}

export type PreferencesProps = {
  withGreeting?: boolean
  availableCategories?: PreferenceCategory[]
  firstName: string
  userPreferences?: AccountInfoData | null
  onPressSubmit: (preferences: AccountInfoData) => Promise<void>
  submitButtonI18nKey: AvailableTranslations
}

export const Preferences: React.FC<PreferencesProps> = ({
  withGreeting,
  availableCategories,
  firstName,
  userPreferences,
  onPressSubmit,
  submitButtonI18nKey,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const [loading, setLoading] = useState(false)

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(
      z.object({
        postalCode: z.literal('').or(POSTAL_CODE_SCHEMA(t, true)),
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
        <View style={withGreeting ? styles.contentWithGreeting : styles.contentWihoutGreeting}>
          {withGreeting && (
            <TranslatedText
              textStyle="HeadlineH3Extrabold"
              textStyleOverrides={styles.greeting}
              i18nKey="preferences_welcome"
              i18nParams={{ firstName }}
              testID={buildTestId('preferences_welcome_title')}
            />
          )}
          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={styles.description}
            i18nKey="preferences_location"
            testID={buildTestId('preferences_location_text')}
          />
          <FormFieldWithControl
            name="postalCode"
            component={TextFormField}
            labelI18nKey="preferences_postal_code_input"
            testID={buildTestId('preferences_form_postal_code')}
            control={form.control}
            keyboardType="number-pad"
          />

          <TranslatedText
            textStyle="HeadlineH4Bold"
            textStyleOverrides={styles.yourPreferencesTitle}
            i18nKey="preferences_your_preferences"
            testID={buildTestId('preferences_your_preferences_title')}
          />
          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={{ color: colors.moonDarkest }}
            i18nKey="preferences_your_preferences_description"
            testID={buildTestId('preferences_your_preferences_description')}
          />
          <TranslatedText
            textStyle="CaptionSemibold"
            textStyleOverrides={styles.yourPreferencesSelectionTitle}
            i18nKey="preferences_your_preferences_selection_title"
            testID={buildTestId('preferences_your_preferences_selection_title')}
          />

          <FormFieldWithControl
            name="categories"
            control={form.control}
            component={PreferencesCategorySelector}
            availableCategories={availableCategories}
            testID={buildTestId('preferences_select_categories')}
          />
        </View>
      </ScreenContent>
      <View style={styles.submitButtonView}>
        <Button
          disabled={!form.formState.isValid}
          testID={buildTestId('preferences_form_submit')}
          i18nKey={submitButtonI18nKey}
          onPress={onSubmit}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  contentWithGreeting: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[7],
    paddingTop: spacing[8],
  },
  contentWihoutGreeting: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[7],
    paddingTop: spacing[7],
  },
  greeting: {
    textAlign: 'center',
    marginTop: 0,
    marginBottom: spacing[6],
    color: colors.basicBlack,
  },
  description: {
    marginBottom: spacing[6],
    color: colors.moonDarkest,
  },
  yourPreferencesTitle: {
    marginTop: spacing[7],
    marginBottom: spacing[2],
    color: colors.moonDarkest,
  },
  yourPreferencesSelectionTitle: {
    marginTop: spacing[5],
    marginBottom: spacing[5],
    fontWeight: '400',
    fontSize: spacing[6] / 2,
    lineHeight: spacing[5],
    color: colors.moonDarkest,
  },
  submitButtonView: {
    padding: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
})
