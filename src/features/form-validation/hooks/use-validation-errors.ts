import { useCallback } from 'react'
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { CdcStatusValidationError } from '../../../services/errors/cdc-errors'
import { useTranslation } from '../../../services/translation/translation'
import { getErrorTranslationKeyFromValidationError } from '../utils/form-validation'

const isKeyOfObject = <T extends object>(key: string | number | symbol, obj: T): key is keyof T => {
  return key in obj
}

export const useValidationErrors = <T extends FieldValues>(form: UseFormReturn<T>) => {
  const { t } = useTranslation()

  const setError = useCallback(
    (fieldError: { errorCode: number; message: string; fieldName: string }) => {
      const values = form.getValues()
      if (isKeyOfObject(fieldError.fieldName, values)) {
        const errorTranslation = getErrorTranslationKeyFromValidationError(fieldError)
        form.setError(fieldError.fieldName as FieldPath<T>, {
          message: errorTranslation.values ? t(errorTranslation.key, errorTranslation.values) : t(errorTranslation.key),
          type: 'value',
        })
      }
    },
    [form, t],
  )

  const setErrors = useCallback(
    (error: CdcStatusValidationError) => {
      for (const fieldError of error.validationErrors) {
        setError(fieldError)
      }
    },
    [setError],
  )

  return { setError, setErrors }
}
