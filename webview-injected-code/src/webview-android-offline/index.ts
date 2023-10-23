import { logToBridge } from '../utils'

/**
 * Checks for webpage errors on Android, that start with net::.
 * If some is found, it is emitted over the bridge
 */
try {
  if (/^chrome-error/.test(document.URL)) {
    // extract all p tags, in order to find the error code
    const pItems = document.querySelectorAll('p')

    let errorThrown = false

    pItems.forEach(item => {
      const data = item.innerHTML.trim()

      // try to find the error code string
      if (!errorThrown && /^net::/.test(data)) {
        window.ReactNativeWebView?.postMessage(JSON.stringify({ source: 'MobileApp', type: 'ANDROID_ERROR', data }))
        errorThrown = true
      }
    })

    if (!errorThrown) {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ source: 'MobileApp', type: 'ANDROID_ERROR', data: 'ERR_UNKNOWN' }),
      )
    }
  }
} catch (error: unknown) {
  logToBridge('error', ['Getting android error from page failed', JSON.stringify(error)])
}
