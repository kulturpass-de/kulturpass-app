import React from 'react'
import { useSelector } from 'react-redux'

import { Screen } from '../../components/screen/screen'
import { SpartacusWebView } from '../../features/spartacus-webview/components/webview'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { getCommerceSearchUrl } from '../../services/environment-configuration/redux/environment-configuration-selectors'

export type SearchScreenProps = {}

export const SearchScreen: React.FC<SearchScreenProps> = () => {
  const { buildTestId } = useTestIdBuilder()

  const searchUrl = useSelector(getCommerceSearchUrl)

  return (
    <Screen withBasicBackground testID={buildTestId('search')}>
      <SpartacusWebView webViewId={WebViewId.Search} url={searchUrl} testID={buildTestId('screens_search_webview')} />
    </Screen>
  )
}
