/**
 * Timeouts used for asyncified communication with AusweisApp2 SDK.
 * If AA2 SDK does not respond in time, an AA2Timeout error will be shown.
 * All timeout values are in ms
 */

const DEFAULT_TIMEOUT = 40000

export const AA2_TIMEOUTS = {
  /**
   * Relevant for useInitAA2Sdk
   */
  INIT: DEFAULT_TIMEOUT,
  GET_SET_API_LEVEL: DEFAULT_TIMEOUT,
  /**
   * Relevant for useStartAA2Auth
   */
  RUN_AUTH: 60000,
  GET_CERTIFICATE: DEFAULT_TIMEOUT,
  /**
   * Relevant for useStartAA2ChangePin
   */
  CHANGE_PIN: DEFAULT_TIMEOUT,
  /**
   * Relevant for useStartCardScanning
   */
  SET_NEW_PIN: DEFAULT_TIMEOUT,
  SET_PIN: DEFAULT_TIMEOUT,
  SET_CAN: DEFAULT_TIMEOUT,
  SET_PUK: DEFAULT_TIMEOUT,
  ACCEPT: DEFAULT_TIMEOUT,
  GET_STATUS: DEFAULT_TIMEOUT,
  /**
   * Relevant for useCancelFlow, EidChangePinCompletionRoute, EidVerificationCompletionRoute
   */
  STOP: DEFAULT_TIMEOUT,
  /**
   * Relevant for EidPinRoute when switching to change pin flow
   */
  CANCEL: DEFAULT_TIMEOUT,
}
