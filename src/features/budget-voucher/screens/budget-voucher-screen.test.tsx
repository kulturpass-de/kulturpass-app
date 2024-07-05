import { NavigationContainer } from '@react-navigation/native'
import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { Price } from '../../../services/api/types/commerce/api-types'
import { addTestIdModifier, buildTestId } from '../../../services/test-id/test-id'
import { configureMockStore } from '../../../services/testing/configure-mock-store'
import { BudgetVoucherScreen } from './budget-voucher-screen'

describe('budget-voucher-screen', () => {
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

  const renderBudgetVoucherScreen = ({ onNext }: { onNext?: (price: Price) => void } = {}) => {
    renderScreen(<BudgetVoucherScreen onClose={jest.fn()} onNext={onNext ?? jest.fn()} />)
  }

  const testId = buildTestId('budget_voucher')

  const screenTestId = addTestIdModifier(testId, 'screen')
  const submitButtonTestId = addTestIdModifier(testId, 'submit')
  const cancelButtonTestId = addTestIdModifier(testId, 'cancel')
  const inputFieldTestId = addTestIdModifier(testId, 'input')

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should be visible with a disabled submit button, then have it enabled after user input', async () => {
    const onNext = jest.fn()
    renderBudgetVoucherScreen({ onNext })

    expect(await screen.findByTestId(screenTestId)).toBeVisible()

    expect(await screen.findByTestId(cancelButtonTestId)).toBeVisible()

    expect(await screen.findByTestId(submitButtonTestId)).toBeVisible()
    expect(await screen.findByTestId(submitButtonTestId)).toBeDisabled()

    const user = userEvent.setup()

    const inputElement = await screen.findByTestId(inputFieldTestId)

    expect(inputElement.props?.value).toEqual(undefined)

    const newInput = 'ABCDEFG'

    await user.type(inputElement, newInput)

    expect(inputElement.props?.value).toEqual(newInput)

    expect(await screen.findByTestId(submitButtonTestId)).toBeEnabled()
  })
})
