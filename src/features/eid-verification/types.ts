import { AccessRights, Certificate, Messages } from '@sap/react-native-ausweisapp2-wrapper'

export type Flow = 'Auth' | 'ChangePin'

export enum EidFlowResponse {
  RetryPin,
  RetryCan,
  RetryPuk,
  EidMessageError,
  EidAuthSuccess,
  EidChangePinSuccess,
  EidNFCNotSupported,
  EidAuthFlowStarted,
  EidSDKInitSuccess,
}

export type EidRetry =
  | {
      response: EidFlowResponse.RetryCan | EidFlowResponse.RetryPuk
      // Set to true, if this is the first time, this retry happened in the flow
      // Needed, so that we can show an error message (i.e. "Wrong CAN")
      retry: boolean
    }
  | { response: EidFlowResponse.RetryPin; retryCounter?: number }

export type EidMessageError = {
  response: EidFlowResponse.EidMessageError
  msg: Messages
}

export type EidAuthSuccess = {
  response: EidFlowResponse.EidAuthSuccess
}

export type EidChangePinSuccess = {
  response: EidFlowResponse.EidChangePinSuccess
}

export type EidNFCNotSupported = {
  response: EidFlowResponse.EidNFCNotSupported
}

export type EidAuthFlowStarted = {
  response: EidFlowResponse.EidAuthFlowStarted
  accessRights: AccessRights
  certificate: Certificate
}

export type EidSDKInitSuccess = {
  response: EidFlowResponse.EidSDKInitSuccess
}

export type EidUserInput = {
  pin?: string
  newPin?: string
  can?: string
  puk?: string
}
