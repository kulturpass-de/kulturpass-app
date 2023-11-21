import { renderHook } from '@testing-library/react-native'
import { HttpResponse, http } from 'msw'
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
      http.post('http://localhost/cdc/accounts.login', () =>
        HttpResponse.json(
          {
            sessionInfo: {
              sessionToken: 'newDummyToken',
              sessionSecret: 'newDummySecret',
            },
          },
          { status: 200 },
        ),
      ),
      http.post('http://localhost/cdc/accounts.setAccountInfo', async ({ request: req }) => {
        const params = await req.text()
        // Converting search params without some library...
        const tempUrl = new URL('localhost:1000?' + params)
        setAccountInfoParams = tempUrl.searchParams
        return HttpResponse.json({}, { status: 200 })
      }),
      http.post('*/accounts.logout', () => HttpResponse.json({}, { status: 200 })),
      http.post('http://localhost/authorizationserver/oauth/revoke', () => HttpResponse.json({}, { status: 200 })),
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
