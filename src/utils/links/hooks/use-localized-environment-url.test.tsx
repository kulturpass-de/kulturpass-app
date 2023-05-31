import { renderHook } from '@testing-library/react-native'
import { useLocalizedEnvironmentUrl } from './use-localized-environment-url'
import React, { PropsWithChildren } from 'react'
import { StoreProvider } from '../../../services/testing/test-utils'
import { act } from 'react-test-renderer'
import { translation, useTranslation } from '../../../services/translation/translation'
import { Language } from '../../../services/translation/types'
import { getCdcDpsDocumentUrl } from '../../../services/environment-configuration/redux/environment-configuration-selectors'

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <StoreProvider>{children}</StoreProvider>
}

describe('useLocalizedEnvironmentUrl', () => {
  test('Should return the DE url', async () => {
    translation.changeLanguage('de')
    const { result } = renderHook(() => useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl), {
      wrapper: Wrapper,
    })

    await act(() => {})

    expect(result.current).toBe('http://localhost/consents/deDpsDocumentUrl')
  })

  test('Should return the EN url', async () => {
    translation.changeLanguage('de')
    const { result } = renderHook(
      () => {
        const url = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)
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
