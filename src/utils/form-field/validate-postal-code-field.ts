import { TypedLazyQueryTrigger } from '@reduxjs/toolkit/query/react'
import { z, type RefinementCtx } from 'zod'
import { commerceApi } from '../../services/api/commerce-api'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { ErrorWithCode, HttpError, UnknownError } from '../../services/errors/errors'
import { logger } from '../../services/logger'
import { type TranslationFunction } from '../../services/translation/translation'

export const validatePostalCodeField = async (
  ctx: RefinementCtx,
  t: TranslationFunction,
  validatePostalCode: TypedLazyQueryTrigger<
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.QueryArg,
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.ResultType,
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.BaseQuery
  >,
  postalCode: string,
) => {
  const result = await validatePostalCode({ postalCode })

  if (result.isError) {
    if (result.error instanceof HttpError && result.error.statusCode === 400) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('form_error_not_valid_postal_code_verified'),
      })
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
      })
      if (result.error instanceof ErrorWithCode) {
        ErrorAlertManager.current?.showError(result.error)
      } else {
        logger.warn('postalcode validation error cannot be interpreted', JSON.stringify(result.error))
        ErrorAlertManager.current?.showError(new UnknownError('Postalcode Validation'))
      }
    }
  }
}
