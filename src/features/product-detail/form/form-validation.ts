import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { z } from 'zod'
import { commerceApi } from '../../../services/api/commerce-api'
import { GetLocationSuggestionsResponse } from '../../../services/api/types/commerce/commerce-get-location-suggestions'
import { logger } from '../../../services/logger'
import { TranslationFunction } from '../../../services/translation/translation'
import { validatePostalCodeField } from '../../../utils/form-field/validate-postal-code-field'
import {
  containsSpecialCharacter,
  isFiveDigitNumber,
  isStartingWithNumber,
  isValidLocationSuggestionString,
} from '../utils'

export const POSTAL_CODE_OR_CITY_SCHEMA = (
  t: TranslationFunction,
  validatePostalCode: LazyQueryTrigger<typeof commerceApi.endpoints.getIsValidPostalCode.Types.QueryDefinition>,
  fetchLocationSuggestions: ({ query }: { query: string }) => Promise<GetLocationSuggestionsResponse>,
  isRequired?: boolean,
) => {
  let schema = z.string().trim()

  if (isRequired) {
    schema = schema.min(1)
  }

  return schema.superRefine(async (cityOrPostalCode, ctx) => {
    if (isFiveDigitNumber(cityOrPostalCode)) {
      await validatePostalCodeField(ctx, t, validatePostalCode, cityOrPostalCode)
    } else if (isStartingWithNumber(cityOrPostalCode) && cityOrPostalCode.length <= 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('form_error_not_valid_postal_code'),
      })
      return
    } else if (isStartingWithNumber(cityOrPostalCode) && cityOrPostalCode.length > 5) {
      // invalid input, there is no postal code with more than 5 digits
      return
    }

    if (containsSpecialCharacter(cityOrPostalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('form_error_suggestions_input_invalid'),
      })
      return
    }

    if (!isValidLocationSuggestionString(cityOrPostalCode)) {
      return
    }

    try {
      await fetchLocationSuggestions({ query: cityOrPostalCode })
    } catch (e) {
      logger.warn('suggestions validation error', JSON.stringify(e))

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('form_error_suggestions_technical'),
      })
      return z.INVALID
    }
  })
}
