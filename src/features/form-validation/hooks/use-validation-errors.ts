import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import { CdcStatusValidationError } from '../../../services/errors/cdc-errors'
import { useTranslation } from '../../../services/translation/translation'
import { getErrorTranslationKeyFromValidationError } from '../utils/form-validation'

const isKeyOfObject = <T extends object>(key: string | number | symbol, obj: T): key is keyof T => {
  return key in obj
}

export const useValidationErrors = <T extends FieldValues>(form: UseFormReturn<T>) => {
  const { t } = useTranslation()

  return {
    setErrors: (error: CdcStatusValidationError) => {
      const values = form.getValues()
      for (const fieldError of error.validationErrors) {
        if (isKeyOfObject(fieldError.fieldName, values)) {
          const errorTranslation = getErrorTranslationKeyFromValidationError(fieldError)
          form.setError(fieldError.fieldName as FieldPath<T>, {
            message: errorTranslation.values
              ? t(errorTranslation.key, errorTranslation.values)
              : t(errorTranslation.key),
            type: 'value',
          })
        }
      }
    },
  }
}
