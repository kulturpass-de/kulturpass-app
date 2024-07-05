import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { TextFormField } from '../../../components/form-fields/text-form-field'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { BudgetVoucherFormData } from '../types/budget-voucher-types'

type BudgetVoucherInputProps = {
  form: UseFormReturn<BudgetVoucherFormData, any, undefined>
}

export const BudgetVoucherInput: React.FC<BudgetVoucherInputProps> = ({ form }) => {
  const { buildTestId } = useTestIdBuilder()

  return (
    <FormFieldWithControl
      name="voucherCode"
      component={TextFormField}
      testID={buildTestId('budget_voucher')}
      labelI18nKey="budget_voucher_label"
      labelTextStyle="BodySmallMedium"
      control={form.control}
      autoCapitalize="characters"
      autoCorrect={false}
      keyboardType="ascii-capable"
      disableAccessibilityForLabel
    />
  )
}
