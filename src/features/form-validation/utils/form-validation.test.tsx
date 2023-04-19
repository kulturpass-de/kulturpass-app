import { getErrorTranslationKeyFromValidationError } from './form-validation'

test('Should return the translation key for server validation error', () => {
  expect(
    getErrorTranslationKeyFromValidationError({
      errorCode: 400003,
      message: 'email already exists',
      fieldName: 'email',
    }),
  ).toEqual({
    key: 'form_error_email_exists',
  })
  expect(
    getErrorTranslationKeyFromValidationError({
      errorCode: 400006,
      message: "invalid password - minimum length of '6' characters is required.",
      fieldName: 'password',
    }),
  ).toEqual({
    key: 'form_error_password_min_length',
    values: { minLength: '6' },
  })
  expect(
    getErrorTranslationKeyFromValidationError({
      errorCode: 400006,
      message: "invalid password - character groups of '4' is required.",
      fieldName: 'password',
    }),
  ).toEqual({
    key: 'form_error_password_character_groups',
    values: { count: '4' },
  })
})
