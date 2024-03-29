import { renderHook } from '@testing-library/react-native'
import React, { PropsWithChildren } from 'react'
import { act } from 'react-test-renderer'
import { StoreProvider } from '../../../services/testing/test-utils'
import { translation, useTranslation } from '../../../services/translation/translation'
import { Language } from '../../../services/translation/types'
import { useLocalizedEnvironmentUrl, getCdcDpsDocumentUrl } from './use-localized-environment-url'

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return <StoreProvider>{children}</StoreProvider>
}

jest.mock('../../../services/environment-configuration/utils', () => {
  return {
    getEnvironmentConfig: jest.fn(() => ({
      cdc: {
        consents: {
          dpsDocumentUrl: {
            de: 'http://localhost/consents/deDpsDocumentUrl',
            en: 'http://localhost/consents/enDpsDocumentUrl',
          },
        },
      },
    })),
  }
})

describe('useLocalizedEnvironmentUrl', () => {
  test('Should return the DE url', async () => {
    translation?.changeLanguage('de')
    const { result } = renderHook(() => useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl), {
      wrapper: Wrapper,
    })

    expect(result.current).toBe('http://localhost/consents/deDpsDocumentUrl')
  })

  test('Should return the EN url', async () => {
    translation?.changeLanguage('de')
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

    await act(() => {
      result.current.cl(Language.en)
    })

    expect(result.current.url).toBe('http://localhost/consents/enDpsDocumentUrl')
  })
})
