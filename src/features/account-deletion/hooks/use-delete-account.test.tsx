import { renderHook } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React, { PropsWithChildren } from 'react'
import { useSelector } from 'react-redux'
import { act } from 'react-test-renderer'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { StoreProvider } from '../../../services/testing/test-utils'
import { useDeleteAccount } from './use-delete-account'

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <StoreProvider withLoginSession>{children}</StoreProvider>
}

export const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useDeleteAccount', () => {
  test('Should delete account as specified', async () => {
    let setAccountInfoParams: any
    server.use(
      rest.post('http://localhost/cdc/accounts.login', (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            sessionInfo: {
              sessionToken: 'newDummyToken',
              sessionSecret: 'newDummySecret',
            },
          }),
        )
      }),
      rest.post('http://localhost/cdc/accounts.setAccountInfo', async (req, res, ctx) => {
        const params = await req.text()
        // Converting search params without some library...
        const tempUrl = new URL('localhost:1000?' + params)
        setAccountInfoParams = tempUrl.searchParams
        return res(ctx.status(200), ctx.json({}))
      }),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({})),
      ),
    )

    const { result } = renderHook(
      () => {
        const { deleteAccount } = useDeleteAccount()
        const userIsLoggedIn = useSelector(getIsUserLoggedIn)
        return { deleteAccount, userIsLoggedIn }
      },
      { wrapper: Wrapper },
    )

    expect(result.current.userIsLoggedIn).toBe(true)
    expect(setAccountInfoParams).toBeUndefined()
    await act(async () => {
      await result.current.deleteAccount('dummy')
    })
    expect(result.current.userIsLoggedIn).toBe(false)
    expect(setAccountInfoParams.get('oauth_token')).toBe('newDummyToken')
    expect(setAccountInfoParams.get('sig')).toBeTruthy()
    expect(JSON.parse(setAccountInfoParams.get('data')).deletionRequested).toBe(true)
  })
})
