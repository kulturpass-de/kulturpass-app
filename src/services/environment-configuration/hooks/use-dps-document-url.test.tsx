import { renderHook } from '@testing-library/react-native'
import i18next from 'i18next'
import { useDpsDocumentUrl } from './use-dps-document-url'
import React, { PropsWithChildren } from 'react'
import { I18nProvider, StoreProvider } from '../../testing/test-utils'
import { act } from 'react-test-renderer'
import { useTranslation } from '../../translation/translation'

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <StoreProvider>
      <I18nProvider>{children}</I18nProvider>
    </StoreProvider>
  )
}

describe('useDpsDocumentUrl', () => {
  test('Should return the DE url', async () => {
    i18next.language = 'de'
    const { result } = renderHook(() => useDpsDocumentUrl(), {
      wrapper: Wrapper,
    })

    await act(() => {})

    expect(result.current).toBe('http://localhost/consents/deDpsDocumentUrl')
  })

  test('Should return the EN url', async () => {
    i18next.language = 'en'
    const { result } = renderHook(
      () => {
        const url = useDpsDocumentUrl()
        const { cl } = useTranslation()
        return { cl, url }
      },
      {
        wrapper: Wrapper,
      },
    )

    await act(() => {})

    await act(() => {
      result.current.cl('en')
    })

    expect(result.current.url).toBe('http://localhost/consents/enDpsDocumentUrl')
  })
})
