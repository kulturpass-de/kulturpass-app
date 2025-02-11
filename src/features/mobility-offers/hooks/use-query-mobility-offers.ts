import { useEffect } from 'react'
import { commerceApi } from '../../../services/api/commerce-api'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { MobilityOffersVoucherCampaignsParams } from '../types/mobility-offers-types'

export const useQueryMobilityOffersVoucherCampaigns = (
  params: MobilityOffersVoucherCampaignsParams = { query: 'flix' },
) => {
  const { data, error, isLoading } = commerceApi.useGetMobilityOffersVoucherCampaignsQuery(params)

  useEffect(() => {
    if (error) {
      const errorToShow = error instanceof ErrorWithCode ? error : new UnknownError('An unknown error occurred')
      ErrorAlertManager.current?.showError(errorToShow)
    }
  }, [error])

  return { data, isLoading, error }
}
