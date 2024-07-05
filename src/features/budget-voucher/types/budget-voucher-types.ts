export type BudgetVoucherFormData = {
  voucherCode: string
}

export type PostBudgetVoucherRedemptionParams = {
  voucherCode: string
}

export type PostBudgetVoucherRedemptionBody = Pick<PostBudgetVoucherRedemptionParams, 'voucherCode'>

export type PostBudgetVoucherRedemptionResponse = {
  amount: number
  currency: string
}
