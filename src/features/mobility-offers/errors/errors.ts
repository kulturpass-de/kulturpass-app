import { ErrorWithCode, HttpError } from '../../../services/errors/errors'

export enum CampaignErrorCode {
  CAMPAIGN_NOT_FOUND = 'CampaignNotFoundError',
  CAMPAIGN_NOT_STARTED = 'CampaignNotStartedError',
  CAMPAIGN_ACCESS_EXPIRED = 'CampaignAccessExpiredError',
  CAMPAIGN_CODE_EXPIRED = 'CampaignCodeExpiredError',
  CAMPAIGN_NO_VOUCHERS_LEFT = 'CampaignNoVouchersLeftError',
  CAMPAIGN_NOT_ELIGIBLE = 'CampaignNotEligibleError',
  CAMPAIGN_ACCESS_DENIED = 'CampaignAccessDenied',
  USER_NOT_LOGGED_IN = 'UserNotLoggedIn',
  UNSUPPORTED_CAMPAIGN = 'UnsupportedCampaign',
}

export type MobilityCustomError = CampaignNotEligibleError | CampaignCodeExpiredError
export class CampaignError extends ErrorWithCode {
  constructor(code: CampaignErrorCode, message?: string, subject?: string) {
    super(code, message)
    this.name = code
    this.message = message ?? this.message
    this.detailCode = message ?? this.message
    this.subject = subject
    this.presentableErrorCode = true
  }
}

export class CampaignNotFoundError extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.CAMPAIGN_NOT_FOUND, message)
    this.message = message ?? this.message
  }
}

export class CampaignNotStartedError extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.CAMPAIGN_NOT_STARTED, message)
    this.message = message ?? this.message
  }
}

export class CampaignAccessExpiredError extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.CAMPAIGN_ACCESS_EXPIRED, message)
    this.message = message ?? this.message
  }
}

export class CampaignNoVouchersLeftError extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.CAMPAIGN_NO_VOUCHERS_LEFT, message)
    this.message = message ?? this.message
  }
}

export class CampaignCodeExpiredError extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.CAMPAIGN_CODE_EXPIRED, message)
    this.message = message ?? this.message
  }
}

export class CampaignNotEligibleError extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.CAMPAIGN_NOT_ELIGIBLE)
    this.message = message ?? this.message
  }
}

export class CampaignAccessDeniedError extends CampaignError {
  type?: string
  constructor(message?: string) {
    super(CampaignErrorCode.CAMPAIGN_ACCESS_DENIED)
    this.message = message ?? this.message
  }
}

export class UserNotLoggedIn extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.USER_NOT_LOGGED_IN, message)
    this.message = message ?? this.message
    this.presentableErrorCode = false
  }
}

export class UnsupportedCampaign extends CampaignError {
  constructor(message?: string) {
    super(CampaignErrorCode.UNSUPPORTED_CAMPAIGN, message)
    this.message = message ?? this.message
    this.presentableErrorCode = false
  }
}

export const errorWithCodeToMobilityOffersError = (error: ErrorWithCode): ErrorWithCode => {
  if (error instanceof HttpError && error.errors !== undefined) {
    for (const err of error.errors) {
      switch (err.type) {
        case CampaignErrorCode.CAMPAIGN_NOT_ELIGIBLE:
          return new CampaignNotEligibleError(err.subject)
        case CampaignErrorCode.CAMPAIGN_CODE_EXPIRED:
          return new CampaignCodeExpiredError(err.subject)
        case CampaignErrorCode.CAMPAIGN_ACCESS_DENIED:
          return new CampaignAccessDeniedError(err.message)
        case CampaignErrorCode.CAMPAIGN_NOT_FOUND:
          return new CampaignNotFoundError(err.message)
        case CampaignErrorCode.CAMPAIGN_NOT_STARTED:
          return new CampaignNotStartedError(err.message)
        case CampaignErrorCode.CAMPAIGN_ACCESS_EXPIRED:
          return new CampaignAccessExpiredError(err.message)
        case CampaignErrorCode.CAMPAIGN_NO_VOUCHERS_LEFT:
          return new CampaignNoVouchersLeftError(err.message)
      }
    }
  }
  return error
}
