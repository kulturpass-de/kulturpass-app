/* eslint-disable no-undef */
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

const crypto = require('crypto');
const stream = require('stream');
const buffer = require('buffer');

global.crypto = crypto;
global.stream = stream;
global.buffer = buffer;

jest.mock('react-native-device-info', () => require('react-native-device-info/jest/react-native-device-info-mock'));

jest.mock('@react-native-async-storage/async-storage', () => {
  const mock = require('@react-native-async-storage/async-storage/jest/async-storage-mock');
  return {
    ...mock,
    setItem: async (...args) => mock.setItem(...args),
  };
});

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  const WebView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      goBack: jest.fn(),
      goForward: jest.fn(),
      reload: jest.fn(),
      stopLoading: jest.fn(),
      injectJavaScript: jest.fn(),
      requestFocus: jest.fn(),
      postMessage: jest.fn(),
      clearFormData: jest.fn(),
      clearCache: jest.fn(),
      clearHistory: jest.fn(),
    }));
    return <View {...props} />;
  });

  return {
    WebView,
    default: WebView,
    __esModule: true,
  };
});

jest.mock('react-native-encrypted-storage', () => {
  const store = {};
  return {
    setItem: jest.fn(async (key, value) => {
      store[key] = value;
    }),
    getItem: jest.fn(async key => {
      return store[key];
    }),
    deleteItem: jest.fn(async key => {
      delete store[key];
    }),
  };
});

jest.mock('./node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

jest.mock('./src/theme/hooks/use-theme');
jest.mock('./src/theme/hooks/use-text-styles');
jest.mock('./src/utils/accessibility/hooks/use-is-screen-reader-active');
jest.mock('./src/utils/accessibility/hooks/use-is-reduce-motion-active');
jest.mock('./src/utils/accessibility/hooks/use-is-bold-text-enabled');
jest.mock('./src/services/webviews/injection-service');
jest.mock('./src/services/api/redux/hooks/use-offline-order-detail');
jest.mock('./src/services/api/redux/hooks/use-offline-product-detail');
jest.mock('./src/services/api/redux/hooks/use-offline-reservations');
jest.mock('./src/features/spartacus-webview/hooks/use-webview-is-bold-font-enabled');

jest.mock('./src/env', () => {
  return {
    env: {
      BRIDGE_FC_DEFAULT_TIMEOUT_MS: 1000,
      DEV_MENU: false,
      AA2_DEVELOPER_MODE: true,
      DEBUG_TRANSLATION: false,
      ENVIRONMENTS: JSON.stringify({
        $schema: 'https://kulturpass.sap.com/json-schema/environment-config.yml',
        data: [
          {
            name: 'test',
            appInformation: {
              imprintUrl: {
                de: 'http://localhost/consents/deImprintUrl',
                en: 'http://localhost/consents/enImprintUrl',
              },
              openSourceLegalNoticeUrl: {
                de: 'http://localhost/consents/deOpenSourceLegalNoticeUrl',
                en: 'http://localhost/consents/enOpenSourceLegalNoticeUrl',
              },
            },
            commerce: {
              baseUrl: 'http://localhost/cc',
              baseSiteId: 'kulturapp',
              auth: {
                tokenEndpoint: 'http://localhost/authorizationserver/oauth/token',
                revocationEndpoint: 'http://localhost/authorizationserver/oauth/revoke',
                clientId: 'mobile_android',
                clientSecret: 'secret',
              },
              homeUrl: 'http://localhost',
              searchUrl: 'http://localhost/search',
            },
            cdc: {
              baseUrl: 'http://localhost/cdc',
              apiKey: '4_jE2Ib4o6tead7E4YAt4sNQ',
              consents: {
                dpsDocumentUrl: {
                  de: 'http://localhost/consents/deDpsDocumentUrl',
                  en: 'http://localhost/consents/enDpsDocumentUrl',
                },
                eulaDocumentUrl: {
                  de: 'http://localhost/consents/deEulaDocumentUrl',
                  en: 'http://localhost/consents/enEulaDocumentUrl',
                },
              },
            },
            eid: {
              tcTokenUrl: 'http://%s.localhost/eid',
              tcTokenUrlDefaultSubdomain: 'testsubdomain',
            },
            faq: {
              homeUrl: {
                de: 'http://localhost/consents/deFaqHomeUrl',
                en: 'http://localhost/consents/enFaqHomeUrl',
              },
            },
            appConfig: {
              url: 'http://localhost/appConfig/url',
              initialValue: 'initialValue',
              publicKey: 'publicKey',
              backupPublicKey: 'backupPublicKey',
            },
          },
        ],
      }),
    },
  };
});

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: (_config, reducers) => reducers,
  };
});

jest.mock('redux-persist/integration/react', () => ({ PersistGate: props => props.children }));

let mockedAppConfig = {
  appVersions: { min: '0.5.55' },
  eid: {
    tcTokenUrlSubdomains: ['test'],
  },
};

jest.mock('./src/services/redux/utils/verify-jws-with-jwk', () => ({
  verifyJwsWithJwk: () => Promise.resolve(JSON.stringify(mockedAppConfig)),
}));

jest.mock('@react-native-clipboard/clipboard', () =>
  require('@react-native-clipboard/clipboard/jest/clipboard-mock.js'),
);
