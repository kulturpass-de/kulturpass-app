import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'

import { AccountsRegisterResponse } from '../../services/api/types'
import * as authLoginModule from '../../services/auth/store/thunks/auth-login'
import { addTestIdModifier, buildTestId } from '../../services/test-id/test-id'
import { configureMockStore } from '../../services/testing/configure-mock-store'
import t from '../../services/translation/i18n/de.json'
import { register } from '../../services/user/redux/thunks/register'
import { RegistrationFormScreen } from './registration-form-screen'

const server = setupServer()

describe('registration-form-screen', () => {
  const store = configureMockStore()

  const renderScreen = (children: React.ReactNode) => {
    render(
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>{children}</NavigationContainer>
        </Provider>
      </SafeAreaProvider>,
    )
  }

  const renderRegistrationScreen = ({ afterRegister }: { afterRegister?: (regToken: string) => void } = {}) => {
    renderScreen(<RegistrationFormScreen onHeaderPressClose={jest.fn()} afterRegister={afterRegister ?? jest.fn()} />)
  }

  const emailInput = buildTestId('registration_form_email')
  const passwordInput = buildTestId('registration_form_password')
  const passwordConfirmInput = buildTestId('registration_form_confirmPassword')
  const firstNameInput = buildTestId('registration_form_firstName')
  const dateOfBirthInput = buildTestId('registration_form_dateOfBirth')
  const formSubmitBtn = buildTestId('registration_form_submit')

  const cdcLoginResult = {
    profile: { firstName: 'Tester' },
    sessionInfo: { sessionToken: 'MySessionToken', sessionSecret: 'MySessionSeecret' },
  }
  const commerceLoginResult = { auth_something: 'token' }

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('Should display no errors on initial render', async () => {
    renderRegistrationScreen()

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()
    expect(screen.queryByTestId(addTestIdModifier(emailInput, 'error'))).not.toBeOnTheScreen()
    expect(screen.queryByTestId(addTestIdModifier(passwordInput, 'error'))).not.toBeOnTheScreen()
  })

  it('Should have disabled submit button on initial render', async () => {
    renderRegistrationScreen()

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()
  })

  it('Should enable submit button when form gets dirty', async () => {
    renderRegistrationScreen()

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()
    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), ' ')
    expect(await screen.findByTestId(formSubmitBtn)).toBeEnabled()
  })

  it('Should display errors when submitting without values', async () => {
    renderRegistrationScreen()

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()

    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'abcdef')
    fireEvent.press(screen.getByTestId(formSubmitBtn))

    expect(await screen.findByTestId(`${emailInput}_error`)).toBeOnTheScreen()
    expect(screen.getByTestId(`${passwordInput}_error`)).toBeOnTheScreen()
    expect(screen.getByTestId(`${passwordConfirmInput}_error`)).toBeOnTheScreen()

    expect(screen.queryByTestId(`${firstNameInput}_error`)).not.toBeOnTheScreen()
    expect(screen.queryByTestId(`${dateOfBirthInput}_error`)).not.toBeOnTheScreen()

    expect(screen.getAllByText(t.form_error_not_valid_email)).toHaveLength(1)
    expect(screen.getAllByText(t.form_error_invalid_type)).toHaveLength(2)
  })

  it('Should handle email input field', async () => {
    renderRegistrationScreen()

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()

    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), '')
    fireEvent.press(screen.getByTestId(formSubmitBtn))

    expect(await screen.findByTestId(`${emailInput}_error`)).toBeOnTheScreen()
    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'nope')
    expect(await screen.findByText(t.form_error_not_valid_email)).toBeOnTheScreen()
    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'email@example.org')
    await waitForElementToBeRemoved(() => screen.getByTestId(`${emailInput}_error`))
  })

  it('Should handle password input field', async () => {
    renderRegistrationScreen()

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()

    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'email@example.org')

    await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
    fireEvent.press(screen.getByTestId(formSubmitBtn))

    const expectedCountOfErrors = 2
    expect(await screen.findAllByText(t.form_error_invalid_type)).toHaveLength(expectedCountOfErrors)

    fireEvent.changeText(screen.getByTestId(`${passwordInput}_input`), 'S3cr3t')
    await waitForElementToBeRemoved(() => screen.getByTestId(`${passwordInput}_error`))

    fireEvent.changeText(screen.getByTestId(`${passwordConfirmInput}_input`), 'S3c')
    expect(await screen.findByText(t.form_error_different_from_password)).toBeOnTheScreen()

    fireEvent.changeText(screen.getByTestId(`${passwordConfirmInput}_input`), 'S3cr3t')
    await waitForElementToBeRemoved(() => screen.getByTestId(`${passwordConfirmInput}_error`))
  })

  it('Should handle birthdate input field', async () => {
    renderRegistrationScreen()

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()

    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'cp@example.org')
    fireEvent.changeText(screen.getByTestId(`${passwordInput}_input`), 'S3cr3t')
    fireEvent.changeText(screen.getByTestId(`${passwordConfirmInput}_input`), 'S3cr3t')
    fireEvent.changeText(screen.getByTestId(`${dateOfBirthInput}_input`), '01')

    await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
    fireEvent.press(screen.getByTestId(formSubmitBtn))
    expect(await screen.findByTestId(`${dateOfBirthInput}_error`)).toBeOnTheScreen()
    expect(await screen.findByText(t.form_error_date)).toBeOnTheScreen()

    fireEvent.changeText(screen.getByTestId(`${dateOfBirthInput}_input`), '01.01.2020')
    await waitForElementToBeRemoved(() => screen.getByTestId(`${dateOfBirthInput}_error`))
  })

  it('Should be able to submit registration form successfully with only mandatory fields', async () => {
    server.use(
      rest.post('*/accounts.initRegistration', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('*/accounts.register', (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            regToken: 'my_reg_token',
            profile: { firstName: '', age: 18, email: 'cp@example.org', birthYear: 1993 },
          } satisfies Pick<AccountsRegisterResponse, 'regToken' | 'profile'>),
        ),
      ),
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
    )

    const afterRegister = jest.fn()
    renderRegistrationScreen({ afterRegister })

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()

    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'cp@example.org')
    fireEvent.changeText(screen.getByTestId(`${passwordInput}_input`), 'S3cr3t')
    fireEvent.changeText(screen.getByTestId(`${passwordConfirmInput}_input`), 'S3cr3t')

    await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
    await act(() => fireEvent.press(screen.getByTestId(formSubmitBtn)))

    store.expectActions([
      {
        type: register.pending.type,
        meta: { arg: { email: 'cp@example.org', password: 'S3cr3t', confirmPassword: 'S3cr3t' } },
      },
    ])

    await waitFor(() => expect(afterRegister).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(afterRegister).toHaveBeenCalledWith('my_reg_token', ''))

    store.expectActions([
      {
        type: authLoginModule.authLogin.pending.type,
        meta: { arg: { loginID: 'cp@example.org', password: 'S3cr3t' } },
      },
    ])
  })

  it('Should be able to submit registration form successfully with all fields', async () => {
    server.use(
      rest.post('*/accounts.initRegistration', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('*/accounts.register', (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            regToken: 'my_reg_token',
            profile: { firstName: 'Nice', age: 18, email: 'cp@example.org', birthYear: 1993 },
          } satisfies Pick<AccountsRegisterResponse, 'regToken' | 'profile'>),
        ),
      ),
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
    )

    const afterRegister = jest.fn()
    renderRegistrationScreen({ afterRegister })

    expect(await screen.findByTestId(formSubmitBtn)).toBeDisabled()

    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'cp@example.org')
    fireEvent.changeText(screen.getByTestId(`${passwordInput}_input`), 'S3cr3t')
    fireEvent.changeText(screen.getByTestId(`${passwordConfirmInput}_input`), 'S3cr3t')
    fireEvent.changeText(screen.getByTestId(`${firstNameInput}_input`), 'Nice')
    fireEvent.changeText(screen.getByTestId(`${dateOfBirthInput}_input`), '01.01.1993')

    await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
    await act(() => fireEvent.press(screen.getByTestId(formSubmitBtn)))

    store.expectActions([
      {
        type: register.pending.type,
        meta: {
          arg: {
            email: 'cp@example.org',
            password: 'S3cr3t',
            confirmPassword: 'S3cr3t',
            firstName: 'Nice',
            dateOfBirth: '1993-01-01',
          },
        },
      },
    ])

    await waitFor(() => expect(afterRegister).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(afterRegister).toHaveBeenCalledWith('my_reg_token', 'Nice'))

    store.expectActions([
      {
        type: authLoginModule.authLogin.pending.type,
        meta: { arg: { loginID: 'cp@example.org', password: 'S3cr3t' } },
      },
    ])
  })
})
