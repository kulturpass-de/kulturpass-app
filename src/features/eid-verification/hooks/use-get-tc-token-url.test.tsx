import { renderHook } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React, { PropsWithChildren } from 'react'
import { useDispatch } from 'react-redux'
import { act } from 'react-test-renderer'
import { AppConfig, appCoreSlice } from '../../../services/redux/slices/app-core'
import { StoreProvider } from '../../../services/testing/test-utils'
import { useGetTcTokenUrl } from './use-get-tc-token-url'

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <StoreProvider withLoginSession>{children}</StoreProvider>
}

const server = setupServer()

describe('useGetTcTokenUrl', () => {
  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  test('should create a valid tcTokenUrl', async () => {
    const tcTokenUrlSubdomains = ['test-subdom']
    const id_token = 'test-id-token'

    const mockedAppConfig = {
      eid: {
        tcTokenUrlSubdomains: tcTokenUrlSubdomains,
      },
    } as AppConfig

    server.use(rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id_token }))))

    const { result } = renderHook(
      () => {
        const getTcTokenUrl = useGetTcTokenUrl()
        const dispatch = useDispatch()
        return { getTcTokenUrl, dispatch }
      },
      { wrapper: Wrapper },
    )
    await act(() => {
      result.current.dispatch(appCoreSlice.actions.setAppConfig(mockedAppConfig))
    })

    let generatedTcTokenUrl = ''
    await act(async () => {
      generatedTcTokenUrl = await result.current.getTcTokenUrl()
    })

    expect(generatedTcTokenUrl).toBe(`http://${tcTokenUrlSubdomains[0]}.localhost/eid?idToken=${id_token}`)
  })

  test('should pick a random subdomain and create a valid tcTokenUrl', async () => {
    const tcTokenUrlSubdomains = ['test-subdom1', 'test-subdom2', 'test-subdom3']
    const id_token = 'test-id-token'

    const mockedAppConfig = {
      eid: {
        tcTokenUrlSubdomains: tcTokenUrlSubdomains,
      },
    } as AppConfig

    server.use(rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id_token }))))

    const { result } = renderHook(
      () => {
        const getTcTokenUrl = useGetTcTokenUrl()
        const dispatch = useDispatch()
        return { getTcTokenUrl, dispatch }
      },
      { wrapper: Wrapper },
    )
    await act(() => {
      result.current.dispatch(appCoreSlice.actions.setAppConfig(mockedAppConfig))
    })

    let generatedTcTokenUrl = ''
    await act(async () => {
      generatedTcTokenUrl = await result.current.getTcTokenUrl()
    })

    expect(tcTokenUrlSubdomains.some(subdomain => generatedTcTokenUrl.includes(subdomain))).toBe(true)
  })

  test('should use tcTokenUrlDefaultSubdomain if no valid subdomain in appconfig', async () => {
    const tcTokenUrlSubdomains = ['$§39', '§"$%§%', '()']
    const id_token = 'test-id-token'

    const mockedAppConfig = {
      eid: {
        tcTokenUrlSubdomains: tcTokenUrlSubdomains,
      },
    } as AppConfig

    server.use(rest.post('*/accounts.getAccountInfo', (_req, res, ctx) => res(ctx.status(200), ctx.json({ id_token }))))

    const { result } = renderHook(
      () => {
        const getTcTokenUrl = useGetTcTokenUrl()
        const dispatch = useDispatch()
        return { getTcTokenUrl, dispatch }
      },
      { wrapper: Wrapper },
    )
    await act(() => {
      result.current.dispatch(appCoreSlice.actions.setAppConfig(mockedAppConfig))
    })

    let generatedTcTokenUrl = ''
    await act(async () => {
      generatedTcTokenUrl = await result.current.getTcTokenUrl()
    })

    expect(generatedTcTokenUrl).toBe(`http://testsubdomain.localhost/eid?idToken=${id_token}`)
  })
})
