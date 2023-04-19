import { CdcApiErrorResponse } from '.'

export const isCdcApiErrorResponse = (response: any): response is CdcApiErrorResponse => response.statusCode > 299
