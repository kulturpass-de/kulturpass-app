import { colors } from '../colors'
import {
  ButtonColorMappings,
  ColorMappings,
  PreferencesButtonColors,
  ReservationListStatusTextColors,
  TryAgainButtonColors,
} from '../types'
import { toTransparentColor } from '../utils'

export const colorMappings: ColorMappings = {
  labelColor: colors.moonDarkest,
  secondaryLabelColor: colors.moonBase,
  primaryBackground: colors.basicBackground,
  secondaryBackground: colors.basicWhite,
  tabBarDivider: colors.moonDarkest,
  boxShadow: colors.moonDarkest,
  infoBox: colors.secondaryLighter,
  budgetBarBorder: colors.basicBlack,
  budgetBarReserved: colors.secondaryBase,
  budgetBarAvailable: colors.basicBlack,
  listItemBorder: colors.basicBlack,
  footerBorder: colors.moonDarkest,
  reservationsTabBarIndicator: colors.moonDarkest,
  textFieldPlaceholder: colors.moonBase,
  textFieldBorder: colors.moonDarkest,
  textFieldBorderError: colors.redBase,
  textFieldBorderFocused: colors.primaryLight,
  checkboxBorder: colors.moonDarkest,
  preferencesCategoryBorder: colors.moonDarkest,
  preferencesCategoryShadow: colors.moonDarkest,
  emphasizedPriceColor: colors.basicWhite,
  emphasizedPriceBackground: colors.primaryDarkest,
  divider: toTransparentColor(colors.basicBlack, 0.1),
  alertBackdrop: toTransparentColor(colors.moonDarker, 0.8),
  tokenBackground: toTransparentColor(colors.basicWhite, 0.8),
  tokenText: colors.basicBlack,
  tokenTextDisabled: colors.moonBase,
  chipBackground: colors.basicWhite,
  chipBackgroundActive: colors.moonDarkest,
  chipBorder: colors.moonDarkest,
  chipText: colors.moonDarkest,
  chipTextActive: colors.basicWhite,
}

export const preferenceButtonColors: PreferencesButtonColors = {
  concertAndStage: colors.yellowLightest,
  museumAndPark: colors.primaryLightest,
  cinema: colors.secondaryLightest,
  book: colors.yellowLightest,
  audioMedia: colors.primaryLightest,
  sheetMusic: colors.secondaryLightest,
  musicInstrument: colors.yellowLightest,
  unknown: colors.secondaryLightest,
}

export const reservationListStatusTextColors: ReservationListStatusTextColors = {
  READY_FOR_PICKUP: colors.greenDarkest,
  RECEIVED: colors.moonDarkest,
  COMPLETED: colors.moonDarkest,
  CANCELLED: colors.redDarkest,
  CANCELLING: colors.redDarkest,
  default: colors.primaryDarkest,
}

export const buttonColorMappings: ButtonColorMappings = {
  primary: {
    containerBackground: colors.moonDarkest,
    text: colors.basicWhite,
    containerBackgroundPressed: toTransparentColor(colors.moonDarkest, 0.7),
    containerBorderPressed: colors.moonDarkest,
    containerBackgroundDisabled: toTransparentColor(colors.moonDarkest, 0.55),
  },
  secondary: {
    containerBackground: colors.basicWhite,
    containerBorder: colors.moonDarkest,
    text: colors.moonDarkest,
    containerBackgroundPressed: toTransparentColor(colors.primaryLightest, 0.5),
    opacityDisabled: 0.55,
  },
  tertiary: {
    containerBackground: colors.basicWhite,
    containerBorder: colors.moonDarkest,
    text: colors.moonDarkest,
    shadow: colors.primaryLighter,
    containerBackgroundPressed: colors.tertiaryButtonBackgroundPressed,
    shadowPressed: colors.moonDarkest,
    containerBorderDisabled: toTransparentColor(colors.moonDarkest, 0.55),
    shadowDisabled: toTransparentColor(colors.moonDarkest, 0.55),
    disabledText: toTransparentColor(colors.moonDarkest, 0.55),
  },
  white: {
    containerBackground: colors.basicWhite,
    text: colors.moonDarkest,
    containerBackgroundPressed: toTransparentColor(colors.primaryLightest, 0.5),
    opacityDisabled: 0.55,
  },
  transparent: {
    containerBackground: toTransparentColor(colors.basicWhite, 0.0),
    text: colors.moonDarkest,
    pressedText: colors.primaryDarkest,
    opacityDisabled: 0.55,
  },
  error: {
    containerBackground: colors.redDarkest,
    containerBorder: colors.redDarkest,
    text: colors.basicWhite,
    containerBackgroundPressed: toTransparentColor(colors.redDarkest, 0.6),
    opacityDisabled: 0.55,
  },
}

const baseTryAgainButtonColors = {
  text: colors.moonDarkest,
  containerBorder: colors.moonDarkest,
  shadow: colors.moonDarkest,
  opacityDisabled: 0.55,
}

export const tryAgainButtonColors: TryAgainButtonColors = [
  {
    containerBackground: colors.greenLight,
    containerBackgroundPressed: colors.greenBase,
    ...baseTryAgainButtonColors,
  },
  {
    containerBackground: colors.secondaryLight,
    containerBackgroundPressed: colors.secondaryBase,
    ...baseTryAgainButtonColors,
  },
  {
    containerBackground: colors.yellowLight,
    containerBackgroundPressed: colors.yellowBase,
    ...baseTryAgainButtonColors,
  },
  {
    containerBackground: colors.primaryLighter,
    containerBackgroundPressed: colors.primaryLight,
    ...baseTryAgainButtonColors,
  },
]
