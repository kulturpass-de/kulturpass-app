import { WebViewFunctions, WebViewEvents, AnyWebViewFunctionResult, AnyWebViewEvent } from './types'

/**
 * WebViewFunctions
 */

export const isAnyWebViewFunctionResult = (object: any): object is AnyWebViewFunctionResult => 'id' in object

export const isWebViewFunctionResult = <WebViewFunctionName extends keyof WebViewFunctions>(
  resultFromWebView: AnyWebViewFunctionResult,
  id: string,
): resultFromWebView is WebViewFunctions[WebViewFunctionName]['result'] => resultFromWebView.id === id

/**
 * WebViewEvents
 */

export const isAnyWebViewEvent = (object: any): object is AnyWebViewEvent => 'source' in object

export const isWebViewEvent = <Source extends keyof WebViewEvents>(
  eventFromWebView: AnyWebViewEvent,
  source: Source,
): eventFromWebView is WebViewEvents[Source] => eventFromWebView.source === source
