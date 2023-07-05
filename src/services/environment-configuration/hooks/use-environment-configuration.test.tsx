import { act, renderHook } from '@testing-library/react-native'
import React from 'react'
import { PropsWithChildren } from 'react'
import { useDispatch } from 'react-redux'
import { StoreProvider } from '../../testing/test-utils'
import { EnvironmentConfigurationContent } from '../environment-configuration'
import { setEnvironmentConfiguration } from '../redux/environment-configuration-slice'
import { useEnvironmentConfiguration } from './use-environment-configuration'

jest.mock('../environment-configuration', () => ({
  environmentConfigurations: {
    data: [
      {
        name: 'test',
      },
      {
        name: 'test2',
      },
    ],
  } as EnvironmentConfigurationContent,
}))

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <StoreProvider>{children}</StoreProvider>
}

jest.mock('../../redux/effects/on-set-environment-configuration', () => ({
  onSetEnvironmentConfiguration: jest.fn(() => {}),
}))

describe('useEnvironmentConfiguration', () => {
  it('should return the current selected environment configuration', async () => {
    const { result } = renderHook(
      () => {
        const envConfig = useEnvironmentConfiguration()
        const dispatch = useDispatch()
        return { envConfig, dispatch }
      },
      { wrapper: Wrapper },
    )

    await act(() => {
      result.current.dispatch(setEnvironmentConfiguration('test'))
    })

    expect(result.current.envConfig.name).toBe('test')

    await act(() => {
      result.current.dispatch(setEnvironmentConfiguration('test2'))
    })

    expect(result.current.envConfig.name).toBe('test2')
  })

  it('should fall back to the first env config if the env config name is invalid', async () => {
    const { result } = renderHook(
      () => {
        const envConfig = useEnvironmentConfiguration()
        const dispatch = useDispatch()
        return { envConfig, dispatch }
      },
      { wrapper: Wrapper },
    )

    await act(() => {
      result.current.dispatch(setEnvironmentConfiguration('NONVALID'))
    })

    expect(result.current.envConfig.name).toBe('test')

    await act(() => {
      result.current.dispatch(setEnvironmentConfiguration(undefined as any))
    })

    expect(result.current.envConfig.name).toBe('test')
  })
})
