export {}

declare global {
  interface Window {
    ReactNativeWebView:
      | {
          postMessage(data: string): void
        }
      | undefined
    alert(msg: string): void
  }
}
