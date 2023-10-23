export enum Injections {
  webviewAndroidOffline,
  webviewSetPadding,
  webviewSetLanguage,
  webviewDebugging,
  webviewScrollToTop,
  webviewWindowOnError,
  webviewGoToPage,
}

/**
 * Handles resolving the scripts, that can be injected into the Webview
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
    }
  }

  public webviewAndroidOffline() {
    return this.getCodeStr(Injections.webviewAndroidOffline)
  }

  public webviewSetPadding(contentOffset: number) {
    const code = this.getCodeStr(Injections.webviewSetPadding)
    return `${code}
    kp_webview_set_padding.setWebviewPadding(${contentOffset})

    // Don't remove
    true;`
  }

  public webviewSetLanguage(language: string, isFirstLoad: boolean) {
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
    const code = this.getCodeStr(Injections.webviewGoToPage)
    return `${code}
      kp_webview_go_to_page.webviewGoToPage(${JSON.stringify(uri)})

      // Don't remove
      true;`
  }
}

export const injectionService = new InjectionService()
