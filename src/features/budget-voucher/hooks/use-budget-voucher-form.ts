import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useFocusErrors } from '../../form-validation/hooks/use-focus-errors'
import { useValidationErrors } from '../../form-validation/hooks/use-validation-errors'
import { BudgetVoucherFormData } from '../types/budget-voucher-types'

export const useBudgetVoucherForm = () => {
  const form = useForm<BudgetVoucherFormData>({
    shouldFocusError: false,
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        voucherCode: z.string().trim().min(5),
      }),
    ),
  })

  useFocusErrors(form)

  const { setError } = useValidationErrors(form)

  return { form, setError }
}
