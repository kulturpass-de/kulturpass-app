import React from 'react'
import { BridgeAdapterAPI } from '../../../spartacus-webview/services/webview-bridge-adapter/create-bridge-adapter-api'
import { AccountVerifiedAlert } from './account-verified-alert'
import { useAccountVerifiedWebViewHandler } from './use-account-verified-webview-handler'

export type AccountVerifiedWebViewHandlerProps = {
  bridgeAdapterApi: BridgeAdapterAPI
}

export const AccountVerifiedWebViewHandler = ({ bridgeAdapterApi }: AccountVerifiedWebViewHandlerProps) => {
  const { showAlert, reset } = useAccountVerifiedWebViewHandler(bridgeAdapterApi)

  if (showAlert) {
    return <AccountVerifiedAlert onDismiss={reset} />
  }

  return null
}
