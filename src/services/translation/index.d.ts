import 'i18next'

import { resources, defaultNS, fallbackLng } from './setup'

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
    returnEmptyString: false
    defaultNS: typeof defaultNS
    resources: (typeof resources)[typeof fallbackLng]
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)[typeof fallbackLng]
  }
}
