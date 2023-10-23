import { jestFn } from '../../../../../services/testing/jest-fn'
import { createBridgeAdapterApi } from '../create-bridge-adapter-api'

type BridgeAdapterApi = ReturnType<typeof createBridgeAdapterApi>

export const mockedBridgeAdapterApi = {
  authLogin: jestFn<BridgeAdapterApi['authLogin']>(),
  authLogout: jestFn<BridgeAdapterApi['authLogout']>(),
  routerNavigate: jestFn<BridgeAdapterApi['routerNavigate']>(),
  geolocationSetLocation: jestFn<BridgeAdapterApi['geolocationSetLocation']>(),

  onMobileAppEvents: jestFn<BridgeAdapterApi['onMobileAppEvents']>(() => ({
    unsubscribe: () => {},
  })),
  onAuthIsUserLoggedIn: jestFn<BridgeAdapterApi['onAuthIsUserLoggedIn']>(() => ({
    unsubscribe: () => {},
  })),
  onBridge: jestFn<BridgeAdapterApi['onBridge']>(() => ({
    unsubscribe: () => {},
  })),
  onAuth: jestFn<BridgeAdapterApi['onAuth']>(() => ({
    unsubscribe: () => {},
  })),
  onRouterEvents: jestFn<BridgeAdapterApi['onRouterEvents']>(() => ({
    unsubscribe: () => {},
  })),
  onSearch: jestFn<BridgeAdapterApi['onSearch']>(() => ({
    unsubscribe: () => {},
  })),
}

exports.createBridgeAdapterApi = () => mockedBridgeAdapterApi
