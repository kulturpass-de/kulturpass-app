import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { commerceApi } from '../../../../services/api/commerce-api'
import { configureMockStore, mockedLoggedInAuthState } from '../../../../services/testing/configure-mock-store'
import { CampaignCodeExpiredError } from '../../errors/errors'
import {
  ClaimVoucherCampaignErrorResponse,
  ClaimVoucherCampaignParams,
  NewVoucherCampaignResponse,
} from '../../types/mobility-voucher-campaign-types'
import { mobilityVoucherFlow } from './mobility-voucher-flow-thunk'

describe('mobilityVoucherFlow Thunk Tests', () => {
  const server = setupServer()

  const store = configureMockStore({ middlewares: [commerceApi.middleware], preloadedState: mockedLoggedInAuthState })

  const mockParams: ClaimVoucherCampaignParams = { campaignCode: 'MBF5678UZ9' }
  const mockSuccessResponse: NewVoucherCampaignResponse = {
    code: 'flix-test-2025',
    template: 'flix',
    description: 'FlixTrain',
    claimStartDate: '2025-01-01T00:00:00+01:00',
    claimEndDate: '2026-01-01T00:00:00+01:00',
    accessEndDate: '2026-01-01T00:00:00+01:00',
    redemptionUrl: 'https://flix.com',
    validityInHours: 48,
    validityPeriodEnd: '2025-01-31',
    voucher: {
      code: 'MBF5678UZ9',
      validTo: '2026-01-15T00:00:00+01:00',
    },
  }

  const mockFailureResponse: ClaimVoucherCampaignErrorResponse = {
    errors: [
      {
        message: 'Campaign code is expired.',
        type: 'CampaignCodeExpiredError',
        subject: '[kp-cli] With targetYearOfBirth 2007',
      },
    ],
  }

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should handle a successful voucher flow', async () => {
    server.use(
      http.post('*/voucherCampaigns/MBF5678UZ9/claim', () => HttpResponse.json(mockSuccessResponse, { status: 200 })),
    )
    const response = await store.dispatch(mobilityVoucherFlow(mockParams)).unwrap()
    expect(store.findAction(commerceApi.endpoints.postNewVoucherCampaign.matchPending)).toBeDefined()
    expect(response).toEqual(mockSuccessResponse)
  })
  it('should handle a error voucher flow', async () => {
    server.use(
      http.post('*/voucherCampaigns/MBF5678UZ9/claim', () => HttpResponse.json(mockFailureResponse, { status: 400 })),
    )
    try {
      await store.dispatch(mobilityVoucherFlow(mockParams)).unwrap()
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(CampaignCodeExpiredError)
    }
  })
})
