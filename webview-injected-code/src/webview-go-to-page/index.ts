import { logToBridge } from '../utils'

export const webviewGoToPage = (uri: string) => {
  if (typeof uri !== 'string') {
    return
  }
  try {
    var injectedUri = new URL(uri)

    if (document.location.origin !== injectedUri.origin || document.location.pathname !== injectedUri.pathname) {
      logToBridge('log', ['Go to page'])
      document.location.href = injectedUri.href
    }
  } catch (error: unknown) {
    logToBridge('error', ['Go to page failed', JSON.stringify(error)])
  }
}
