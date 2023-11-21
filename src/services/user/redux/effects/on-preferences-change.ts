import { SpartacusBridge } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { BridgeToAllError } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { logger } from '../../../logger'
import { AppStartListening, ListenerEffect, ListenerPredicate } from '../../../redux/listener-middleware'

/**
 * Determines if the effect should run
 */
export const onPreferencesChangePredicate: ListenerPredicate = action => {
  return (
    cdcApi.endpoints.accountsSetAccountInfoSigned.matchFulfilled(action) ||
    cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.matchFulfilled(action)
  )
}
/**
 * Runs if the predicate returns true
 */
export const onPreferencesChangeEffect: ListenerEffect = async (_action, listenerApi) => {
  logger.log('onPreferencesChangeEffect force update the commerce profile')
  try {
    await listenerApi
      .dispatch(commerceApi.endpoints.getProfile.initiate({ forceUpdate: true }, { forceRefetch: true }))
      .unwrap()
    const results = await webViewBridgeAdapter.callBridgeFunctionToAll(
      SpartacusBridge.FunctionCall.Target.UserProfileRefresh,
      [],
    )
    results.forEach(result => {
      if (result.status === 'rejected') {
        const reason: BridgeToAllError = result.reason
        logger.logError(`${reason.webViewId} onPreferencesChangeEffect getProfile`, reason.error)
      }
    })
  } catch (error: unknown) {
    logger.logError('onPreferencesChangeEffect getProfile', error)
  }
}

export const onPreferencesChange = (startListening: AppStartListening) =>
  startListening({ predicate: onPreferencesChangePredicate, effect: onPreferencesChangeEffect })
