import { jestFn } from '../../../../../services/testing/jest-fn'
import { createBridgeAdapterApi } from '../create-bridge-adapter-api'

type BridgeAdapterApi = ReturnType<typeof createBridgeAdapterApi>

export const mockedBridgeAdapterApi = {
  authLogin: jestFn<BridgeAdapterApi['authLogin']>(),
  authLogout: jestFn<BridgeAdapterApi['authLogout']>(),
  routerNavigate: jestFn<BridgeAdapterApi['routerNavigate']>(),
  geolocationSetLocation: jestFn<BridgeAdapterApi['geolocationSetLocation']>(),

  onAuthIsUserLoggedIn: jestFn<BridgeAdapterApi['onAuthIsUserLoggedIn']>(() => ({
    unsubscribe: () => {},
  })),
  onBridge: jestFn<BridgeAdapterApi['onBridge']>(() => ({
    unsubscribe: () => {},
  })),
  onRouterEvents: jestFn<BridgeAdapterApi['onRouterEvents']>(() => ({
    unsubscribe: () => {},
  })),
}

exports.createBridgeAdapterApi = () => mockedBridgeAdapterApi
