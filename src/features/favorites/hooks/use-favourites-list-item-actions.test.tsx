import { renderHook, waitFor } from '@testing-library/react-native'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { act } from 'react-test-renderer'
import { AppProviders, serverHandlersRequired, StoreProvider } from '../../../services/testing/test-utils'
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
      http.get('*/cc/kulturapp/users/current/favourites', () =>
        HttpResponse.json(
          {
            favouritesItems: [{ product: { code: 'PRODUCT_CODE_1' }, cartId: 'D11242100021', entryNumber: 3 }],
          },
          { status: 200 },
        ),
      ),
      http.delete('*/cc/kulturapp/users/current/favourites/entry/PRODUCT_CODE_1', () => {
        apiCalledCounter++
        return HttpResponse.text('OK', { status: 200 })
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

  it('Should revert the state if api call fails for errors other than http 400', async () => {
    const hook = renderHook(useFavouritesListItemActions, {
      wrapper,
      initialProps: 'PRODUCT_CODE_2',
    })

    server.use(
      http.get('*/cc/kulturapp/users/current/favourites', () =>
        HttpResponse.json(
          {
            favouritesItems: [{ product: { code: 'PRODUCT_CODE_2' }, cartId: 'D11242100021', entryNumber: 123 }],
          },
          { status: 200 },
        ),
      ),
      http.delete('*/cc/kulturapp/users/current/favourites/entry/PRODUCT_CODE_2', async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return HttpResponse.text('NOT_OK', { status: 500 })
      }),
    )

    await act(async () => {
      await hook.result.current.removeFromFavorites()
    })

    expect(hook.result.current.isFavorite).toBe(true)
  })

  it('Should update the state (optimistic update) if api call fails for errors with http 400', async () => {
    const hook = renderHook(useFavouritesListItemActions, {
      wrapper,
      initialProps: 'PRODUCT_CODE_2',
    })

    server.use(
      http.get('*/cc/kulturapp/users/current/favourites', () =>
        HttpResponse.json(
          {
            favouritesItems: [{ product: { code: 'PRODUCT_CODE_2' }, cartId: 'D11242100021', entryNumber: 123 }],
          },
          { status: 200 },
        ),
      ),
      http.delete('*/cc/kulturapp/users/current/favourites/entry/PRODUCT_CODE_2', async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return HttpResponse.text('NOT_OK', { status: 400 })
      }),
    )

    await act(async () => {
      await hook.result.current.removeFromFavorites()
    })

    expect(hook.result.current.isFavorite).toBe(false)
  })

  it('Should remove a favorite item when there is a missing product', async () => {
    const productCode = 'D11242100021'

    const hook = renderHook(useFavouritesListItemActions, {
      wrapper,
      initialProps: productCode,
    })

    server.use(
      http.get('*/cc/kulturapp/users/current/favourites', () =>
        HttpResponse.json(
          {
            favouritesItems: [
              { cartId: 'D11242100020', entryNumber: 122 },
              { product: { code: productCode }, cartId: 'D11242100021', entryNumber: 123 },
              { cartId: 'D11242100022', entryNumber: 124 },
            ],
          },
          { status: 200 },
        ),
      ),
      http.delete(`*/cc/kulturapp/users/current/favourites/entry/${productCode}`, async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return HttpResponse.text('OK', { status: 200 })
      }),
    )

    expect(hook.result.current.isFavorite).toBe(true)

    await act(async () => {
      await hook.result.current.removeFromFavorites()
    })

    expect(hook.result.current.isFavorite).toBe(false)
  })
})
