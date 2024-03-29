import 'react-native'

export interface KPCustomModule {
  isBoldTextEnabled: () => Promise<boolean>
}

declare module 'react-native' {
  interface NativeModulesStatic {
    KPCustomModule: KPCustomModule
  }
}
