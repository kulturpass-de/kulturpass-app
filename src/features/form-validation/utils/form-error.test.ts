import { FormError, FormErrorTypeWithoutPrefix } from './form-error'

describe('FormField errors', () => {
  test('FormError', () => {
    expect(new FormError('required')).toHaveProperty('type', 'required')
    expect(new FormError('asdf' as FormErrorTypeWithoutPrefix)).toHaveProperty('type', 'asdf')
  })
})
