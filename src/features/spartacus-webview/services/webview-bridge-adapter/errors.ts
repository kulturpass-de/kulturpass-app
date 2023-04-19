import { ErrorWithCode } from '../../../../services/errors/errors'
import { AnyWebViewFunctionResult } from './types'

export enum BridgeFCErrorCode {
  BRIDGE_FC_ERROR = 'BRIDGE_FC_ERROR',
  BRIDGE_FC_EXECUTION_ERROR = 'BRIDGE_FC_EXECUTION_ERROR',
  BRIDGE_FC_TARGET_NOT_FOUND = 'BRIDGE_FC_TARGET_NOT_FOUND',
  BRIDGE_FC_TIMEOUT = 'BRIDGE_FC_TIMEOUT',
  BRIDGE_FC_UNKNOWN_ERROR = 'BRIDGE_FC_UNKNOWN_ERROR',
  BRIDGE_FC_NON_PARSABLE_JSON = 'BRIDGE_FC_NON_PARSABLE_JSON',
  BRIDGE_FC_UNKNOWN_TYPE_RESPONSE = 'BRIDGE_FC_UNKNOWN_TYPE_RESPONSE',
  BRIDGE_FC_SAME_WEB_VIEW_ID = 'BRIDGE_FC_SAME_WEB_VIEW_ID',
}

export class BridgeFCError extends ErrorWithCode {
  type?: string
  constructor(errorCode: BridgeFCErrorCode = BridgeFCErrorCode.BRIDGE_FC_ERROR, detailCode?: string) {
    super(errorCode, detailCode)
  }
}

export class BridgeFCExecutionError extends BridgeFCError {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(
      BridgeFCErrorCode.BRIDGE_FC_EXECUTION_ERROR,
      detailCode ?? 'A function call via the Bridge Adapter resulted in an error.',
    )
    this.message = message ?? this.message
    this.type = type
  }
}

export class BridgeFCTargetNotFound extends BridgeFCError {
  type?: string

  constructor(detailCode?: string, message?: string, type?: string) {
    super(
      BridgeFCErrorCode.BRIDGE_FC_TARGET_NOT_FOUND,
      detailCode ?? 'The target of a function call via the Bridge Adapter was not found.',
    )
    this.message = message ?? this.message
    this.type = type
  }
}

export class BridgeFCTimeout extends BridgeFCError {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(BridgeFCErrorCode.BRIDGE_FC_TIMEOUT, detailCode ?? 'A function call via the Bridge Adapter timed out.')
    this.message = message ?? this.message
    this.type = type
  }
}

export class BridgeFCUnknown extends BridgeFCError {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(
      BridgeFCErrorCode.BRIDGE_FC_UNKNOWN_ERROR,
      detailCode ?? 'A function call via the Bridge Adapter returned an unknown error.',
    )
    this.message = message ?? this.message
    this.type = type
  }
}

export class BridgeFCNonParsableJson extends BridgeFCError {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(
      BridgeFCErrorCode.BRIDGE_FC_NON_PARSABLE_JSON,
      detailCode ?? 'A function call via the Bridge Adapter returned a non-parsable JSON response.',
    )
    this.message = message ?? this.message
    this.type = type
  }
}

export class BridgeFCUnknownTypeResponse extends BridgeFCError {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(
      BridgeFCErrorCode.BRIDGE_FC_UNKNOWN_TYPE_RESPONSE,
      detailCode ?? 'A function call via the Bridge Adapter returned an unknown type of response.',
    )
    this.message = message ?? this.message
    this.type = type
  }
}
export class BridgeFCSameWebViewId extends BridgeFCError {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(
      BridgeFCErrorCode.BRIDGE_FC_SAME_WEB_VIEW_ID,
      detailCode ??
        'More than one MutableRefObject<WebView> with the same WebViewId are trying to use onInjectJavascriptToWebView',
    )
    this.message = message ?? this.message
    this.type = type
  }
}

export const createBridgeFCErrorFromErrorCode = (
  errorCode: string,
  detailCode?: string,
  message?: string,
  type?: string,
): ErrorWithCode => {
  switch (errorCode) {
    case BridgeFCErrorCode.BRIDGE_FC_EXECUTION_ERROR:
      return new BridgeFCExecutionError(detailCode, message, type)
    case BridgeFCErrorCode.BRIDGE_FC_TARGET_NOT_FOUND:
      return new BridgeFCTargetNotFound(detailCode, message, type)
    case BridgeFCErrorCode.BRIDGE_FC_TIMEOUT:
      return new BridgeFCTimeout(detailCode, message, type)
    case BridgeFCErrorCode.BRIDGE_FC_NON_PARSABLE_JSON:
      return new BridgeFCNonParsableJson(detailCode, message, type)
    case BridgeFCErrorCode.BRIDGE_FC_UNKNOWN_TYPE_RESPONSE:
      return new BridgeFCUnknownTypeResponse(detailCode, message, type)
    case BridgeFCErrorCode.BRIDGE_FC_SAME_WEB_VIEW_ID:
      return new BridgeFCSameWebViewId(detailCode, message, type)
    default:
      return new BridgeFCUnknown(detailCode, message, type)
  }
}

export const getWebViewFunctionResultError = (resultFromWebView: AnyWebViewFunctionResult) => {
  const { error } = resultFromWebView
  if (!error) {
    return
  }

  const { errorCode } = error
  if (!errorCode) {
    return new BridgeFCUnknown(error.detailCode, error.message, error.type)
  }

  const nativeError = createBridgeFCErrorFromErrorCode(errorCode, error.detailCode, error.message, error.type)
  return nativeError
}
