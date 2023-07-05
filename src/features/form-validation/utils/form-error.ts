import { AvailableTranslations } from '../../../components/translated-text/types'
import { ErrorWithCode } from '../../../services/errors/errors'

export type FormErrorType = Extract<AvailableTranslations, `form_error_${string}`>
export type FormErrorTypeWithoutPrefix = FormErrorType extends `form_error_${infer U}` ? U : unknown

export class FormError extends ErrorWithCode {
  public type: FormErrorTypeWithoutPrefix

  constructor(errorCode: FormErrorTypeWithoutPrefix) {
    super(errorCode)
    this.type = errorCode
  }
}
