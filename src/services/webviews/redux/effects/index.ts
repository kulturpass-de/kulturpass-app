import { AppStartListening } from '../../../redux/listener-middleware'
import { onCommerceAccessTokenChange } from './on-commerce-access-token-change'
import { onWebViewRouteUrlChange } from './on-webview-route-url-change'
import { onWebViewStateChange } from './on-webview-state-change'

export const addWebviewsEffects = (startListening: AppStartListening) => {
  onCommerceAccessTokenChange(startListening)
  onWebViewRouteUrlChange(startListening)
  onWebViewStateChange(startListening)
}
