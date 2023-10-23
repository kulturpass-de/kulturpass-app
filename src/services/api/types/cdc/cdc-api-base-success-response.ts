export type CdcApiBaseSuccessResponse = {
  apiVersion: number
  callId: string
  errorCode: number
  errorDetails?: string
  statusCode: number
  statusReason: string
  time: string
}
