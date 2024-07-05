import { NavigationContainer } from '@react-navigation/native'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { Price } from '../../../services/api/types/commerce/api-types'
import { addTestIdModifier, buildTestId } from '../../../services/test-id/test-id'
import { configureMockStore } from '../../../services/testing/configure-mock-store'
import { BudgetVoucherSuccessScreen } from './budget-voucher-success-screen'

describe('budget-voucher-success-screen', () => {
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

  const renderBudgetVoucherSuccessScreen = ({ price }: { price: Price }) => {
    renderScreen(<BudgetVoucherSuccessScreen onDone={jest.fn()} price={price} />)
  }

  const testId = buildTestId('budget_voucher_success')

  const screenTestId = addTestIdModifier(testId, 'screen')
  const imageTestId = addTestIdModifier(testId, 'image')
  const doneButtonTestId = addTestIdModifier(testId, 'done')
  const textTestId = addTestIdModifier(testId, 'text')

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should be visible including image and text with its correct content based on the given price', async () => {
    const price: Price = { value: 125, currencyIso: 'EUR' }
    const expectedText = `Dein Budget wurde um <bold>125,00 €</bold> erhöht.`

    renderBudgetVoucherSuccessScreen({ price })

    expect(await screen.findByTestId(screenTestId)).toBeVisible()
    expect(await screen.findByTestId(imageTestId)).toBeVisible()
    expect(await screen.findByTestId(doneButtonTestId)).toBeVisible()
    expect(await screen.findByTestId(doneButtonTestId)).toBeEnabled()

    const text = await screen.findByTestId(textTestId)
    expect(text).toHaveTextContent(expectedText)
  })
})
