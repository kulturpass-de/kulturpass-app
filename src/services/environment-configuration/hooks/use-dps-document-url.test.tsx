import { renderHook } from '@testing-library/react-native'
import { useDpsDocumentUrl } from './use-dps-document-url'
import React, { PropsWithChildren } from 'react'
import { StoreProvider } from '../../testing/test-utils'
import { act } from 'react-test-renderer'
import { translation, useTranslation } from '../../translation/translation'
import { Language } from '../../translation/types'

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <StoreProvider>{children}</StoreProvider>
}

describe('useDpsDocumentUrl', () => {
  test('Should return the DE url', async () => {
    translation.changeLanguage('de')
    const { result } = renderHook(() => useDpsDocumentUrl(), {
      wrapper: Wrapper,
    })

    await act(() => {})

    expect(result.current).toBe('http://localhost/consents/deDpsDocumentUrl')
  })

  test('Should return the EN url', async () => {
    translation.changeLanguage('de')
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
      result.current.cl(Language.en)
    })

    expect(result.current.url).toBe('http://localhost/consents/enDpsDocumentUrl')
  })
})
