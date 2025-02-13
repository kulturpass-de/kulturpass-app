import { commerceApi } from '../../../../services/api/commerce-api'
import { ErrorWithCode, UnknownError } from '../../../../services/errors/errors'
import { createThunk } from '../../../../services/redux/utils/create-thunk'
import { errorWithCodeToMobilityOffersError } from '../../errors/errors'
import { ClaimVoucherCampaignParams, NewVoucherCampaignResponse } from '../../types/mobility-voucher-campaign-types'

export const mobilityVoucherFlow = createThunk<NewVoucherCampaignResponse, ClaimVoucherCampaignParams>(
  'mobilityOffers/mobilityVoucherFlow',
  async (params, thunkAPI) => {
    try {
      const response = await thunkAPI.dispatch(commerceApi.endpoints.postNewVoucherCampaign.initiate(params)).unwrap()
      thunkAPI.dispatch(commerceApi.util.invalidateTags(['voucher-claim', 'mobility-offers-voucher-campaigns']))
      return response
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        throw errorWithCodeToMobilityOffersError(error)
      }
      throw new UnknownError('An unexpected error occurred while claiming the voucher.')
    }
  },
)
