import React from 'react'
import { Screen } from '../../components/screen/screen'
import { SpartacusWebView } from '../../features/spartacus-webview/components/webview'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { useEnvironmentConfigurationCommerce } from '../../services/environment-configuration/hooks/use-environment-configuration'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'

export type SearchScreenProps = {}

export const SearchScreen: React.FC<SearchScreenProps> = () => {
  const { buildTestId } = useTestIdBuilder()

  const searchUrl = useEnvironmentConfigurationCommerce().searchUrl
  const { l: language } = useTranslation()

  return (
    <Screen withBasicBackground testID={buildTestId('search')}>
      <SpartacusWebView
        webViewId={WebViewId.Search}
        url={searchUrl}
        testID={buildTestId('screens_search_webview')}
        language={language}
      />
    </Screen>
  )
}
