import { logToBridge } from '../utils'

export const setWebviewLanguage = (language: string, isFirstLoad: boolean) => {
  function setLanguage() {
    try {
      logToBridge('log', ['Setting language', language])
      localStorage.setItem('spartacus⚿⚿language', JSON.stringify(language))
      if (!isFirstLoad) {
        location.reload()
      }
    } catch (error: unknown) {
      logToBridge('error', ['Setting language failed', JSON.stringify(error)])
    }
  }

  // Without this, we get the warning from webkit:
  // "The operation is insecure."
  // See: https://stackoverflow.com/questions/43320932/getting-error-securityerror-dom-exception-18-the-operation-is-insecure-when
  if (document.readyState === 'complete') {
    setLanguage()
  } else {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        setLanguage()
      }
    }
  }
}
