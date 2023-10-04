import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import t from '../../services/translation/i18n/de.json'
import { LogInScreen } from './log-in-screen'

const renderLoginScreen = ({ afterLogin }: { afterLogin?: () => Promise<void> } = {}) => {
  const mockAfterClose = jest.fn()
  const mockAfterRegister = jest.fn()
  const mockForgotPassword = jest.fn()
  const mockOnLoginSuccess = jest.fn()

  renderScreen(
    <LogInScreen
      afterClose={mockAfterClose}
      afterLogin={afterLogin ?? jest.fn()}
      afterRegister={mockAfterRegister}
      afterForgotPassword={mockForgotPassword}
      onLoginSuccess={mockOnLoginSuccess}
    />,
  )
}

const emailInput = buildTestId('login_form_email_input')
const passwordInput = buildTestId('login_form_password_input')
const formSubmitBtn = buildTestId('login_button')
const emailError = buildTestId('login_form_email_error')
const passwordError = buildTestId('login_form_password_error')

test('Should display no errors on initial render', async () => {
  renderLoginScreen()
  expect(screen.getByTestId(formSubmitBtn)).toBeDisabled()
  expect(screen.queryByTestId(emailError)).not.toBeOnTheScreen()
  expect(screen.queryByTestId(passwordError)).not.toBeOnTheScreen()
})

test('Should enable the submit button if all required files are filled', async () => {
  renderLoginScreen()
  fireEvent.changeText(screen.getByTestId(emailInput), '')
  await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
})

test('Should handle email input field', async () => {
  renderLoginScreen()

  fireEvent.changeText(screen.getByTestId(emailInput), 'nope')
  await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())

  fireEvent.press(screen.getByTestId(formSubmitBtn))
  expect(await screen.findByTestId(emailError)).toBeOnTheScreen()
  expect(screen.getByText(t.form_error_not_valid_email)).toBeOnTheScreen()

  fireEvent.changeText(screen.getByTestId(emailInput), 'email@example.org')
  await waitForElementToBeRemoved(() => screen.getByTestId(emailError))
  expect(screen.queryByTestId(emailError)).not.toBeOnTheScreen()

  fireEvent.changeText(screen.getByTestId(emailInput), 'email@example')
  expect(await screen.findByTestId(emailError)).toBeOnTheScreen()
})

test('Should handle password input field', async () => {
  renderLoginScreen()

  fireEvent.changeText(screen.getByTestId(emailInput), 'email@example.org')
  await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
  fireEvent.press(screen.getByTestId(formSubmitBtn))

  expect(await screen.findByTestId(passwordError)).toBeOnTheScreen()
  expect(screen.getAllByText(t.form_error_invalid_type)).toHaveLength(1)
  fireEvent.changeText(screen.getByTestId(passwordInput), 'S3cr3t')
  await waitForElementToBeRemoved(() => screen.getByTestId(passwordError))
})

test('Should be able to submit login form successfully', async () => {
  const afterLogin = jest.fn()
  renderLoginScreen({ afterLogin })

  expect(screen.getByTestId(formSubmitBtn)).toBeDisabled()

  fireEvent.changeText(screen.getByTestId(emailInput), 'cp@example.org')
  fireEvent.changeText(screen.getByTestId(passwordInput), 'S3cr3t')

  await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
  fireEvent.press(screen.getByTestId(formSubmitBtn))

  await waitFor(() => expect(afterLogin).toHaveBeenCalledTimes(1))
  await waitFor(() =>
    expect(afterLogin).toHaveBeenCalledWith({
      email: 'cp@example.org',
      password: 'S3cr3t',
    }),
  )
})
