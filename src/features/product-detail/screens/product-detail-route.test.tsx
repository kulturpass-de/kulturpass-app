import { createStackNavigator } from '@react-navigation/stack'
import { screen } from '@testing-library/react-native'
import React from 'react'
import { renderScreen } from '../../../services/testing/test-utils'
import { useProductDetailHeaderHeight } from '../hooks/use-product-detail-header-height'
import { useQueryProductDetail } from '../hooks/use-query-product-detail'
import { ProductDetailRoute, ProductDetailRouteName, ProductDetailRouteParams } from './product-detail-route'

jest.mock('../hooks/use-query-product-detail')
jest.mock('../hooks/use-product-detail-header-height')

const useQueryProductDetailMock = useQueryProductDetail as jest.Mock
const useProductDetailHeaderHeightMock = useProductDetailHeaderHeight as jest.Mock

const PRODUCT_1 = {
  code: '0001',
  name: 'First Product',
  description: '',
  categories: [],
}

const PRODUCT_2 = {
  code: '0002',
  name: 'Second Product',
  description: '',
  categories: [],
}

describe('ProductDetailRoute', () => {
  const Stack = createStackNavigator()

  const Wrapper: React.FC<ProductDetailRouteParams> = props => (
    <Stack.Navigator>
      <Stack.Screen name={ProductDetailRouteName} component={ProductDetailRoute as any} initialParams={props} />
    </Stack.Navigator>
  )

  useProductDetailHeaderHeightMock.mockReturnValue({
    headerMinHeight: 42,
    headerMaxHeight: 150,
    headerHeightDiff: 108,
    onHeaderSetMaxHeight: jest.fn,
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

    expect(screen.queryByText(PRODUCT_1.name)).toBeOnTheScreen()

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

    expect(screen.queryByText(PRODUCT_2.name)).toBeOnTheScreen()
  })
})
