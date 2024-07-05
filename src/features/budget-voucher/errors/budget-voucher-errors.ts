export const budgetVoucherErrorTypes = [
  'KpBudgetVoucherCodeUnknownError',
  'KpBudgetVoucherCodeExpiredError',
  'KpBudgetVoucherCodeRedeemedError',
  'KpBudgetVoucherCodeRevokedError',
  'KpBudgetVoucherCodeTooManyAttemptsError',
] as const

export type BudgetVoucherErrorType = (typeof budgetVoucherErrorTypes)[number]
