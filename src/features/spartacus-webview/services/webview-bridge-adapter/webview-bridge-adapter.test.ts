import WebView, { WebViewMessageEvent } from 'react-native-webview'

import { BridgeFCNonParsableJson, BridgeFCTimeout, BridgeFCUnknown, BridgeFCUnknownTypeResponse } from './errors'
import { WebViewFunctions, WebViewId } from './types'
import { WebViewBridgeAdapter } from './webview-bridge-adapter'

jest.useFakeTimers()

describe('WebViewBridgeAdapter', () => {
  const mockedInjectJavaScript = jest.fn(message => message)

  const webViewId = 'testWebViewId' as WebViewId
  const mockedWebViewRef: WebView = {
    injectJavaScript: mockedInjectJavaScript,
  } as any

  const bridgeAdapter = new WebViewBridgeAdapter()
  bridgeAdapter.connectWebView(webViewId, mockedWebViewRef)

  const injectedFunctionRegex = /^window\.postMessage\((.*)\); true;$/

  beforeEach(() => {
    mockedInjectJavaScript.mockClear()
  })

  describe('callBridgeFunction', () => {
    test('Should call bridge function with correct format', async () => {
      expect(mockedInjectJavaScript.mock.calls.length).toBe(0)

      const target = 'TEST_TARGET' as keyof WebViewFunctions
      const args = [{ some: 'complex' }, ['serializable', false], 'args', 123456789, null] as any
      const promise = bridgeAdapter.callBridgeFunction(webViewId, target, args)

      jest.runAllTimers()

      expect(mockedInjectJavaScript.mock.results[0].type).toBe('return')

      const injectedJS = mockedInjectJavaScript.mock.results[0].value

      expect(injectedJS).toMatch(injectedFunctionRegex)

      const match = injectedJS.match(injectedFunctionRegex)!
      const functionArguments = JSON.parse(JSON.parse(match[1]))

      expect(typeof functionArguments.id).toBe('string')
      expect(functionArguments.target).toBe(target)
      expect(functionArguments.arguments).toStrictEqual(args)

      await expect(promise).rejects.toThrow()
    })

    test('Should resolve the returned promise upon response with same id', async () => {
      const target = 'TEST_TARGET' as keyof WebViewFunctions
      const argument = 'TEST_ARGUMENT'
      const fncPromise = bridgeAdapter.callBridgeFunction(webViewId, target, [argument] as any)

      const injectedJS = mockedInjectJavaScript.mock.results[0].value
      const match = injectedJS.match(injectedFunctionRegex)!
      const functionArguments = JSON.parse(JSON.parse(match[1]))
      const functionId: string = functionArguments.id

      const responseData = { id: functionId, some: { very: ['complex', false], returned: 123 }, data: null }
      const responseEvent = { nativeEvent: { data: JSON.stringify(responseData) } } as WebViewMessageEvent
      bridgeAdapter.webviewMessageHandler(webViewId, responseEvent)

      await expect(fncPromise).resolves.toStrictEqual(responseData)
    })

    test('Should resolve the returned promise with undefined if the provided webViewId is not available', async () => {
      expect(mockedInjectJavaScript.mock.calls.length).toBe(0)

      const target = 'TEST_TARGET' as keyof WebViewFunctions
      const args = ['TEST_ARGUMENTS'] as any
      const fncPromise = bridgeAdapter.callBridgeFunction('NonAvailableWebViewId' as WebViewId, target, args)

      await expect(fncPromise).resolves.toBeUndefined()
    })

    test('Should reject the returned promise upon response with error property', async () => {
      const target = 'TEST_TARGET' as keyof WebViewFunctions
      const argument = 'TEST_ARGUMENT'
      const fncPromise = bridgeAdapter.callBridgeFunction(webViewId, target, [argument] as any)

      const injectedJS = mockedInjectJavaScript.mock.results[0].value
      const match = injectedJS.match(injectedFunctionRegex)!
      const functionArguments = JSON.parse(JSON.parse(match[1]))
      const functionId: string = functionArguments.id

      const responseData = { id: functionId, error: { errorCode: 'TEST_ERROR' } }
      const responseEvent = { nativeEvent: { data: JSON.stringify(responseData) } } as WebViewMessageEvent
      bridgeAdapter.webviewMessageHandler(webViewId, responseEvent)

      await expect(fncPromise).rejects.toBeInstanceOf(BridgeFCUnknown)
    })

    test('Should throw a BridgeFCTimeout error upon timeout', async () => {
      const fncPromise = bridgeAdapter.callBridgeFunction(webViewId, 'TEST_TARGET' as keyof WebViewFunctions, [])

      jest.runAllTimers()

      await expect(fncPromise).rejects.toBeInstanceOf(BridgeFCTimeout)
    })
  })

  describe('onWebViewEvent', () => {
    test('Should be able to subscribe to events and call the provided callback', async () => {
      const callback = jest.fn()
      const subscription = bridgeAdapter.onWebViewEvent(webViewId, 'TEST_SOURCE' as any, callback)

      const messageData = { source: 'TEST_SOURCE', name: 'test', data: { very: [12431434234], complex: null } }
      const messageEvent = { nativeEvent: { data: JSON.stringify(messageData) } } as WebViewMessageEvent
      bridgeAdapter.webviewMessageHandler(webViewId, messageEvent)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toBeCalledWith(messageData)

      subscription.unsubscribe()
    })

    test('Should not call the provided callback after the subscription was removed', async () => {
      const callback = jest.fn()
      const subscription = bridgeAdapter.onWebViewEvent(webViewId, 'TEST_SOURCE' as any, callback)

      subscription.unsubscribe()

      const messageData = { source: 'TEST_SOURCE' }
      const messageEvent = { nativeEvent: { data: JSON.stringify(messageData) } } as WebViewMessageEvent
      bridgeAdapter.webviewMessageHandler(webViewId, messageEvent)

      expect(callback).toHaveBeenCalledTimes(0)
    })
  })

  describe('webviewMessageHandler', () => {
    test('Should throw when given a non-parsable json message', () => {
      const t = () => {
        const messageEvent = { nativeEvent: { data: 'non parsable json' } } as WebViewMessageEvent
        bridgeAdapter.webviewMessageHandler(webViewId, messageEvent)
      }

      expect(t).toThrow(BridgeFCNonParsableJson)
    })

    test('Should throw when given an object with unknown type of response', () => {
      const t = () => {
        const messageEvent = { nativeEvent: { data: JSON.stringify({}) } } as WebViewMessageEvent
        bridgeAdapter.webviewMessageHandler(webViewId, messageEvent)
      }

      expect(t).toThrow(BridgeFCUnknownTypeResponse)
    })
  })
})
