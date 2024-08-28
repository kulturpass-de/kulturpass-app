import { z } from 'zod'
import { BankIdSuggestion } from '../../../services/api/types/commerce/commerce-get-bank-id-suggestions'
import { logger } from '../../../services/logger'
import { TranslationFunction } from '../../../services/translation/translation'

export const BANK_ID_SCHEMA = (
  t: TranslationFunction,
  fetchBankSuggestions: ({ query }: { query: string }) => Promise<BankIdSuggestion[]>,
) => {
  let schema = z.string().trim().min(3)

  return schema.superRefine(async (bank, ctx) => {
    try {
      await fetchBankSuggestions({ query: bank })
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
