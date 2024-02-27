import { createStackNavigator } from '@react-navigation/stack'
import { fireEvent, screen } from '@testing-library/react-native'
import React from 'react'
import { useProductDetailHeaderHeight } from '../../features/product-detail/hooks/use-product-detail-header-height'
import { useQueryProductDetail } from '../../features/product-detail/hooks/use-query-product-detail'
import { Offer } from '../../services/api/types/commerce/api-types'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import * as utils from '../../utils/links/utils'
import { OfferSelectionFilterRouteConfig } from './offer-selection-filter-route'
import { OfferSelectionRouteConfig } from './offer-selection-route'
import { ProductDetailRoute, ProductDetailRouteName, ProductDetailRouteParams } from './product-detail-route'
import { ProductReportRoute, ProductReportRouteName } from './product-report-route'

jest.mock('../../features/product-detail/hooks/use-query-product-detail')
jest.mock('../../features/product-detail/hooks/use-product-detail-header-height')

const useQueryProductDetailMock = useQueryProductDetail as jest.Mock
const useProductDetailHeaderHeightMock = useProductDetailHeaderHeight as jest.Mock

const PRODUCT_1 = {
  code: '0001',
  name: 'First Product',
  description: '',
  categories: [],
  offers: [
    {
      id: 'firstID',
      code: 'firstCode',
      shopName: 'first shop name',
      shopId: 'first shop id',
      shopDistance: 2,
      price: {
        currencyIso: 'EUR',
        value: 20,
      },
    },
    {
      id: 'secondId',
      code: 'secondCode',
      shopName: 'second shop name',
      shopId: 'second shop id',
      shopDistance: 1,
      price: {
        currencyIso: 'EUR',
        value: 10,
      },
    },
  ] as Offer[],
}

const PRODUCT_2 = {
  code: '0002',
  name: 'Second Product',
  description: '',
  categories: [],
}

const allOffersButtonTestId = buildTestId('productDetail_allOffers_button')
const offerSelectionScreenTestId = buildTestId('offerSelection_screen')
const offerSelectionCityTokenTestId = buildTestId('offerSelection_city_token')
const offerSelectionLocationTokenTestId = buildTestId('offerSelection_location_token')
const offerSelectionNoneTokenTestId = buildTestId('offerSelection_none_token')

const offerSelectionFilterScreenTestId = buildTestId('offerSelectionFilter_screen')
const offerSelectionFilterCityOrPostalCodeInputTestId = buildTestId('offerSelectionFilter_postalCodeOrCity_input')
const offerSelectionFilterSubmitButtonTestId = buildTestId('offerSelectionFilter_postalCode_submit_button')

const reportButtonTestId = buildTestId('productDetail_report_button')

const reportScreenTestId = buildTestId('productDetail_report_screen')
const reportScreenAcceptTestId = buildTestId('productDetail_report_accept_button')
const reportScreenAbortTestId = buildTestId('productDetail_report_abort_button')

describe('ProductDetailRoute', () => {
  jest.useFakeTimers()

  afterAll(() => {
    jest.resetAllMocks()
  })

  const Stack = createStackNavigator<any>()

  const Wrapper: React.FC<ProductDetailRouteParams> = props => (
    <Stack.Navigator>
      <Stack.Screen name={ProductDetailRouteName} component={ProductDetailRoute as any} initialParams={props} />
      <Stack.Screen name={OfferSelectionRouteConfig.name} component={OfferSelectionRouteConfig.component as any} />
      <Stack.Screen
        name={OfferSelectionFilterRouteConfig.name}
        component={OfferSelectionFilterRouteConfig.component as any}
      />
      <Stack.Screen name={ProductReportRouteName} component={ProductReportRoute as any} />
    </Stack.Navigator>
  )

  useProductDetailHeaderHeightMock.mockReturnValue({
    headerMinHeight: 42,
    headerMaxHeight: 150,
    headerHeightDiff: 108,
    onHeaderSetMaxHeight: jest.fn,
  })

  test('Should open PRODUCT_1 and navigate to the offer selection screen, having no location selected (location disabled)', async () => {
    // -----------------------------------------------------------------------
    // set hook to return product 1, not loading

    useQueryProductDetailMock.mockReturnValue({
      isFetching: false,
      isLoading: false,
      data: PRODUCT_1,
    })

    // open screen with product 1

    renderScreen(<Wrapper productCode={PRODUCT_1.code} randomMode={false} offerId={'firstID'} />)

    expect(await screen.findByTestId(allOffersButtonTestId)).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(allOffersButtonTestId))

    expect(await screen.findByTestId(offerSelectionScreenTestId)).toBeOnTheScreen()

    expect(await screen.findByTestId(offerSelectionNoneTokenTestId)).toBeOnTheScreen()
  })

  test('Should open PRODUCT_1 and navigate to the offer selection screen, having location "Berlin" selected, also in the filter screen', async () => {
    // -----------------------------------------------------------------------
    // set hook to return product 1, not loading

    useQueryProductDetailMock.mockReturnValue({
      isFetching: false,
      isLoading: false,
      data: PRODUCT_1,
    })

    // open screen with product 1

    renderScreen(
      <Wrapper
        productCode={PRODUCT_1.code}
        randomMode={false}
        offersByLocation={{
          provider: 'city',
          location: { id: 'berlin0', latitude: 0.1, longitude: 0.2, name: 'Berlin' },
        }}
        offerId={'firstID'}
      />,
    )

    expect(await screen.findByTestId(allOffersButtonTestId)).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(allOffersButtonTestId))

    expect(await screen.findByTestId(offerSelectionScreenTestId)).toBeOnTheScreen()

    expect(await screen.findByTestId(offerSelectionCityTokenTestId)).toHaveTextContent('Berlin')

    fireEvent.press(screen.getByTestId(offerSelectionCityTokenTestId))

    expect(await screen.findByTestId(offerSelectionFilterScreenTestId)).toBeOnTheScreen()

    expect(await screen.findByTestId(offerSelectionFilterCityOrPostalCodeInputTestId)).toBeOnTheScreen()

    let inputElement = await screen.findByTestId(offerSelectionFilterCityOrPostalCodeInputTestId)
    expect(inputElement.props?.value).toEqual('Berlin')

    expect(await screen.findByTestId(offerSelectionFilterSubmitButtonTestId)).toBeEnabled()
  })

  test('Should open PRODUCT_1 and navigate to the offer selection screen, having the default location selected (location enabled)', async () => {
    // -----------------------------------------------------------------------
    // set hook to return product 1, not loading

    useQueryProductDetailMock.mockReturnValue({
      isFetching: false,
      isLoading: false,
      data: PRODUCT_1,
    })

    // open screen with product 1

    renderScreen(
      <Wrapper
        productCode={PRODUCT_1.code}
        randomMode={false}
        offersByLocation={{ provider: 'location' }}
        offerId={'firstID'}
      />,
    )

    expect(await screen.findByTestId(allOffersButtonTestId)).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(allOffersButtonTestId))

    expect(await screen.findByTestId(offerSelectionScreenTestId)).toBeOnTheScreen()

    expect(await screen.findByTestId(offerSelectionLocationTokenTestId)).toBeOnTheScreen()
  })

  test('Should open PRODUCT_1 and navigate to the report screen, navigate back, navigate to the report screen and send an email with the correct parameters', async () => {
    const spyOnSendMail = jest.spyOn(utils, 'sendMail')

    // -----------------------------------------------------------------------
    // set hook to return product 1, not loading

    useQueryProductDetailMock.mockReturnValue({
      isFetching: false,
      isLoading: false,
      data: PRODUCT_1,
    })

    // open screen with product 1

    renderScreen(<Wrapper productCode={PRODUCT_1.code} randomMode={false} offerId={'secondID'} />)

    expect(screen.queryByTestId(reportButtonTestId)).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(reportButtonTestId))

    // should be on the report screen

    expect(screen.queryByTestId(reportScreenTestId)).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(reportScreenAbortTestId))

    // should be back on the PDP

    expect(spyOnSendMail).not.toHaveBeenCalled()
    expect(screen.queryByTestId(reportScreenTestId)).not.toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(reportButtonTestId))

    fireEvent.press(screen.getByTestId(reportScreenAcceptTestId))

    // should be on the report screen and pressed the button to send a mail

    expect(spyOnSendMail).toHaveBeenCalledWith(
      ...[
        'meldung@kulturpass.de',
        'App - unzulässiges Angebot melden',
        `Bitte beschreibe hier kurz das Angebot, und aus welchen Gründen du dieses Angebot meldest.\n\n\nTechnische Informationen - bitte nicht bearbeiten / ändern:\nProdukt: 0001\nAngebotsnummer: secondCode\nAnbieter: second shop name (second shop id)`,
      ],
    )
  })

  test('Should open PRODUCT_1, then PRODUCT_2 and have their correct titles displayed', async () => {
    // -----------------------------------------------------------------------
    // set hook to return product 1, not loading

    useQueryProductDetailMock.mockReturnValue({
      isFetching: false,
      isLoading: false,
      data: PRODUCT_1,
    })

    // open screen with product 1

    renderScreen(<Wrapper productCode={PRODUCT_1.code} randomMode={false} />)

    // expect product 1 to be displayed

    expect(await screen.findByText(PRODUCT_1.name)).toBeOnTheScreen()
    expect(await screen.findByTestId(reportButtonTestId)).toBeOnTheScreen()

    // -----------------------------------------------------------------------
    // set hook to return product 1, but loading product 2

    useQueryProductDetailMock.mockReturnValue({
      isFetching: true,
      isLoading: false,
      data: PRODUCT_1,
    })

    // open screen with product 2, but product 1 is still being returned

    renderScreen(<Wrapper productCode={PRODUCT_2.code} randomMode={false} />)

    // do not display product 1, since product 2 is expected (still fetching)

    expect(screen.queryByText(PRODUCT_1.name)).not.toBeOnTheScreen()
    expect(screen.queryByTestId(reportButtonTestId)).not.toBeOnTheScreen()

    // -----------------------------------------------------------------------
    // set hook to return product 2, not loading

    useQueryProductDetailMock.mockReturnValue({
      isFetching: false,
      isLoading: false,
      data: PRODUCT_2,
    })

    // open screen with product 2

    renderScreen(<Wrapper productCode={PRODUCT_2.code} randomMode={false} />)

    // expect product 2 to be displayed

    expect(await screen.findByText(PRODUCT_2.name)).toBeOnTheScreen()
    expect(await screen.findByTestId(reportButtonTestId)).toBeOnTheScreen()
  })
})
