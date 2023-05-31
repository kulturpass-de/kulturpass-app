import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import t from '../../services/translation/i18n/de.json'
import { AppProviders, serverHandlersRequired, StoreProvider } from '../../services/testing/test-utils'
import { FavoriteButton } from './favorite-button'
import { act } from 'react-test-renderer'

const renderComponent = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <StoreProvider withLoginSession>{children}</StoreProvider>
    </AppProviders>,
  )
}

const server = setupServer(...serverHandlersRequired)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Should toggle the state and call the api', async () => {
  let apiCalledCounter = 0

  server.use(
    rest.get('*/cc/kulturapp/users/current/favourites', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          favouritesItems: [{ product: { code: 'PRODUCT_CODE_1' }, cartId: 'D11242100021', entryNumber: 3 }],
        }),
      )
    }),
    rest.delete('*/cc/kulturapp/users/current/carts/D11242100021/entries/3', (_req, res, ctx) => {
      apiCalledCounter++
      return res(ctx.status(200), ctx.text('OK'))
    }),
  )

  renderComponent(
    <FavoriteButton
      cartId="D11242100021"
      productCode="PRODUCT_CODE_1"
      active={true}
      testID="this_is_a_wonderful_button"
    />,
  )

  expect(await screen.findByTestId('this_is_a_wonderful_button')).toBeOnTheScreen()
  expect(screen.getByLabelText(t.favorites_item_remove_a11y_label)).toBeOnTheScreen()

  await act(() => {
    fireEvent.press(screen.getByTestId('this_is_a_wonderful_button'))
  })

  await waitFor(() => expect(screen.getByLabelText(t.favorites_item_add_a11y_label)).toBeOnTheScreen())
  await waitFor(() => expect(apiCalledCounter).toBe(1), { timeout: 2000 })
})

test('Should revert the state if api call fails', async () => {
  renderComponent(
    <FavoriteButton
      cartId="D11242100021"
      productCode="PRODUCT_CODE_2"
      active={true}
      testID="this_is_a_wonderful_button"
    />,
  )

  server.use(
    rest.get('*/cc/kulturapp/users/current/favourites', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          favouritesItems: [{ product: { code: 'PRODUCT_CODE_2' }, cartId: 'D11242100021', entryNumber: 123 }],
        }),
      )
    }),
    rest.delete('*/cc/kulturapp/users/current/carts/D11242100021/entries/123', async (_req, res, ctx) => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return res(ctx.status(500), ctx.text('NOT_OK'))
    }),
  )

  fireEvent.press(await screen.findByTestId('this_is_a_wonderful_button'))
  // optimistic ui changes it immediately
  await waitFor(() => expect(screen.getByLabelText(t.favorites_item_add_a11y_label)).toBeOnTheScreen())
  // backend throws error and it should revert the state
  await waitFor(() => expect(screen.getByLabelText(t.favorites_item_remove_a11y_label)).toBeOnTheScreen())
})
