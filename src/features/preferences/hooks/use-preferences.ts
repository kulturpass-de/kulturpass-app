import { zodResolver } from '@hookform/resolvers/zod'
import { TypedLazyQueryTrigger } from '@reduxjs/toolkit/query/react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { commerceApi } from '../../../services/api/commerce-api'
import { POSTAL_CODE_SCHEMA } from '../../form-validation/utils/form-validation'
import { PreferencesFormData } from '../components/preferences'

type UsePreferencesInputType = {
  getIsValidPostalCode: TypedLazyQueryTrigger<
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.QueryArg,
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.ResultType,
    typeof commerceApi.endpoints.getIsValidPostalCode.Types.BaseQuery
  >
  defaultValues?: Partial<PreferencesFormData>
}

export type UsePreferencesReturnType = UseFormReturn<PreferencesFormData>

export const usePreferences = ({
  getIsValidPostalCode,
  defaultValues,
}: UsePreferencesInputType): UsePreferencesReturnType => {
  const { t } = useTranslation()

  return useForm<PreferencesFormData>({
    shouldFocusError: false,
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        postalCode: z.literal('').or(POSTAL_CODE_SCHEMA(t, getIsValidPostalCode, true)),
        categories: z.string().array().min(0),
      }),
    ),
    defaultValues: defaultValues || {
      postalCode: '',
      categories: [],
    },
  })
}
