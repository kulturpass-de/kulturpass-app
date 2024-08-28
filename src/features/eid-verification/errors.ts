import { AA2Messages, Auth, Card, ChangePin, FailureCodes, TimeoutError } from '@sap/react-native-ausweisapp2-wrapper'
import { ErrorWithCode } from '../../services/errors/errors'

export enum AA2ErrorCode {
  AA2_ERROR = 'AA2_ERROR',
  AA2_AUTH_ERROR_RESULT = 'AA2_AUTH_ERROR_RESULT',
  AA2_AUTH_ERROR = 'AA2_AUTH_ERROR',
  AA2_INIT_ERROR = 'AA2_INIT_ERROR',
  AA2_BAD_STATE = 'AA2_BAD_STATE',
  AA2_INTERNAL_ERROR = 'AA2_INTERNAL_ERROR',
  AA2_INVALID_MESSAGE = 'AA2_INVALID_MESSAGE',
  AA2_UNKNOWN_COMMAND = 'AA2_UNKNOWN_COMMAND',
  AA2_BELOW_MIN_YEAR_OF_BIRTH = 'AA2_BELOW_MIN_YEAR_OF_BIRTH',
  AA2_BELOW_MIN_AGE = 'AA2_BELOW_MIN_AGE',
  AA2_FOREIGN_RESIDENCY = 'AA2_FOREIGN_RESIDENCY',
  AA2_PSEUDONYM_ALREADY_IN_USE = 'AA2_PSEUDONYM_ALREADY_IN_USE',
  AA2_CARD_DEACTIVATED = 'AA2_CARD_DEACTIVATED',
  AA2_TIMEOUT = 'AA2_TIMEOUT',
  AA2_ACCEPT_TIMEOUT = 'AA2_ACCEPT_TIMEOUT',
  AA2_SET_PIN_TIMEOUT = 'AA2_SET_PIN_TIMEOUT',
  AA2_CARD_REMOVED = 'AA2_CARD_REMOVED',
  AA2_CARD_VALIDATION_FAILED = 'AA2_CARD_VALIDATION_FAILED',
  AA2_CARD_AUTHENTICITY_VALIDATION_FAILED = 'AA2_CARD_AUTHENTICITY_VALIDATION_FAILED',
}

export class AA2Error extends ErrorWithCode {
  type?: string
  constructor(errorCode: AA2ErrorCode = AA2ErrorCode.AA2_ERROR, detailCode?: string) {
    super(errorCode, detailCode)
  }
}

export class AA2AuthErrorResultError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_AUTH_ERROR_RESULT, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2AuthError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_AUTH_ERROR, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2InitError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_INIT_ERROR, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2BadState extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_BAD_STATE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2InternalError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_INTERNAL_ERROR, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2InvalidMessage extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_INVALID_MESSAGE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2UnknownCommand extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_UNKNOWN_COMMAND, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

/**
 * User is too young to be verified
 */
export class AA2BelowMinYearOfBirth extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_BELOW_MIN_YEAR_OF_BIRTH, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

/**
 * User is too old to be verified
 */
export class AA2BelowMinAge extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_BELOW_MIN_AGE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2ForeignResidency extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_FOREIGN_RESIDENCY, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}
export class AA2PseudonymAlreadyInUse extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_PSEUDONYM_ALREADY_IN_USE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2CardDeactivated extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_CARD_DEACTIVATED, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2Timeout extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_TIMEOUT, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2AcceptTimeout extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_ACCEPT_TIMEOUT, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2SetPinTimeout extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_SET_PIN_TIMEOUT, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2CardRemoved extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_CARD_REMOVED, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2CardValidationFailed extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_CARD_VALIDATION_FAILED, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2CardAuthenticityValidationFailed extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_CARD_AUTHENTICITY_VALIDATION_FAILED, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export const createAA2ErrorFromMessage = (message: AA2Messages): ErrorWithCode => {
  switch (message) {
    case AA2Messages.BadState:
      return new AA2BadState()
    case AA2Messages.InternalError:
      return new AA2InternalError()
    case AA2Messages.Invalid:
      return new AA2InvalidMessage()
    case AA2Messages.UnknownCommand:
      return new AA2UnknownCommand()
    default:
      return new AA2Error()
  }
}

/**
 * Extract a detailed code out of the `Auth` AusweisApp2 SDK Message
 */
export const extractDetailCode = (authMsg: Auth): string | undefined => {
  const reason = authMsg.result?.reason
  if (reason !== undefined) {
    return reason
  }

  const detailCodeSplit = authMsg.result?.minor?.split('#')
  const detailCode = detailCodeSplit && detailCodeSplit[detailCodeSplit?.length]
  if (detailCode !== undefined) {
    return detailCode
  }

  return authMsg.error
}

export const isTimeoutError = (error: unknown): boolean => {
  return error instanceof TimeoutError
}

/**
 * Check if `Auth` AusweisApp2 SDK Message is a user cancellation error
 */
export const isErrorUserCancellation = (authMsg: Auth): boolean => {
  return (
    authMsg.result?.minor?.endsWith('#cancellationByUser') === true &&
    authMsg.result.reason === FailureCodes.User_Cancelled
  )
}

export const isCardDeactivated = (card?: Card | null): boolean => {
  return card?.deactivated === true
}

/**
 * Extract error from AA2 Auth message url propertry, by checking for a errorCode query parameter.
 * @param authMsg The Auth message to be checked
 * @returns AA2Error if any error was found, else undefined
 */
export const extractAuthResultUrlQueryError = (authMsg: Auth): AA2Error | undefined => {
  if (authMsg.url !== undefined) {
    const errorCode: string | undefined = authMsg.url.match(/^.*errorCode=([^&]+).*$/)?.[1]
    if (errorCode !== undefined) {
      return errorCodeToAA2Error(errorCode)
    }
  }
}

export const errorCodeToAA2Error = (errorCode: string): AA2Error => {
  switch (errorCode) {
    case 'BELOW_MIN_YEAR_OF_BIRTH':
      return new AA2BelowMinYearOfBirth()
    case 'BELOW_MIN_AGE':
      return new AA2BelowMinAge()
    case 'FOREIGN_RESIDENCY':
      return new AA2ForeignResidency()
    case 'PSEUDONYM_ALREADY_IN_USE':
      return new AA2PseudonymAlreadyInUse()
    default:
      return new AA2AuthError(errorCode)
  }
}

/**
 * Convert FailureCode that is found in the reason property of Auth or Change Pin Message to ErrorWithCode
 * @param reason reason property of Auth or Change Pin Message
 * @returns AA2Error if matching else undefined
 */
export const reasonToError = (reason?: FailureCodes): AA2Error | undefined => {
  switch (reason) {
    case FailureCodes.Card_Removed:
    case FailureCodes.Did_Authenticate_Eac2_Card_Command_Failed:
      return new AA2CardRemoved()
    case FailureCodes.Connect_Card_Eid_Inactive:
      return new AA2CardDeactivated()
    case FailureCodes.Get_TcToken_Invalid_Data:
      return new AA2InitError()
    case FailureCodes.Start_Paos_Response_Error:
      return new AA2CardValidationFailed()
    case FailureCodes.Process_Certificates_From_Eac2_Cvc_Chain_Missing:
      return new AA2CardAuthenticityValidationFailed()
  }
}

export const handleAuthError = (
  message: Auth,
  shouldCloseOnCancellation: boolean,
  handleClose: () => void,
  handlePUKInoperative: () => void,
) => {
  const majorRes = message.result?.major
  if (majorRes?.endsWith('#error') === true) {
    if (isErrorUserCancellation(message)) {
      if (shouldCloseOnCancellation) {
        handleClose()
      }
      return
    }

    const reasonError = reasonToError(message.result?.reason)

    if (reasonError !== undefined) {
      throw reasonError
    }

    if (message.result?.reason === FailureCodes.Establish_Pace_Channel_Puk_Inoperative) {
      handlePUKInoperative()
      return
    }

    const detailCode = extractDetailCode(message)
    throw new AA2AuthErrorResultError(detailCode, message.result?.message ?? message.result?.description)
  } else if (message.error !== undefined) {
    throw new AA2AuthError(message.error)
  }
}

export const handleChangePinError = (
  message: ChangePin,
  shouldCloseOnCancellation: boolean,
  handleClose: () => void,
) => {
  if (message.success === false) {
    if (message.reason === FailureCodes.User_Cancelled) {
      if (shouldCloseOnCancellation) {
        handleClose()
      }
      return
    }

    const reasonError = reasonToError(message.reason)

    if (reasonError !== undefined) {
      throw reasonError
    }

    throw new AA2AuthErrorResultError(message.reason)
  }
}
