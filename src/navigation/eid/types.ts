import { CompositeScreenProps } from '@react-navigation/core'
import { StackScreenProps } from '@react-navigation/stack'
import {
  BankIdSelectBankRouteName,
  BankIdSelectBankRouteParams,
} from '../../features/eid-verification/screens/bankid-select-bank-route'
import {
  EidAboutServiceProviderRouteName,
  EidAboutServiceProviderRouteParams,
} from '../../features/eid-verification/screens/eid-about-service-provider-route'
import {
  EidAboutVerificationRouteName,
  EidAboutVerificationRouteParams,
} from '../../features/eid-verification/screens/eid-about-verification-route'
import { EidCanRouteName, EidCanRouteParams } from '../../features/eid-verification/screens/eid-can-route'
import {
  EidChangePinCompletionRouteName,
  EidChangePinCompletionRouteParams,
} from '../../features/eid-verification/screens/eid-change-pin-completion-route'
import {
  EidInsertCardRouteName,
  EidInsertCardRouteParams,
} from '../../features/eid-verification/screens/eid-insert-card-route'
import { EidNewPinRouteName, EidNewPinRouteParams } from '../../features/eid-verification/screens/eid-new-pin-route'
import {
  EidNFCNotSupportedRouteName,
  EidNFCNotSupportedRouteParams,
} from '../../features/eid-verification/screens/eid-nfc-not-supported-route'
import { EidPinRouteName, EidPinRouteParams } from '../../features/eid-verification/screens/eid-pin-route'
import {
  EidPukInoperativeRouteName,
  EidPukInoperativeRouteParams,
} from '../../features/eid-verification/screens/eid-puk-inoperative-route'
import { EidPukRouteName, EidPukRouteParams } from '../../features/eid-verification/screens/eid-puk-route'
import {
  EidServiceProviderDetailsRouteName,
  EidServiceProviderDetailsRouteParams,
} from '../../features/eid-verification/screens/eid-service-provider-details-route'
import {
  EidTransportPinRouteName,
  EidTransportPinRouteParams,
} from '../../features/eid-verification/screens/eid-transport-pin-route'
import {
  EidVerificationCompletionRouteName,
  EidVerificationCompletionRouteParams,
} from '../../features/eid-verification/screens/eid-verification-completion-route'
import {
  IdentificationSelectionRouteName,
  IdentificationSelectionRouteParams,
} from '../../features/eid-verification/screens/identification-selection-route'
import { RootStackParams } from '../types'

export type EidParamList = {
  [EidAboutVerificationRouteName]: EidAboutVerificationRouteParams
  [EidAboutServiceProviderRouteName]: EidAboutServiceProviderRouteParams
  [EidServiceProviderDetailsRouteName]: EidServiceProviderDetailsRouteParams
  [EidInsertCardRouteName]: EidInsertCardRouteParams
  [EidPinRouteName]: EidPinRouteParams
  [EidTransportPinRouteName]: EidTransportPinRouteParams
  [EidNewPinRouteName]: EidNewPinRouteParams
  [EidCanRouteName]: EidCanRouteParams
  [EidPukRouteName]: EidPukRouteParams
  [EidVerificationCompletionRouteName]: EidVerificationCompletionRouteParams
  [EidChangePinCompletionRouteName]: EidChangePinCompletionRouteParams
  [EidNFCNotSupportedRouteName]: EidNFCNotSupportedRouteParams
  [EidPukInoperativeRouteName]: EidPukInoperativeRouteParams
  [IdentificationSelectionRouteName]: IdentificationSelectionRouteParams
  [BankIdSelectBankRouteName]: BankIdSelectBankRouteParams
}

export type EidScreenProps<RouteName extends keyof EidParamList> = CompositeScreenProps<
  StackScreenProps<EidParamList, RouteName>,
  StackScreenProps<RootStackParams>
>
