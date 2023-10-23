import { logToBridge } from '../utils'

try {
  logToBridge('log', ['Patching window.onerror with bridge event handling'])
  window.onerror = function (message, sourcefile, lineno, colno, error) {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        source: 'MobileApp',
        type: 'WINDOW_ERROR',
        data: {
          message: message,
          sourcefile: sourcefile,
          lineno: lineno,
          colno: colno,
          error: error,
        },
      }),
    )

    return true
  }
} catch (error: unknown) {
  logToBridge('error', ['Patching window.onerror failed', JSON.stringify(error)])
}
