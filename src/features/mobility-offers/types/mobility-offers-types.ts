export type MobilityOffersVoucherCampaigns = {
  code: string
  template: string
  description: string
}
export type MobilityOffersVoucherCampaignsParams = {
  query: string
}
export type MobilityOffersVoucherCampaignsResponse = {
  campaigns: Array<MobilityOffersVoucherCampaigns>
}
