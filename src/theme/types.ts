import { ButtonVariant } from '../components/button/types'

export type ColorMappings = {
  labelColor: string
  secondaryLabelColor: string
  primaryBackground: string
  secondaryBackground: string
  tabBarDivider: string
  boxShadow: string
  infoBox: string
  budgetBarBorder: string
  budgetBarReserved: string
  budgetBarAvailable: string
  listItemBorder: string
  footerBorder: string
  reservationsTabBarIndicator: string
  textFieldPlaceholder: string
  textFieldBorder: string
  textFieldBorderError: string
  textFieldBorderFocused: string
  checkboxBorder: string
  preferencesCategoryBorder: string
  preferencesCategoryShadow: string
  emphasizedPriceColor: string
  emphasizedPriceBackground: string
  divider: string
  alertBackdrop: string
  tokenBackground: string
  tokenText: string
  tokenTextDisabled: string
  chipBackground: string
  chipBackgroundActive: string
  chipBorder: string
  chipText: string
  chipTextActive: string
}

export type PreferencesButtonColors = {
  concertAndStage: string
  museumAndPark: string
  cinema: string
  book: string
  audioMedia: string
  sheetMusic: string
  musicInstrument: string
  unknown: string
}

export type ReservationListStatusTextColors = {
  READY_FOR_PICKUP: string
  RECEIVED: string
  COMPLETED: string
  CANCELLING: string
  CANCELLED: string
  default: string
}

export type ButtonColors = {
  containerBackground: string
  containerBorder?: string
  text: string
  containerBackgroundPressed?: string
  containerBorderPressed?: string
  containerBackgroundDisabled?: string
  containerBorderDisabled?: string
  shadow?: string
  shadowPressed?: string
  shadowDisabled?: string
  opacity?: number
  opacityPressed?: number
  opacityDisabled?: number
  pressedText?: string
  disabledText?: string
}

export type ButtonColorMappings = Record<ButtonVariant, ButtonColors>

export type TryAgainButtonColors = Array<ButtonColors>
