export type ClaimVoucherCampaignParams = {
  campaignCode: string | null
}
export type PostVoucherCampaignParams = {
  campaignCode: string
}

export type PostMobilityVoucherBody = Pick<PostVoucherCampaignParams, 'campaignCode'>

export type Voucher = {
  code: string
  validTo: string
}

export type ClaimVoucherCampaignResponse = {
  code: string
  template: string
  description: string
  claimStartDate: string
  claimEndDate: string
  accessEndDate: string
  redemptionUrl: string
  validityInHours: number
  validityPeriodEnd: string
  voucher?: Voucher
}

export type NewVoucherCampaignResponse = {
  code: string
  template: string
  description: string
  claimStartDate: string
  claimEndDate: string
  accessEndDate: string
  redemptionUrl: string
  validityInHours: number
  validityPeriodEnd: string
  voucher?: Voucher
}

export type ClaimVoucherCampaignErrorResponse = {
  errors: Array<{
    message: string
    subject: string
    type: string
  }>
}
