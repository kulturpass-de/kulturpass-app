import { defaultNS } from './setup'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    // note: due to tsc performance reasons, we don't use the official way of typing the i18n
  }
}
