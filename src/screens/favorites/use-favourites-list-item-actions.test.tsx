import { renderHook, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { act } from 'react-test-renderer'

import { AppProviders, serverHandlersRequired, StoreProvider } from '../../services/testing/test-utils'
import { useFavouritesListItemActions } from './use-favourites-list-item-actions'

describe('useFavouritesListItemActions', () => {
  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
      <AppProviders>
        <StoreProvider withLoginSession>{children}</StoreProvider>
      </AppProviders>
    )
  }

  const server = setupServer(...serverHandlersRequired)

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('Should toggle the state and call the api', async () => {
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

    const hook = renderHook(useFavouritesListItemActions, {
      wrapper,
      initialProps: 'PRODUCT_CODE_1',
    })

    expect(hook.result.current.isFavorite).toBe(true)

    await act(async () => {
      await hook.result.current.removeFromFavorites()
    })

    expect(hook.result.current.isFavorite).toBe(false)
    await waitFor(() => expect(apiCalledCounter).toBe(1), { timeout: 2000 })
  })

  it('Should revert the state if api call fails', async () => {
    const hook = renderHook(useFavouritesListItemActions, {
      wrapper,
      initialProps: 'PRODUCT_CODE_2',
    })

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

    await act(async () => {
      await hook.result.current.removeFromFavorites()
    })

    expect(hook.result.current.isFavorite).toBe(true)
  })

  it('Should remove a favorite item when there is a missing product', async () => {
    const hook = renderHook(useFavouritesListItemActions, {
      wrapper,
      initialProps: 'D11242100021',
    })

    server.use(
      rest.get('*/cc/kulturapp/users/current/favourites', (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            favouritesItems: [
              { cartId: 'D11242100020', entryNumber: 122 },
              { product: { code: 'PRODUCT_CODE_2' }, cartId: 'D11242100021', entryNumber: 123 },
              { cartId: 'D11242100022', entryNumber: 124 },
            ],
          }),
        )
      }),
      rest.delete('*/cc/kulturapp/users/current/carts/D11242100021/entries/123', async (_req, res, ctx) => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return res(ctx.status(200), ctx.text('OK'))
      }),
    )

    expect(hook.result.current.isFavorite).toBe(true)

    await act(async () => {
      await hook.result.current.removeFromFavorites()
    })

    expect(hook.result.current.isFavorite).toBe(false)
  })
})
