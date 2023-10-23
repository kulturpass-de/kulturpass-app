export const logToBridge = (type: 'log' | 'debug' | 'info' | 'warn' | 'error', log: any[]) => {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({ source: 'MobileApp', type: 'CONSOLE', data: { type, log: log } }),
  )
}
