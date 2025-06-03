import { TypedLazyQueryTrigger } from '@reduxjs/toolkit/query/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Switch, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { TextFormField } from '../../../components/form-fields/text-form-field'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ScreenContent } from '../../../components/screen/screen-content'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { commerceApi } from '../../../services/api/commerce-api'
import { AccountInfoData, PreferenceCategory } from '../../../services/api/types'
import { CdcStatusValidationError } from '../../../services/errors/cdc-errors'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useFocusErrors } from '../../form-validation/hooks/use-focus-errors'
import { useValidationErrors } from '../../form-validation/hooks/use-validation-errors'
import { UsePreferencesReturnType } from '../hooks/use-preferences'
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
  getIsValidPostalCode: TypedLazyQueryTrigger<
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.QueryArg,
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.ResultType,
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.BaseQuery
  >
  form: UsePreferencesReturnType
  setToggleSwitch?: (value: boolean) => void
  isEmailSubscribed?: boolean
  onClickEditorialEmailConsent?: () => void
}

export const Preferences: React.FC<PreferencesProps> = ({
  withCategoriesLabel,
  inModal,
  availableCategories,
  userPreferences,
  onPressSubmit,
  submitButtonI18nKey,
  form,
  setToggleSwitch,
  isEmailSubscribed,
  onClickEditorialEmailConsent,
}) => {
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  const [loading, setLoading] = useState(false)

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

  const onSubmit = form.handleSubmit(async formValues => {
    setLoading(true)
    try {
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

      await onPressSubmit(preferences)
    } catch (error: unknown) {
      if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        ErrorAlertManager.current?.showError(error)
      } else {
        logger.warn('preferences submit error cannot be interpreted', JSON.stringify(error))
        ErrorAlertManager.current?.showError(new UnknownError('Preferences Submit'))
      }
    } finally {
      setLoading(false)
    }
  })

  const toggleSwitch = useCallback(
    (isEnabled: boolean) => {
      if (setToggleSwitch) {
        setToggleSwitch(isEnabled)
      }
    },
    [setToggleSwitch],
  )

  return (
    <>
      <LoadingIndicator loading={loading} />
      <ScreenContent style={styles.content}>
        <TranslatedText
          accessibilityRole="header"
          textStyle="HeadlineH4Bold"
          textStyleOverrides={[styles.yourPreferencesTitle, { color: colors.labelColor }]}
          i18nKey="preferences_your_preferences"
          testID={buildTestId('preferences_your_preferences_title')}
        />
        <TranslatedText
          textStyle="BodyRegular"
          textStyleOverrides={[styles.yourPreferencesDescription, { color: colors.labelColor }]}
          i18nKey="preferences_your_preferences_description"
          testID={buildTestId('preferences_your_preferences_description')}
        />
        {withCategoriesLabel ? (
          <TranslatedText
            textStyle="CaptionSemibold"
            textStyleOverrides={[styles.yourPreferencesSelectionTitle, { color: colors.labelColor }]}
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
            accessibilityRole="header"
            textStyle="HeadlineH4Bold"
            textStyleOverrides={[styles.postalCodeTitle, { color: colors.labelColor }]}
            i18nKey="preferences_postal_code_title"
            testID={buildTestId('preferences_postal_code_title')}
          />
          <View>
            <FormFieldWithControl
              name="postalCode"
              component={TextFormField}
              labelI18nKey="preferences_postal_code_input"
              testID={buildTestId('preferences_form_postal_code')}
              control={form.control}
              maxLength={5}
              disableAccessibilityForLabel
              keyboardType="number-pad"
            />
            <TranslatedText
              textStyle="BodyRegular"
              textStyleOverrides={[styles.description, { color: colors.labelColor }]}
              i18nKey="preferences_location"
              testID={buildTestId('preferences_location_text')}
            />
          </View>
        </View>

        {setToggleSwitch !== undefined ? (
          <View>
            <TranslatedText
              accessibilityRole="header"
              textStyle="HeadlineH4Bold"
              textStyleOverrides={[styles.postalCodeTitle, { color: colors.labelColor }]}
              i18nKey="onboarding_notificationPermission_headline_title"
              testID={buildTestId('onboarding_notificationPermission_headline_title')}
            />

            <View style={styles.toggleSwitchContainer}>
              <TranslatedText
                textStyle="BodyRegular"
                textStyleOverrides={[styles.description, { color: colors.labelColor }]}
                i18nKey="editorial_email_consent_notification"
                testID={buildTestId('editorial_email_consent_notification')}
              />
              <Switch
                trackColor={{
                  false: colors.secondaryBackground,
                  true: colors.labelColor,
                }}
                thumbColor={isEmailSubscribed ? colors.secondaryBackground : colors.labelColor}
                ios_backgroundColor={colors.secondaryBackground}
                onValueChange={toggleSwitch}
                value={isEmailSubscribed}
                style={styles.switchContainer}
              />
            </View>

            <Pressable
              style={[styles.notificationPanel, { backgroundColor: colors.secondaryBackground }]}
              onPress={onClickEditorialEmailConsent}>
              <SvgImage type="mailbox-notification" width={32} height={42} style={styles.notificationPanelIcon} />
              <TranslatedText
                i18nKey={'email_consent_accept'}
                textStyle={'BodyBold'}
                textStyleOverrides={[styles.notificationPanelText, { color: colors.labelColor }]}
              />
              <SvgImage type="right-arrow" width={36} height={46} style={styles.notificationPanelIcon} />
            </Pressable>
          </View>
        ) : null}
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
  switchContainer: {
    borderWidth: 1,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[7],
  },
  description: {
    marginBottom: spacing[6],
  },
  yourPreferencesTitle: {
    marginBottom: spacing[2],
  },
  yourPreferencesDescription: {
    marginBottom: spacing[5],
  },
  yourPreferencesSelectionTitle: {
    marginBottom: spacing[5],
    fontWeight: '400',
    fontSize: spacing[6] / 2,
    lineHeight: spacing[5],
  },
  postalCodeContainer: {
    marginTop: spacing[5],
  },
  postalCodeTitle: {
    marginBottom: spacing[5],
  },
  toggleSwitchContainer: {
    flexDirection: 'row',
  },
  notificationPanel: {
    borderRadius: spacing[5],
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationPanelText: {
    flex: 1,
    marginHorizontal: spacing[2],
  },
  notificationPanelIcon: {
    marginHorizontal: spacing[2],
  },
})
