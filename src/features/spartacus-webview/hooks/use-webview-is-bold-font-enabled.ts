import { useEffect } from 'react'
import { useIsBoldTextEnabled } from '../../../utils/accessibility/hooks/use-is-bold-text-enabled'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../services/webview-bridge-adapter/types'
import { useWebViewBridgeAdapterContext } from '../services/webview-bridge-adapter/webview-bridge-adapter-provider'

export const useWebviewIsBoldFontEnabled = (webViewId: WebViewId) => {
  const isBold = useIsBoldTextEnabled()
  const webViewBridgeAdapter = useWebViewBridgeAdapterContext()

  useEffect(() => {
    webViewBridgeAdapter.callBridgeFunction(webViewId, SpartacusBridge.FunctionCall.Target.IsBold, [isBold])
  }, [isBold, webViewBridgeAdapter, webViewId])
}
