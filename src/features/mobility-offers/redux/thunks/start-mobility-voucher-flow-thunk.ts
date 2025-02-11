import { commerceApi } from '../../../../services/api/commerce-api'
import { ErrorWithCode, UnknownError } from '../../../../services/errors/errors'
import { createThunk } from '../../../../services/redux/utils/create-thunk'
import { errorWithCodeToMobilityOffersError, UnsupportedCampaign } from '../../errors/errors'
import { ClaimVoucherCampaignParams, ClaimVoucherCampaignResponse } from '../../types/mobility-voucher-campaign-types'
import { isSupportedTemplate } from '../../utility'

export const startMobilityVoucherFlow = createThunk<ClaimVoucherCampaignResponse, ClaimVoucherCampaignParams>(
  'mobilityOffers/startMobilityVoucherFlow',
  async (params, thunkAPI) => {
    try {
      const response = await thunkAPI.dispatch(commerceApi.endpoints.claimVoucherCampaign.initiate(params)).unwrap()
      if (!isSupportedTemplate(response.template)) {
        throw new UnsupportedCampaign()
      } else {
        return response
      }
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        throw errorWithCodeToMobilityOffersError(error)
      }

      throw new UnknownError('An unexpected error occurred while claiming the voucher.')
    }
  },
)
