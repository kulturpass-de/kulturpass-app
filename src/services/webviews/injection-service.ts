import { logger } from '../logger'

export enum Injections {
  webviewAndroidOffline,
  webviewSetPadding,
  webviewSetLanguage,
  webviewDebugging,
  webviewScrollToTop,
  webviewWindowOnError,
  webviewGoToPage,
  webviewSetTextZoom,
}

/**
 * Handles resolving the scripts, that can be injected into the Webview.
 * As injected scripts could potentially introduce security risks, the inputs need to be sanitized.
 * Required javascript files, that end with ".raw.js" are automatically
 * imported as a string through the custom babel "injected-code-transformer".
 */
class InjectionService {
  private getCodeStr(key: Injections): string {
    switch (key) {
      case Injections.webviewAndroidOffline:
        return require('../../../webview-injected-code/build/webview-android-offline/bundle.raw.js')
      case Injections.webviewSetPadding:
        return require('../../../webview-injected-code/build/webview-set-padding/bundle.raw.js')
      case Injections.webviewSetLanguage:
        return require('../../../webview-injected-code/build/webview-set-language/bundle.raw.js')
      case Injections.webviewDebugging:
        return require('../../../webview-injected-code/build/webview-debugging/bundle.raw.js')
      case Injections.webviewScrollToTop:
        return require('../../../webview-injected-code/build/webview-scroll-to-top/bundle.raw.js')
      case Injections.webviewWindowOnError:
        return require('../../../webview-injected-code/build/webview-window-onerror/bundle.raw.js')
      case Injections.webviewGoToPage:
        return require('../../../webview-injected-code/build/webview-go-to-page/bundle.raw.js')
      case Injections.webviewSetTextZoom:
        return require('../../../webview-injected-code/build/webview-set-text-zoom/bundle.raw.js')
    }
  }

  public webviewAndroidOffline() {
    return this.getCodeStr(Injections.webviewAndroidOffline)
  }

  public webviewSetPadding(contentOffset: number) {
    if (typeof contentOffset !== 'number') {
      logger.warn('webviewSetPadding: contentOffset is not a number')
      return ''
    }
    const code = this.getCodeStr(Injections.webviewSetPadding)
    return `${code}
    kp_webview_set_padding.setWebviewPadding(${contentOffset})

    // Don't remove
    true;`
  }

  public webviewSetTextZoom(zoom: number) {
    if (typeof zoom !== 'number') {
      logger.warn('webviewSetTextZoom: zoom is not a number')
      return ''
    }
    const code = this.getCodeStr(Injections.webviewSetTextZoom)
    return `${code}
    kp_webview_set_text_zoom.setWebviewTextZoom(${zoom})

    // Don't remove
    true;`
  }

  public webviewSetLanguage(language: string, isFirstLoad: boolean) {
    if (typeof language !== 'string' || typeof isFirstLoad !== 'boolean') {
      logger.warn('webviewSetLanguage: language is not a string or isFirstLoad is not a boolean')
      return ''
    }
    const code = this.getCodeStr(Injections.webviewSetLanguage)
    return `${code}
    kp_webview_set_language.setWebviewLanguage(${JSON.stringify(language)}, ${isFirstLoad})

    // Don't remove
    true;`
  }

  public webviewDebugging() {
    return this.getCodeStr(Injections.webviewDebugging)
  }

  public webviewScrollToTop() {
    return this.getCodeStr(Injections.webviewScrollToTop)
  }

  public webviewWindowOnError() {
    return this.getCodeStr(Injections.webviewWindowOnError)
  }

  public webviewGoToPage(uri: string) {
    if (typeof uri !== 'string') {
      logger.warn('webviewGoToPage: uri is not a string')
      return ''
    }
    const code = this.getCodeStr(Injections.webviewGoToPage)
    return `${code}
      kp_webview_go_to_page.webviewGoToPage(${JSON.stringify(uri)})

      // Don't remove
      true;`
  }
}

export const injectionService = new InjectionService()
