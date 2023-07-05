import { AppStartListening } from '../../../redux/listener-middleware'
import { onCommerceAccessTokenChange } from './on-commerce-access-token-change'
import { onWebViewRouterUrlChange } from './on-webview-router-url-change'
import { onWebViewStateChange } from './on-webview-state-change'

export const addWebviewsEffects = (startListening: AppStartListening) => {
  onCommerceAccessTokenChange(startListening)
  onWebViewRouterUrlChange(startListening)
  onWebViewStateChange(startListening)
}
